'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { apiClient } from '@/lib/api';
import Header from './header';

const PUBLIC_ROUTES = new Set([
  '/',
  '/login',
  '/forgot-password',
  '/reset-password',
  '/verify-otp',
]);

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isPublicRoute = PUBLIC_ROUTES.has(pathname || '');

  useEffect(() => {
    if (isPublicRoute) return;
    apiClient.loadToken();
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) {
      router.push('/login');
    }
  }, [isPublicRoute, router]);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="md:fixed md:inset-y-0 md:left-0 md:w-56 z-40">
        <Sidebar />
      </div>
      <div className="md:pl-56">
        <div className="sticky top-0 z-30 md:fixed md:top-0 md:left-56 md:right-0">
          <Header />
        </div>
        <main className="pt-16">
          {children}
        </main>
      </div>
    </div>
  );
}
