import { useEffect, useState } from 'react';
export type { SnackDrink } from './snacksDrinks';
import type { SnackDrink } from './snacksDrinks';

const STORAGE_KEY = 'saga-snacks-drinks';

const readStoredItems = (): SnackDrink[] | null => {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored) as SnackDrink[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const persistItems = (items: SnackDrink[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('snacks-drinks-updated'));
};

export const useSnacksDrinks = () => {
  const [snacksDrinks, setSnacksDrinks] = useState<SnackDrink[]>([]);

  useEffect(() => {
    const storedItems = readStoredItems();
    if (storedItems !== null) {
      setSnacksDrinks(storedItems);
      return;
    }

    import('./snacksDrinks').then(module => {
      setSnacksDrinks(module.snacksDrinks);
      persistItems(module.snacksDrinks);
    });
  }, []);

  useEffect(() => {
    const syncItems = () => {
      const stored = readStoredItems();
      if (stored !== null) {
        setSnacksDrinks(stored);
      }
    };

    window.addEventListener('storage', syncItems);
    window.addEventListener('snacks-drinks-updated', syncItems);

    return () => {
      window.removeEventListener('storage', syncItems);
      window.removeEventListener('snacks-drinks-updated', syncItems);
    };
  }, []);

  const updateStoredItems = (updater: (prev: SnackDrink[]) => SnackDrink[]) => {
    setSnacksDrinks((prev) => {
      const nextItems = updater(prev);
      persistItems(nextItems);
      return nextItems;
    });
  };

  const toggleAvailability = (id: string) => {
    updateStoredItems((prev) => prev.map(item =>
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  const addSnackDrink = (item: Omit<SnackDrink, 'id'> & { id?: string }) => {
    const newId = item.id || `item-${Date.now()}`;
    const newItem: SnackDrink = { ...item, id: newId, available: true };
    updateStoredItems((prev) => [...prev, newItem]);
  };

  const updateSnackDrink = (id: string, updates: Partial<SnackDrink>) => {
    updateStoredItems((prev) => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteSnackDrink = (id: string) => {
    updateStoredItems((prev) => prev.filter(item => item.id !== id));
  };

  const availableItems = () => snacksDrinks.filter(item => item.available);

  return {
    snacksDrinks,
    availableItems,
    toggleAvailability,
    addSnackDrink,
    updateSnackDrink,
    deleteSnackDrink,
  };
};

