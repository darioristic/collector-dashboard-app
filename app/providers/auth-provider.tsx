'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize token from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        setTokenState(storedToken);
        apiClient.setToken(storedToken);
        setIsAuthenticated(true);
      }
      setIsInitialized(true);
    }
  }, []);

  const setToken = (newToken: string) => {
    setTokenState(newToken);
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', newToken);
    }
    apiClient.setToken(newToken);
    setIsAuthenticated(true);
  };

  const clearToken = () => {
    setTokenState(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    apiClient.setToken('');
    setIsAuthenticated(false);
  };

  // Don't render children until initialized to prevent hydration mismatch
  if (!isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, setToken, clearToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
