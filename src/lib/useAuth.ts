import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const PASSWORD = '000'; // Admin password 000

  useEffect(() => {
    const token = localStorage.getItem('admin-token');
    if (token === PASSWORD) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (password: string) => {
    if (password === PASSWORD) {
      localStorage.setItem('admin-token', password);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin-token');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
};

