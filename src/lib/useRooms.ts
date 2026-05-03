import { useState, useEffect } from 'react';
import { roomsRef, push, update, onValue, off, isConfigured } from './firebase';
import type { Room } from './rooms';

export interface RoomData extends Room {
  id?: string;
}

export const ROOM_DURATION_OPTIONS = [
  { label: '3 Hours', value: 3 * 60 * 60 * 1000 },
  { label: '12 Hours', value: 12 * 60 * 60 * 1000 },
  { label: '24 Hours', value: 24 * 60 * 60 * 1000 },
];

export const getRoomRemainingTime = (room: RoomData): number => {
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
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [tick, setTick] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage first for instant UI
  useEffect(() => {
    const saved = localStorage.getItem('saga-rooms');
    if (saved) {
      try {
        setRooms(JSON.parse(saved));
      } catch {
        console.error('Failed to load rooms from localStorage');
      }
    }
  }, []);

  // Firebase sync effect (mirrors useBookings pattern)
  useEffect(() => {
    if (!isConfigured) {
      console.warn('Firebase not configured for rooms. Using localStorage only.');
      setIsInitialized(true);
      return;
    }

    let unsubscribe: (() => void) | null = null;

    const setupListener = () => {
      try {
        unsubscribe = onValue(roomsRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const roomsList = Object.entries(data).map(([id, value]: [string, any]) => ({ id, ...value }));
            setRooms(roomsList);
            localStorage.setItem('saga-rooms', JSON.stringify(roomsList));
          } else {
            setRooms([]);
            localStorage.setItem('saga-rooms', JSON.stringify([]));
          }
          setIsInitialized(true);
        });
      } catch (error) {
        console.warn('Firebase rooms listener failed:', error);
        setIsInitialized(true);
      }
    };

    setupListener();

    return () => {
      if (unsubscribe) off(roomsRef, 'value', unsubscribe);
    };
  }, []);

  // Live tick for timers
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-vacate expired rooms
  useEffect(() => {
    rooms.forEach(room => {
      if (room.status === 'Occupied' && room.occupiedAt && room.durationMs) {
        const remaining = getRoomRemainingTime(room);
        if (remaining <= 0) {
          vacateRoom(room.name || room.id);
        }
      }
    });
  }, [tick, rooms]);

  const addRoom = (roomData: Omit<RoomData, 'status'>) => {
    const newRoom = {
      ...roomData,
      status: 'Available' as const,
    };

    if (isConfigured) {
      try {
        push(roomsRef, newRoom);
      } catch (error) {
        console.warn('Firebase addRoom failed:', error);
        // Fallback local
        setRooms(prev => [...prev, newRoom]);
        localStorage.setItem('saga-rooms', JSON.stringify([...rooms, newRoom]));
      }
    } else {
      setRooms(prev => [...prev, newRoom]);
      localStorage.setItem('saga-rooms', JSON.stringify([...rooms, newRoom]));
    }
  };

  const updateRoom = (roomId: string, updates: Partial<RoomData>) => {
    if (isConfigured) {
      try {
        const updateObj = { [`/${roomId}`]: updates };
        update(roomsRef, updateObj);
      } catch (error) {
        console.warn('Firebase updateRoom failed:', error);
        setRooms(prev => prev.map(r => (r.id === roomId || r.name === roomId ? { ...r, ...updates } : r)));
        localStorage.setItem('saga-rooms', JSON.stringify(rooms));
      }
    } else {
      setRooms(prev => prev.map(r => (r.id === roomId || r.name === roomId ? { ...r, ...updates } : r)));
      localStorage.setItem('saga-rooms', JSON.stringify(rooms));
    }
  };

  const deleteRoom = (roomId: string) => {
    if (isConfigured) {
      try {
        const updateObj = { [`/${roomId}`]: null };
        update(roomsRef, updateObj);
      } catch (error) {
        console.warn('Firebase deleteRoom failed:', error);
        setRooms(prev => prev.filter(r => r.id !== roomId && r.name !== roomId));
        localStorage.setItem('saga-rooms', JSON.stringify(rooms.filter(r => r.id !== roomId && r.name !== roomId)));
      }
    } else {
      setRooms(prev => prev.filter(r => r.id !== roomId && r.name !== roomId));
      localStorage.setItem('saga-rooms', JSON.stringify(rooms.filter(r => r.id !== roomId && r.name !== roomId)));
    }
  };

  const occupyRoomWithTimer = (roomId: string, durationMs: number) => {
    updateRoom(roomId, { 
      status: 'Occupied' as const, 
      occupiedAt: Date.now(), 
      durationMs 
    });
  };

  const vacateRoom = (roomId: string) => {
    updateRoom(roomId, { 
      status: 'Available' as const, 
      occupiedAt: undefined, 
      durationMs: undefined 
    });
  };

  const availableRooms = (type: RoomData['type']) => {
    return rooms.filter(r => r.type === type && r.status === 'Available');
  };

  return { 
    rooms, 
    tick, 
    addRoom, 
    updateRoom, 
    deleteRoom, 
    occupyRoomWithTimer, 
    vacateRoom, 
    availableRooms, 
    isInitialized 
  };
};

