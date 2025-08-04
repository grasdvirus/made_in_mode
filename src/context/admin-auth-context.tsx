
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// The password is intentionally stored here for this simple use case.
// In a real application, this would be validated against a server.
const ADMIN_PASSWORD = 'grasdvirus@gmail.com';
const SESSION_STORAGE_KEY = 'admin-authenticated';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check session storage on initial load
    try {
      const storedAuth = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (storedAuth === 'true') {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Could not access session storage:', error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const login = async (password: string): Promise<boolean> => {
    return new Promise(resolve => {
        setTimeout(() => { // Simulate network delay
            if (password === ADMIN_PASSWORD) {
                sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
                setIsAuthenticated(true);
                resolve(true);
            } else {
                resolve(false);
            }
        }, 500);
    });
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
