import { prisma } from '@/lib/prisma';
import HomeClient, { Room } from '@/components/home/HomeClient';

// Time interval to consider a room "recently active"
const TWO_MINUTES_AGO = () => new Date(Date.now() - 2 * 60 * 1000);

// We force dynamic or revalidate to ensure fresh data
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let initialRooms: Room[] = [];

  try {
    const twoMinutesAgo = TWO_MINUTES_AGO();
    
    // Server-side data fetch mirroring /api/rooms logic
    initialRooms = await prisma.room.findMany({
      where: {
        isPublic: true,
        OR: [
          { onlineCount: { gt: 0 } },
          { updatedAt: { gte: twoMinutesAgo } }
        ]
      },
      select: {
        id: true,
        name: true,
        currentVideoTitle: true,
        onlineCount: true,
        maxUsers: true,
        updatedAt: true,
        _count: {
          select: { messages: true }
        }
      },
      orderBy: [
        { onlineCount: 'desc' },
        { updatedAt: 'desc' }
      ],
      take: 10
    });
  } catch (error) {
    console.error('Failed to pre-fetch rooms in page Server Component:', error);
  }

  // Pass initialRooms directly to Client Component, avoiding waterfalls
  return <HomeClient initialRooms={initialRooms} />;
}
