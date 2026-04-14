import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"
import { Prisma } from "@prisma/client"

// Simple in-memory rate limiter for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

// Periodic cleanup to prevent memory leak from failed login attempts
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    loginAttempts.forEach((record, username) => {
      if (now - record.lastAttempt > LOCKOUT_TIME * 2) {
        loginAttempts.delete(username);
      }
    });
  }, LOCKOUT_TIME);
}

function checkLoginRateLimit(username: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(username);
  
  if (!record) {
    loginAttempts.set(username, { count: 1, lastAttempt: now });
    return true;
  }
  
  // Reset if lockout time passed
  if (now - record.lastAttempt > LOCKOUT_TIME) {
    loginAttempts.set(username, { count: 1, lastAttempt: now });
    return true;
  }
  
  // Check if locked out
  if (record.count >= MAX_ATTEMPTS) {
    return false;
  }
  
  record.count++;
  record.lastAttempt = now;
  return true;
}

function resetLoginAttempts(username: string) {
  loginAttempts.delete(username);
}

function normalizeCredentialIdentifier(value: string): string {
  const trimmedValue = value.trim();
  return trimmedValue.includes('@') ? trimmedValue.toLowerCase() : trimmedValue;
}

function buildCredentialLookup(identifier: string): Prisma.UserWhereInput {
  const normalizedIdentifier = normalizeCredentialIdentifier(identifier);
  const isEmail = normalizedIdentifier.includes('@');

  if (isEmail) {
    return {
      email: normalizedIdentifier,
    };
  }

  return {
    username: normalizedIdentifier,
  };
}

// Sanitize URL by removing extra spaces, duplicate protocols, and trailing slashes
const sanitizeUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  
  // Remove all whitespace first
  let cleaned = url.replace(/\s+/g, '');
  
  // Handle multiple https:// or http:// occurrences (keep the last one)
  // This handles cases like 'https://https://example.com' or 'https://   https://example.com'
  const protocolMatches = cleaned.match(/https?:\/\//gi);
  if (protocolMatches && protocolMatches.length > 1) {
    // Find the last occurrence of a protocol and take everything from there
    const lastHttpsIndex = cleaned.lastIndexOf('https://');
    const lastHttpIndex = cleaned.lastIndexOf('http://');
    const lastProtocolIndex = Math.max(lastHttpsIndex, lastHttpIndex);
    if (lastProtocolIndex > 0) {
      cleaned = cleaned.substring(lastProtocolIndex);
    }
  }
  
  // Remove trailing slash
  cleaned = cleaned.replace(/\/$/, '');
  
  // Validate it's a proper URL format
  try {
    new URL(cleaned);
    return cleaned;
  } catch {
    console.error(`⚠️ Invalid NEXTAUTH_URL format: "${url}" (cleaned to: "${cleaned}")`);
    return undefined;
  }
};

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.error('⚠️ WARNING: NEXTAUTH_SECRET is not set! NextAuth will not work in production.');
  if (process.env.NODE_ENV === 'production') {
    throw new Error('NEXTAUTH_SECRET is required in production');
  }
}

if (!process.env.NEXTAUTH_URL && process.env.NODE_ENV === 'production') {
  console.error('⚠️ WARNING: NEXTAUTH_URL is not set! NextAuth may not work correctly.');
}

// Get sanitized NEXTAUTH_URL
const nextAuthUrl = sanitizeUrl(process.env.NEXTAUTH_URL);

export const authOptions: NextAuthOptions = {
  // Set the base URL for NextAuth (sanitized)
  ...(nextAuthUrl && { url: nextAuthUrl }),
  secret: process.env.NEXTAUTH_SECRET, // Explicitly set secret
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username or Email", type: "text", placeholder: "jsmith or jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const identifier = normalizeCredentialIdentifier(credentials.username)

        // Rate limit check - prevent brute force
        if (!checkLoginRateLimit(identifier)) {
          throw new Error('Too many login attempts. Please try again in 15 minutes.')
        }

        const user = await prisma.user.findFirst({
          where: buildCredentialLookup(identifier),
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        // Block login if email is not verified
        if (!user.emailVerified) {
          throw new Error('Please verify your email before logging in.')
        }

        // Reset attempts on successful login
        resetLoginAttempts(identifier)

        return {
          id: user.id,
          name: user.username,
          email: user.email ?? user.username,
          image: `/api/avatar/${user.username}`,
          role: user.role,
          username: user.username
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours (shorter session duration)
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' && process.env.NEXTAUTH_URL?.startsWith('https://')
        ? `__Secure-next-auth.session-token`
        : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production' && process.env.NEXTAUTH_URL?.startsWith('https://'),
      },
    },
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }
        session.user.name = token.name;
        session.user.image = token.picture;
        session.user.role = token.role;
        session.user.username = token.username ?? session.user.username ?? session.user.name ?? '';
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id; // Store user ID in token
        token.name = user.name;
        token.picture = user.image;
        token.role = user.role;
        token.username = user.username;
      }
      if (trigger === "update" && session) {
        token.name = session.name ?? token.name;
        token.username = session.username ?? token.username;
        // Ensure we don't store base64 in token during update
        if (session.username ?? session.name) {
          token.picture = `/api/avatar/${session.username ?? session.name}`;
        }
      }
      return token;
    }
  }
}
