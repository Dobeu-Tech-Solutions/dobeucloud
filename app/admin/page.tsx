import { Suspense } from 'react';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import Invoice from '@/lib/models/Invoice';
import Quote from '@/lib/models/Quote';
import Analytics from '@/lib/models/Analytics';
import Appointment from '@/lib/models/Appointment';
import Contact from '@/lib/models/Contact';
import AdminStats from '@/components/admin/stats';
import RecentActivity from '@/components/admin/recent-activity';
import RevenueChart from '@/components/admin/revenue-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

async function getStats() {
  await dbConnect();
  
  const [
    totalUsers,
    activeInvoices,
    pendingQuotes,
    todayVisitors,
    upcomingAppointments,
    unresolvedContacts,
  ] = await Promise.all([
    User.countDocuments({ role: 'client' }),
    Invoice.countDocuments({ status: { $in: ['sent', 'overdue'] } }),
    Quote.countDocuments({ status: 'sent' }),
    Analytics.countDocuments({
      event: 'page_view',
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    }),
    Appointment.countDocuments({
      status: { $in: ['scheduled', 'confirmed'] },
      startTime: { $gte: new Date() },
    }),
    Contact.countDocuments({ status: 'new' }),
  ]);

  const totalRevenue = await Invoice.aggregate([
    { $match: { status: 'paid' } },
    { $group: { _id: null, total: { $sum: '$paidAmount' } } },
  ]);

  return {
    totalUsers,
    activeInvoices,
    pendingQuotes,
    todayVisitors,
    upcomingAppointments,
    unresolvedContacts,
    totalRevenue: totalRevenue[0]?.total || 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your business metrics and recent activity
        </p>
      </div>

      <Suspense fallback={<div>Loading stats...</div>}>
        <AdminStats stats={stats} />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Monthly revenue for the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading chart...</div>}>
              <RevenueChart />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading activity...</div>}>
              <RecentActivity />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a href="/admin/invoices/new" className="block">
              <button className="w-full text-left px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
                Create New Invoice
              </button>
            </a>
            <a href="/admin/quotes/new" className="block">
              <button className="w-full text-left px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
                Create New Quote
              </button>
            </a>
            <a href="/admin/portfolio/new" className="block">
              <button className="w-full text-left px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
                Add Portfolio Item
              </button>
            </a>
            <a href="/admin/users/invite" className="block">
              <button className="w-full text-left px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
                Invite New User
              </button>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Database Connection</span>
              <span className="text-sm text-green-600">✓ Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Email Service</span>
              <span className="text-sm text-green-600">✓ Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Payment Gateway</span>
              <span className="text-sm text-green-600">✓ Ready</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Analytics</span>
              <span className="text-sm text-green-600">✓ Tracking</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
