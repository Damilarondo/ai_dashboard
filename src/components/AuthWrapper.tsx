'use client';
import { useAuth } from './AuthContext';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export function AuthWrapper({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  // If we're on the login page or loading, just render the children without Sidebar
  if (pathname === '/login') {
    return <main style={{ width: '100vw', minHeight: '100vh' }}>{children}</main>;
  }

  // If not authenticated, we don't render the main app structure (AuthContext will redirect)
  if (!isAuthenticated && !isLoading) {
    return null;
  }

  return <>{children}</>;
}
