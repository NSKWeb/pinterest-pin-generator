// Dashboard Layout

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Sidebar } from '@/components/dashboard/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-950">
        <Sidebar />
        <div className="ml-64">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}
