'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';
import { User, PaginatedResponse } from '@/lib/types';
import Image from 'next/image';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const limit = 8;

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const data: PaginatedResponse<User> = await apiClient.getUsers(page, limit);
        setUsers(data.data);
        setTotal(data.total);
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-8 bg-gradient-to-br from-background via-background to-secondary/5 min-h-screen">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">User List</h1>
          <p className="text-muted-foreground">Manage and view all registered users</p>
        </div>

        {/* Table */}
        <Card className="overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading users...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">User Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Joined Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Payable</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Plan Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const statusValue = (user.status || '').toLowerCase();
                    const isPaid = statusValue === 'paid';
                    return (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-foreground">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{user.joinedDate}</td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">${user.payable}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{user.planName}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                          isPaid
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {statusValue ? statusValue.charAt(0).toUpperCase() + statusValue.slice(1) : 'Unknown'}
                        </span>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Pagination */}
        {!isLoading && total > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} results
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← Previous
              </Button>
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i + 1}
                  variant={page === i + 1 ? 'default' : 'outline'}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
