import { useEffect, useState } from 'react';

export interface Room {
  name: string;
  type: 'Regular' | 'Premium';
  status: 'Available' | 'Occupied';
  floor: string;
  occupiedAt?: number;
  durationMs?: number;
}

export const ROOM_DURATION_OPTIONS = [
  { label: '3 Hours', value: 3 * 60 * 60 * 1000 },
  { label: '12 Hours', value: 12 * 60 * 60 * 1000 },
  { label: '24 Hours', value: 24 * 60 * 60 * 1000 },
];

export const getRoomRemainingTime = (room: Room): number => {
  if (!room.occupiedAt || !room.durationMs) return 0;
  const endTime = room.occupiedAt + room.durationMs;
  return Math.max(0, endTime - Date.now());
};

export const formatRoomTime = (ms: number): string => {
  if (ms <= 0) return '00:00:00';
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('saga-rooms');
    if (saved) {
      setRooms(JSON.parse(saved));
    } else {
      const defaultRooms: Room[] = [
        { name: "Regular Room 101", type: "Regular", status: "Available" as const, floor: "1st" },
        { name: "Regular Room 102", type: "Regular", status: "Available" as const, floor: "1st" },
        { name: "Regular Room 103", type: "Regular", status: "Available" as const, floor: "1st" },
        { name: "Regular Room 201", type: "Regular", status: "Available" as const, floor: "2nd" },
        { name: "Regular Room 202", type: "Regular", status: "Available" as const, floor: "2nd" },
        { name: "Premium Suite 301", type: "Premium", status: "Available" as const, floor: "3rd" },
        { name: "Premium Suite 302", type: "Premium", status: "Available" as const, floor: "3rd" },
        { name: "Premium Suite 303", type: "Premium", status: "Available" as const, floor: "3rd" },
        { name: "Premium Suite 304", type: "Premium", status: "Available" as const, floor: "3rd" },
        { name: "Premium Suite 305", type: "Premium", status: "Available" as const, floor: "3rd" },
      ];
      setRooms(defaultRooms);
      localStorage.setItem('saga-rooms', JSON.stringify(defaultRooms));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('saga-rooms', JSON.stringify(rooms));
  }, [rooms]);

  // Live tick every second for countdown refreshes
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-expire rooms when their timer reaches 0
  useEffect(() => {
    rooms.forEach(room => {
      if (room.status === 'Occupied' && room.occupiedAt && room.durationMs) {
        const remaining = getRoomRemainingTime(room);
        if (remaining <= 0) {
          vacateRoom(room.name);
        }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  const occupyRoom = (roomName: string, roomType: string) => {
    setRooms(prev => prev.map(r => 
      r.name === roomName ? { ...r, status: 'Occupied' as const } : r
    ));
  };

  const occupyRoomWithTimer = (roomName: string, durationMs: number) => {
    setRooms(prev => prev.map(r => 
      r.name === roomName 
        ? { ...r, status: 'Occupied' as const, occupiedAt: Date.now(), durationMs } 
        : r
    ));
  };

  const availableRooms = (type: Room['type']) => {
    return rooms.filter(r => r.type === type && r.status === 'Available');
  };

  const vacateRoom = (roomName: string) => {
    setRooms(prev => prev.map(r => 
      r.name === roomName 
        ? { ...r, status: 'Available' as const, occupiedAt: undefined, durationMs: undefined } 
        : r
    ));
  };

  return { rooms, tick, occupyRoom, occupyRoomWithTimer, vacateRoom, availableRooms };
};

