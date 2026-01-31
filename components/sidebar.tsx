'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import { useState } from 'react';
import Image from 'next/image';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: '📊' },
    { href: '/users', label: 'User List', icon: '👥' },
    { href: '/subscriptions', label: 'Subscription', icon: '👑' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleLogout = () => {
    apiClient.clearToken();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <aside className="w-full md:w-56 bg-sidebar text-sidebar-foreground flex flex-col h-full md:min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
         <Image src="/logo.png" alt="Logo" width={32} height={32} className='w-[148px] h-[104px]'/>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer',
                pathname === item.href
                  ? 'bg-sidebar-accent bg-opacity-20 text-sidebar-foreground font-medium'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground'
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          onClick={() => setShowLogoutModal(true)}
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/20"
          variant="ghost"
        >
          <span className="text-xl">🚪</span>
          Logout
        </Button>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Logout</h2>
            <p className="text-muted-foreground mb-6">Are you sure you want to log out?</p>
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-primary text-white hover:bg-primary/90"
                onClick={handleLogout}
              >
                Yes
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setShowLogoutModal(false)}
              >
                No
              </Button>
            </div>
          </Card>
        </div>
      )}
    </aside>
  );
}

