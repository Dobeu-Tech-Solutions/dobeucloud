'use client';

import { formatCurrency } from '@/lib/utils';
import { 
  Users, 
  Receipt, 
  FileText, 
  Eye, 
  Calendar,
  MessageSquare,
  DollarSign,
  TrendingUp
} from 'lucide-react';

interface StatsProps {
  stats: {
    totalUsers: number;
    activeInvoices: number;
    pendingQuotes: number;
    todayVisitors: number;
    upcomingAppointments: number;
    unresolvedContacts: number;
    totalRevenue: number;
  };
}

export default function AdminStats({ stats }: StatsProps) {
  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      change: '+12.5%',
      changeType: 'positive' as const,
    },
    {
      title: 'Active Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      change: '+5.2%',
      changeType: 'positive' as const,
    },
    {
      title: 'Active Invoices',
      value: stats.activeInvoices.toString(),
      icon: Receipt,
      description: 'Awaiting payment',
    },
    {
      title: 'Pending Quotes',
      value: stats.pendingQuotes.toString(),
      icon: FileText,
      description: 'Awaiting response',
    },
    {
      title: "Today's Visitors",
      value: stats.todayVisitors.toLocaleString(),
      icon: Eye,
      change: '+18.2%',
      changeType: 'positive' as const,
    },
    {
      title: 'Upcoming Appointments',
      value: stats.upcomingAppointments.toString(),
      icon: Calendar,
      description: 'Next 7 days',
    },
    {
      title: 'New Messages',
      value: stats.unresolvedContacts.toString(),
      icon: MessageSquare,
      description: 'Requires attention',
    },
    {
      title: 'Growth Rate',
      value: '23.5%',
      icon: TrendingUp,
      change: '+3.2%',
      changeType: 'positive' as const,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20`}>
                <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              {stat.change && (
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === 'positive'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {stat.change}
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {stat.title}
            </p>
            {stat.description && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {stat.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
