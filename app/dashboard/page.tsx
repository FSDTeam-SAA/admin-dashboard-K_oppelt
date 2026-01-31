"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import {
  DashboardStats,
  UserAnalytics,
  SubscriptionAnalytics,
} from "@/lib/types";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Bell, Filter } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics[]>([]);
  const [subscriptionAnalytics, setSubscriptionAnalytics] = useState<
    SubscriptionAnalytics[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Exact UI Colors
  const BAR_COLORS = [
    "#fed7aa",
    "#bfdbfe",
    "#ddd6fe",
    "#fecaca",
    "#93c5fd",
    "#c4b5fd",
    "#fca5a5",
  ];
  const PIE_COLORS = ["#22d3ee", "#818cf8"];

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const dashboardData = await apiClient.getDashboardStats();

        setStats({
          totalUsers: dashboardData?.totalUsers ?? 520,
          activeSubscriptions: dashboardData?.activeSubscriptions ?? 552,
          totalRevenue: dashboardData?.totalRevenue ?? 1700,
        });

        setUserAnalytics(
          dashboardData?.userJoinStats || [
            { day: "Sun", users: 55 },
            { day: "Mon", users: 60 },
            { day: "Tue", users: 80 },
            { day: "Wed", users: 52 },
            { day: "Thu", users: 92 },
            { day: "Fri", users: 15 },
            { day: "Sat", users: 80 },
          ],
        );

        setSubscriptionAnalytics([
          { name: "Basic", value: 372, percentage: 60 },
          { name: "Premium", value: 180, percentage: 17 },
        ]);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F5FF] p-6 md:p-12">
      <div className=" space-y-10">
        {/* Header Area */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              Welcome back to your admin panel
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Button
              variant="outline"
              className="rounded-xl border-[#4f8cff] bg-white/50 hover:bg-white px-6"
            >
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
          </div>
        </div>

        {/* Top 3 Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard
            title="Total User"
            value={stats?.totalUsers}
            bgColor="bg-[#94B7FF]"
            icon="👤"
            accentColor="bg-[#3B73FF]"
          />
          <StatCard
            title="Active Subscription"
            value={stats?.activeSubscriptions}
            bgColor="bg-[#B79AF0]"
            icon="👑"
            accentColor="bg-[#8B5CF6]"
          />
          <StatCard
            title="Total Revenue"
            value={stats?.totalRevenue.toLocaleString()}
            bgColor="bg-[#F3C7BF]"
            icon="📈"
            accentColor="bg-[#F97316]"
            isCurrency
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart Card */}
          <Card className="p-8 rounded-[2rem] border-0 shadow-sm bg-white">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-800">
                User joining Analysis
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-lg bg-slate-50 text-slate-500 hover:text-blue-600"
              >
                <Filter size={16} />
              </Button>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userAnalytics}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 13 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 13 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar dataKey="users" radius={[6, 6, 0, 0]} barSize={40}>
                    {userAnalytics.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={BAR_COLORS[index % BAR_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Pie Chart Card */}
          <Card className="p-8 rounded-[2rem] border-0 shadow-sm bg-white relative">
            <h3 className="text-xl font-bold text-slate-800 mb-8">
              Survey Subscription
            </h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subscriptionAnalytics}
                    innerRadius={0}
                    outerRadius={130}
                    dataKey="value"
                    stroke="none"
                  >
                    {subscriptionAnalytics.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              {/* Overlaid Data Labels */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex w-full justify-around px-12 text-white font-medium">
                  <div className="text-center">
                    <p className="text-xs opacity-80">Basic</p>
                    <p className="text-lg">372</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs opacity-80">Premium</p>
                    <p className="text-lg">180</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Custom Legend */}
            <div className="absolute bottom-10 right-10 flex flex-col gap-2">
              <LegendItem color="#818cf8" label="Completed" percent="60%" />
              <LegendItem color="#22d3ee" label="Completed" percent="17%" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  bgColor,
  icon,
  accentColor,
  isCurrency = false,
}: any) {
  return (
    <Card
      className={`${bgColor} border-0 rounded-[2rem] p-8 text-white relative overflow-hidden transition-transform hover:scale-[1.02]`}
    >
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-white/90 text-sm font-semibold mb-2">{title}</p>
          <h2 className="text-5xl font-extrabold">
            {isCurrency ? value : value}
          </h2>
        </div>
        <div
          className={`w-14 h-14 ${accentColor} rounded-full flex items-center justify-center text-2xl shadow-lg shadow-black/10`}
        >
          {icon}
        </div>
      </div>
      <div
        className={`absolute bottom-0 left-0 right-0 h-1.5 ${accentColor}`}
      />
    </Card>
  );
}

function LegendItem({
  color,
  label,
  percent,
}: {
  color: string;
  label: string;
  percent: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-sm text-slate-500 font-medium">
        {label}: {percent}
      </span>
    </div>
  );
}
