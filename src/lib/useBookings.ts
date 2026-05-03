import { useState, useEffect } from 'react';
import { bookingsRef, push, update, onValue, off, isConfigured } from './firebase';

export type StayType = '3hrs' | '12hrs' | '1day';

export interface Booking {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string;
  stayType: StayType;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Expired';
  timestamp: number;
  confirmedAt?: number;
  assignedRoom?: string;
}

export const STAY_PRICES: Record<string, Record<StayType, number>> = {
  regular: { '3hrs': 700, '12hrs': 1400, '1day': 2500 },
  premium: { '3hrs': 1400, '12hrs': 2800, '1day': 4800 },
};

export const STAY_LABELS: Record<StayType, string> = {
  '3hrs': '3 Hours',
  '12hrs': '12 Hours',
  '1day': '1 Day',
};

export const STAY_DURATION_MS: Record<StayType, number> = {
  '3hrs': 3 * 60 * 60 * 1000,
  '12hrs': 12 * 60 * 60 * 1000,
  '1day': 24 * 60 * 60 * 1000,
};

export const includesMeals = (stayType: StayType): boolean => stayType === '1day';

export const getRemainingTime = (stayType: StayType, confirmedAt: number): number => {
  const duration = STAY_DURATION_MS[stayType];
  const endTime = confirmedAt + duration;
  return Math.max(0, endTime - Date.now());
};

export const formatTime = (ms: number): string => {
  if (ms <= 0) return 'Expired';
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const getBookingTimer = (booking: Booking): { remaining: number; formatted: string; isExpired: boolean } => {
  if (booking.status !== 'Confirmed' || !booking.confirmedAt) {
    return { remaining: 0, formatted: '--:--:--', isExpired: false };
  }
  const remaining = getRemainingTime(booking.stayType, booking.confirmedAt);
  return {
    remaining,
    formatted: formatTime(remaining),
    isExpired: remaining <= 0,
  };
};

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tick, setTick] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount for offline support
  useEffect(() => {
    const saved = localStorage.getItem('saga-bookings');
    if (saved) {
      try {
        setBookings(JSON.parse(saved));
      } catch {
        console.error('Failed to load bookings from localStorage');
      }
    }
  }, []);

  // Sync with Firebase and listen for real-time updates
  useEffect(() => {
    if (!isConfigured) {
      console.warn('Firebase not configured. Using localStorage only.');
      setIsInitialized(true);
      return;
    }

    let unsubscribe: (() => void) | null = null;

    const setupFirebaseListener = async () => {
      try {
        // Listen to Firebase changes
        unsubscribe = onValue(bookingsRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const bookingsList = Object.entries(data).map(([, value]: [string, any]) => value);
            setBookings(bookingsList);
            // Save to localStorage as backup
            localStorage.setItem('saga-bookings', JSON.stringify(bookingsList));
          } else {
            setBookings([]);
            localStorage.setItem('saga-bookings', JSON.stringify([]));
          }
          setIsInitialized(true);
        });
      } catch (error) {
        console.warn('Firebase listener setup failed:', error);
        setIsInitialized(true);
      }
    };

    setupFirebaseListener();

    return () => {
      if (unsubscribe) {
        off(bookingsRef);
      }
    };
  }, []);

  // Live tick every second for countdown refreshes
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addBooking = (booking: Omit<Booking, 'id' | 'status' | 'timestamp'> & { email: string; phone: string; }) => {
    const newBooking = {
      ...booking,
      id: `SH-${Date.now().toString().slice(-8)}`,
      status: 'Pending' as const,
      timestamp: Date.now(),
    };

    if (isConfigured) {
      try {
        push(bookingsRef, newBooking);
      } catch (error) {
        console.warn('Firebase write failed, saving to localStorage:', error);
        setBookings(prev => [...prev, newBooking]);
        localStorage.setItem('saga-bookings', JSON.stringify([...bookings, newBooking]));
      }
    } else {
      // Fallback: update locally
      setBookings(prev => [...prev, newBooking]);
      localStorage.setItem('saga-bookings', JSON.stringify([...bookings, newBooking]));
    }
  };

  const deleteBooking = (id: string) => {
    if (isConfigured) {
      try {
        const updateObj: Record<string, null> = {};
        updateObj[id] = null;
        update(bookingsRef, updateObj);
      } catch (error) {
        console.warn('Firebase delete failed, deleting from localStorage:', error);
        setBookings(prev => prev.filter(b => b.id !== id));
        localStorage.setItem('saga-bookings', JSON.stringify(bookings.filter(b => b.id !== id)));
      }
    } else {
      setBookings(prev => prev.filter(b => b.id !== id));
      localStorage.setItem('saga-bookings', JSON.stringify(bookings.filter(b => b.id !== id)));
    }
  };

  const updateStatus = (id: string, status: Booking['status'], assignedRoom?: string) => {
    if (isConfigured) {
      try {
        const updateObj: Record<string, any> = {};
        updateObj[`${id}/status`] = status;
        if (status === 'Confirmed') {
          updateObj[`${id}/confirmedAt`] = Date.now();
        }
        if (assignedRoom) {
          updateObj[`${id}/assignedRoom`] = assignedRoom;
        }
        update(bookingsRef, updateObj);
      } catch (error) {
        console.warn('Firebase update failed, updating localStorage:', error);
        setBookings(prev => prev.map(b => {
          if (b.id !== id) return b;
          const updates: Partial<Booking> = { status };
          if (status === 'Confirmed' && !b.confirmedAt) {
            updates.confirmedAt = Date.now();
          }
          if (assignedRoom) {
            updates.assignedRoom = assignedRoom;
          }
          return { ...b, ...updates };
        }));
        localStorage.setItem('saga-bookings', JSON.stringify(bookings));
      }
    } else {
      setBookings(prev => prev.map(b => {
        if (b.id !== id) return b;
        const updates: Partial<Booking> = { status };
        if (status === 'Confirmed' && !b.confirmedAt) {
          updates.confirmedAt = Date.now();
        }
        if (assignedRoom) {
          updates.assignedRoom = assignedRoom;
        }
        return { ...b, ...updates };
      }));
      localStorage.setItem('saga-bookings', JSON.stringify(bookings));
    }
  };

  const expireBooking = (id: string) => {
    if (isConfigured) {
      try {
        const updateObj: Record<string, any> = {};
        updateObj[`${id}/status`] = 'Expired';
        update(bookingsRef, updateObj);
      } catch (error) {
        console.warn('Firebase expire failed, updating localStorage:', error);
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Expired' as const } : b));
        localStorage.setItem('saga-bookings', JSON.stringify(bookings));
      }
    } else {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Expired' as const } : b));
      localStorage.setItem('saga-bookings', JSON.stringify(bookings));
    }
  };

  return { bookings, tick, addBooking, deleteBooking, updateStatus, expireBooking, isInitialized };
};

