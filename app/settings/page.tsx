'use client';

import React from "react"

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api';
import { Profile } from '@/lib/types';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const data = await apiClient.getProfile();
        const normalizedProfile: Profile = {
          id: data?._id ?? data?.id ?? '',
          name: data?.name ?? '',
          email: data?.email ?? '',
          role: data?.role ?? '',
          joinedDate: data?.createdAt ?? data?.joinedDate ?? '',
          avatar: data?.avatar?.url ?? data?.avatar ?? '',
        };
        setProfile(normalizedProfile);
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsChangingPassword(true);
    try {
      await apiClient.changePassword(currentPassword, newPassword, confirmPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Failed to change password:', error);
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-background via-background to-secondary/5 min-h-screen">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Settings</h1>
          <p className="text-muted-foreground">Edit your personal information</p>
        </div>

        {/* Profile Section */}
        <Card className="p-8 border-0 bg-white">
          <div className="flex items-start gap-6 mb-8 pb-8 border-b border-border">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{profile?.name}</h2>
              <p className="text-muted-foreground">@{profile?.role || 'Admin'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Name</label>
              <Input
                type="text"
                value={profile?.name || ''}
                readOnly
                className="bg-muted"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input
                type="email"
                value={profile?.email || ''}
                readOnly
                className="bg-muted"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Role</label>
              <Input
                type="text"
                value={profile?.role || ''}
                readOnly
                className="bg-muted"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Joined Date</label>
              <Input
                type="text"
                value={profile?.joinedDate || ''}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>
        </Card>

        {/* Change Password Section */}
        <Card className="p-8 border-0 bg-white">
          <h2 className="text-2xl font-bold text-foreground mb-6">Change password</h2>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Current Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={isChangingPassword}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  New Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isChangingPassword}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isChangingPassword}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="bg-primary text-white hover:bg-primary/90"
                disabled={isChangingPassword}
              >
                {isChangingPassword ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
