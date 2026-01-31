import axios, { AxiosInstance, AxiosError } from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/api';

interface ApiError {
  message: string;
  status: number;
  data?: unknown;
}

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const status = error.response?.status;
        const message = (error.response?.data as any)?.message || error.message;

        if (status === 401) {
          this.clearToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }

        const apiError: ApiError = {
          message,
          status: status || 500,
          data: error.response?.data,
        };

        throw apiError;
      }
    );
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  setRefreshToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  }

  loadToken() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        this.token = token;
      }
    }
  }

  // Authentication endpoints
  async login(email: string, password: string) {
    try {
      const response = await this.client.post('/auth/login', { email, password });
      const accessToken =
        response.data?.data?.accessToken ??
        response.data?.accessToken ??
        response.data?.token;
      const refreshToken =
        response.data?.data?.refreshToken ??
        response.data?.refreshToken;

      if (!accessToken) {
        throw new Error('Login response missing access token');
      }

      this.setToken(accessToken);
      if (refreshToken) {
        this.setRefreshToken(refreshToken);
      }
      return response.data;
    } catch (error) {
      toast.error('Login failed');
      throw error;
    }
  }

  async forgotPassword(email: string) {
    try {
      const response = await this.client.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      toast.error('Failed to send reset code');
      throw error;
    }
  }

  async verifyOtp(email: string, otp: string) {
    try {
      const response = await this.client.post('/auth/verify-otp', { email, otp });
      return response.data;
    } catch (error) {
      toast.error('Invalid OTP');
      throw error;
    }
  }

  async resetPassword(email: string, password: string, confirmPassword: string) {
    try {
      const response = await this.client.post('/auth/reset-password', {
        email,
        password,
        confirmPassword,
      });
      return response.data;
    } catch (error) {
      toast.error('Failed to reset password');
      throw error;
    }
  }

  // Dashboard endpoints
  async getDashboardStats() {
    try {
      const response = await this.client.get('/admin/dashboard/');
      return response.data?.data ?? response.data;
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
      throw error;
    }
  }


  async getSubscriptionAnalytics() {
    try {
      const response = await this.client.get('/admin/subscription');
      return response.data?.data ?? response.data;
    } catch (error) {
      console.error('Failed to fetch subscription analytics', error);
      throw error;
    }
  }

  // Users endpoints
  async getUsers(page = 1, limit = 10) {
    try {
      const response = await this.client.get('/admin/users', {
        params: { page, limit },
      });
      const payload = response.data?.data ?? response.data;
      const meta = response.data?.meta ?? {};
      return {
        data: payload ?? [],
        total: Number(meta.total ?? 0),
        page: Number(meta.page ?? page),
        limit: Number(meta.limit ?? limit),
        hasNextPage: Boolean(meta.page && meta.limit && meta.total && meta.page * meta.limit < meta.total),
        hasPrevPage: Number(meta.page ?? page) > 1,
      };
    } catch (error) {
      console.error('Failed to fetch users', error);
      throw error;
    }
  }

  // Profile endpoints
  async getProfile() {
    try {
      const response = await this.client.get('/user/profile');
      return response.data?.data ?? response.data;
    } catch (error) {
      console.error('Failed to fetch profile', error);
      throw error;
    }
  }

  async updateProfile(data: { name?: string; avatar?: File | null }) {
    try {
      const formData = new FormData();
      if (data.name) formData.append('name', data.name);
      if (data.avatar) formData.append('avatar', data.avatar);
      const response = await this.client.patch('/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Profile updated successfully');
      return response.data?.data ?? response.data;
    } catch (error) {
      toast.error('Failed to update profile');
      throw error;
    }
  }

  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
    try {
      const response = await this.client.post('/change-password', {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      toast.success('Password changed successfully');
      return response.data?.data ?? response.data;
    } catch (error) {
      toast.error('Failed to change password');
      throw error;
    }
  }

  // Subscriptions endpoints
  async getSubscriptionPlans(page = 1, limit = 10) {
    try {
      const response = await this.client.get('/admin/subscriptions', {
        params: { page, limit },
      });
      return response.data?.data ?? response.data;
    } catch (error) {
      console.error('Failed to fetch subscription plans', error);
      throw error;
    }
  }

  async createSubscriptionPlan(data: {
    name: string;
    priceMonth?: number;
    priceYear?: number;
  }) {
    try {
      const response = await this.client.post('/admin/subscriptions', {
        name: data.name,
        priceMonthly: data.priceMonth,
        priceYearly: data.priceYear,
      });
      toast.success('Plan created successfully');
      return response.data?.data ?? response.data;
    } catch (error) {
      toast.error('Failed to create plan');
      throw error;
    }
  }

  async updateSubscriptionPlan(id: string, data: any) {
    try {
      const response = await this.client.put(`/admin/subscriptions/${id}`, {
        name: data?.name,
        priceMonthly: data?.priceMonth,
        priceYearly: data?.priceYear,
      });
      toast.success('Plan updated successfully');
      return response.data?.data ?? response.data;
    } catch (error) {
      toast.error('Failed to update plan');
      throw error;
    }
  }

  async toggleSubscriptionPlan(id: string, action: 'delete' | 'inactive' | 'active') {
    try {
      const response = await this.client.patch(`/admin/subscriptions/${id}`, { action });
      toast.success('Plan updated successfully');
      return response.data?.data ?? response.data;
    } catch (error) {
      toast.error('Failed to update plan');
      throw error;
    }
  }

  // Generic error handler
  handleError(error: unknown): ApiError {
    if (error instanceof AxiosError) {
      return {
        message: (error.response?.data as any)?.message || error.message,
        status: error.response?.status || 500,
        data: error.response?.data,
      };
    }
    return {
      message: 'An unexpected error occurred',
      status: 500,
    };
  }
}

export const apiClient = new ApiClient();

export type { ApiError };
