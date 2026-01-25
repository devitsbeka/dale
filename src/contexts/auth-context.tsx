'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient, { AuthResponse, SignupRequest, LoginRequest, ApiError } from '@/lib/api-client';

/**
 * User interface matching backend User model
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Auth context interface
 */
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signup: (data: SignupRequest) => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Auth provider component
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Initialize auth state from localStorage
   */
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  /**
   * Sign up a new user
   */
  const signup = useCallback(async (data: SignupRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      const response: AuthResponse = await apiClient.auth.signup(data);

      // Store token and user
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));

      setToken(response.token);
      setUser(response.user);
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to sign up';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Log in an existing user
   */
  const login = useCallback(async (data: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      const response: AuthResponse = await apiClient.auth.login(data);

      // Store token and user
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));

      setToken(response.token);
      setUser(response.user);
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to log in';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Log out the current user
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Call backend logout endpoint (clears cookies)
      try {
        await apiClient.auth.logout();
      } catch (err) {
        // Ignore logout errors, still clear local state
        console.error('Logout error:', err);
      }

      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');

      setToken(null);
      setUser(null);
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to log out';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh user data from backend
   */
  const refreshUser = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userData = await apiClient.auth.me();

      // Update stored user
      localStorage.setItem('auth_user', JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to refresh user';
      setError(errorMessage);

      // If token is invalid, clear auth state
      if (err instanceof ApiError && err.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setToken(null);
        setUser(null);
      }

      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    signup,
    login,
    logout,
    refreshUser,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * HOC to protect routes that require authentication
 */
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-2 text-sm text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    }

    return <Component {...props} />;
  };
}
