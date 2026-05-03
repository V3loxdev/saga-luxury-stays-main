import { useState, useEffect } from 'react';
import type { SnackDrink } from './snacksDrinks';
import { snacksDrinksRef, push, update, onValue, off, isConfigured } from './firebase';

const STORAGE_KEY = 'saga-snacks-drinks';

const readStoredItems = (): SnackDrink[] | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored) as SnackDrink[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const persistItems = (items: SnackDrink[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const useSnacksDrinks = () => {
  const [snacksDrinks, setSnacksDrinks] = useState<SnackDrink[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load localStorage first
  useEffect(() => {
    const stored = readStoredItems();
    if (stored) setSnacksDrinks(stored);
  }, []);

  // Firebase listener (if configured)
  useEffect(() => {
    if (!isConfigured) {
      setIsInitialized(true);
      return;
    }

    let unsubscribe: (() => void) | null = null;

    const setupListener = () => {
      try {
        unsubscribe = onValue(snacksDrinksRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const items = Object.entries(data).map(([id, value]: [string, any]) => ({ id, ...value }));
            setSnacksDrinks(items);
            persistItems(items);
          } else {
            setSnacksDrinks([]);
            persistItems([]);
          }
          setIsInitialized(true);
        });
      } catch (error) {
        console.warn('Firebase snacks listener failed:', error);
        setIsInitialized(true);
      }
    };

    setupListener();

    return () => {
      if (unsubscribe) off(snacksDrinksRef, 'value', unsubscribe);
    };
  }, []);

  const updateItems = (updater: (prev: SnackDrink[]) => SnackDrink[]) => {
    const updated = updater(snacksDrinks);
    setSnacksDrinks(updated);
    persistItems(updated);

    if (isConfigured) {
      try {
        const updates: Record<string, any> = {};
        updated.forEach(item => {
          updates[item.id] = item;
        });
        update(snacksDrinksRef, updates);
      } catch (error) {
        console.warn('Firebase update failed:', error);
      }
    }
  };

  const toggleAvailability = (id: string) => {
    updateItems(prev => prev.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  const addSnackDrink = (item: Omit<SnackDrink, 'id'>) => {
    const newId = `item-${Date.now()}`;
    const newItem = { ...item, id: newId, available: true };
    updateItems(prev => [...prev, newItem]);
  };

  const updateSnackDrink = (id: string, updates: Partial<SnackDrink>) => {
    updateItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteSnackDrink = (id: string) => {
    updateItems(prev => prev.filter(item => item.id !== id));
  };

  const availableItems = () => snacksDrinks.filter(item => item.available);

  return {
    snacksDrinks,
    availableItems,
    toggleAvailability,
    addSnackDrink,
    updateSnackDrink,
    deleteSnackDrink,
    isInitialized,
  };
};

