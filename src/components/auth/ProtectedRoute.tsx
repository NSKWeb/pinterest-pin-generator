// Protected Route Component

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { ThreeLayerAuthForm } from '@/components/auth/ThreeLayerAuthForm';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { authState, isLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're not loading and definitely not authenticated
    if (!isLoading && !authState.isAuthenticated && authState.sessionToken === undefined) {
      // Check if we have a valid session token
      const token = localStorage.getItem('admin_session_token');
      if (!token) {
        router.push('/auth');
      }
    }
  }, [authState.isAuthenticated, isLoading, authState.sessionToken, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Show auth form if not authenticated
  if (!authState.isAuthenticated) {
    return <ThreeLayerAuthForm />;
  }

  // Show protected content if authenticated
  return <>{children}</>;
}

// Server-side protection (optional - for additional security)
export function requireAuth() {
  // This would be used in server components
  // Currently implementing client-side protection for simplicity
  return null;
}