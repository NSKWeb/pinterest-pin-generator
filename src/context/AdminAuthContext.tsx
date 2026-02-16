// Admin Authentication Context

'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { ThreeLayerAuthState, AuthLayer, AuthResponse } from '@/types/auth';

interface AdminAuthContextType {
  authState: ThreeLayerAuthState;
  isLoading: boolean;
  error: string | null;
  login: (layer: AuthLayer, credentials: any) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  clearError: () => void;
}

const initialAuthState: ThreeLayerAuthState = {
  currentLayer: 'layer1',
  layer1Verified: false,
  layer2Verified: false,
  layer3Verified: false,
  isAuthenticated: false,
  sessionToken: undefined,
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<ThreeLayerAuthState>(initialAuthState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(async (
    layer: AuthLayer,
    credentials: any
  ): Promise<AuthResponse> => {
    setIsLoading(true);
    clearError();

    try {
      const response = await fetch(`/api/auth/${layer}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Authentication failed');
        return { success: false, message: data.error, layer };
      }

      // Update auth state based on layer
      setAuthState(prev => {
        const newState = { ...prev };

        switch (layer) {
          case 'layer1':
            newState.layer1Verified = true;
            newState.currentLayer = 'layer2';
            break;
          case 'layer2':
            newState.layer2Verified = true;
            newState.currentLayer = 'layer3';
            break;
          case 'layer3':
            newState.layer3Verified = true;
            newState.isAuthenticated = true;
            newState.sessionToken = data.token;
            break;
        }

        return newState;
      });

      return {
        success: true,
        message: data.message,
        layer,
        token: data.token,
        requiresNextLayer: data.requiresNextLayer,
      };
    } catch (err) {
      const message = (err as Error).message || 'Network error';
      setError(message);
      return { success: false, message, layer };
    } finally {
      setIsLoading(false);
    }
  }, [clearError]);

  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authState.sessionToken}`,
        },
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setAuthState(initialAuthState);
      setIsLoading(false);
    }
  }, [authState.sessionToken]);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    if (!authState.sessionToken) return false;

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authState.sessionToken}`,
        },
      });

      const data = await response.json();

      if (data.success && data.token) {
        setAuthState(prev => ({
          ...prev,
          sessionToken: data.token,
        }));
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }, [authState.sessionToken]);

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('admin_session_token');
      if (!token) return;

      try {
        const response = await fetch('/api/auth/session', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success && data.session) {
          setAuthState({
            currentLayer: 'layer3',
            layer1Verified: data.session.layer1,
            layer2Verified: data.session.layer2,
            layer3Verified: data.session.layer3,
            isAuthenticated: data.session.layer1 && data.session.layer2 && data.session.layer3,
            sessionToken: token,
          });
        } else {
          localStorage.removeItem('admin_session_token');
        }
      } catch {
        localStorage.removeItem('admin_session_token');
      }
    };

    checkSession();
  }, []);

  // Store token when authenticated
  useEffect(() => {
    if (authState.sessionToken) {
      localStorage.setItem('admin_session_token', authState.sessionToken);
    }
  }, [authState.sessionToken]);

  return (
    <AdminAuthContext.Provider
      value={{
        authState,
        isLoading,
        error,
        login,
        logout,
        refreshSession,
        clearError,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}