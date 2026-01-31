export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedDate: string;
  payable: number;
  planName: string;
  status: 'paid' | 'unpaid';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonth?: number;
  priceYear?: number;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
}

export interface UserAnalytics {
  day: string;
  users: number;
}

export interface SubscriptionAnalytics {
  name: string;
  value: number;
  percentage: number;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  joinedDate: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
