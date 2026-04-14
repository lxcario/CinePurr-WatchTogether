import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { UserList } from '@/components/room/UserList';

// Mock the global socket
const mockSocketOn = vi.fn();
const mockSocketOff = vi.fn();
const mockSocketEmit = vi.fn();

const mockSocket = {
  on: mockSocketOn,
  off: mockSocketOff,
  emit: mockSocketEmit,
  connected: true,
};

vi.mock('@/hooks/useSocket', () => ({
  useSocket: () => ({ socket: mockSocket }),
  getCachedRoomUsers: () => [],
  subscribeCachedRoomUsers: () => vi.fn(),
}));

// Mock PokemonThemeProvider to avoid context errors
vi.mock('@/components/PokemonThemeProvider', () => ({
  usePokemonTheme: () => ({ theme: 'default' }),
}));

// Mock the Next/Image component to avoid errors
vi.mock('next/image', () => ({
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || 'mock image'} />;
  },
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Users: () => <div data-testid="icon-users" />,
  UserPlus: () => <div data-testid="icon-userplus" />,
  Shield: () => <div data-testid="icon-shield" />,
  ShieldOff: () => <div data-testid="icon-shield-off" />,
  Crown: () => <div data-testid="icon-crown" />,
  RefreshCw: () => <div data-testid="icon-refresh" />,
}));

describe('UserList Component Listener Stability', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not re-bind the room:users_update listener when the users array changes', () => {
    // We want to verify that when we receive a room:users_update event, 
    // it updates the state, but does NOT trigger a re-render that causes the 
    // useEffect to unbind (off) and rebind (on) the listener.

    const { rerender } = render(<UserList socket={mockSocket as any} roomId="test-room" hostId="host-1" />);

    // Capture the registered callback
    expect(mockSocketOn).toHaveBeenCalledWith('room:users_update', expect.any(Function));
    const usersUpdateCallback = mockSocketOn.mock.calls.find(call => call[0] === 'room:users_update')?.[1];
    
    expect(usersUpdateCallback).toBeDefined();

    // Reset mocks to count *new* binding attempts
    mockSocketOn.mockClear();
    mockSocketOff.mockClear();

    // Act
    // Simulate receiving an update with 2 users
    act(() => {
      usersUpdateCallback([
        { id: 'user-1', name: 'User 1', socketId: 'socket-1' },
        { id: 'user-2', name: 'User 2', socketId: 'socket-2' },
      ]);
    });

    // The component should re-render with the new users.
    // If we were using `users.length` in the dependency array (the bug),
    // the effect would clean up, calling socket.off, and then socket.on again.
    
    // We expect 0 calls to socket.off because the useEffect shouldn't have fired again
    expect(mockSocketOff).not.toHaveBeenCalledWith('room:users_update', expect.any(Function));
    
    // We expect 0 calls to socket.on because the effect shouldn't have fired again
    expect(mockSocketOn).not.toHaveBeenCalledWith('room:users_update', expect.any(Function));

    // Force a re-render with the exact same props to simulate React Strict Mode or parent re-renders
    rerender(<UserList socket={mockSocket as any} roomId="test-room" hostId="host-1" />);

    // Still should not re-bind because socket and roomId haven't changed
    expect(mockSocketOff).not.toHaveBeenCalledWith('room:users_update', expect.any(Function));
  });
});
