import { requireAuth } from '@/lib/auth';
import { Card } from '@/components/ui/card';
import { 
  FileText, 
  CreditCard, 
  Calendar, 
  Activity,
  TrendingUp,
  Users,
  DollarSign,
  Clock
} from 'lucide-react';

export default async function DashboardPage() {
  const user = await requireAuth();

  // TODO: Fetch real data from MongoDB
  const stats = {
    activeProjects: 3,
    unpaidInvoices: 2,
    upcomingMeetings: 4,
    totalRevenue: 15420,
  };

  const recentActivity = [
    { id: 1, action: 'Invoice paid', detail: 'Invoice #INV-2025-0042', time: '2 hours ago' },
    { id: 2, action: 'Meeting scheduled', detail: 'Project review with John Doe', time: '5 hours ago' },
    { id: 3, action: 'Quote sent', detail: 'Quote #QT-2025-0015', time: '1 day ago' },
    { id: 4, action: 'Project completed', detail: 'E-commerce Platform Update', time: '2 days ago' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user.email.split('@')[0]}!
        </h2>
        <p className="text-gray-400">
          Here's an overview of your account activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="bg-gray-900/50 border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Projects</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.activeProjects}</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">2 due this week</p>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Unpaid Invoices</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.unpaidInvoices}</p>
            </div>
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <CreditCard className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">$4,250 pending</p>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Upcoming Meetings</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.upcomingMeetings}</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Next in 2 hours</p>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-white mt-2">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <p className="text-sm text-green-500 mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            +12% from last month
          </p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="bg-gray-900/50 border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-800 last:border-0 last:pb-0">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.action}</p>
                  <p className="text-gray-400 text-sm">{activity.detail}</p>
                </div>
                <p className="text-gray-500 text-sm">{activity.time}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gray-900/50 border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Quick Actions</h3>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors text-left">
              <FileText className="w-6 h-6 text-blue-500 mb-2" />
              <p className="text-white font-medium">Create Invoice</p>
              <p className="text-gray-500 text-sm">Generate new invoice</p>
            </button>
            
            <button className="p-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors text-left">
              <Calendar className="w-6 h-6 text-purple-500 mb-2" />
              <p className="text-white font-medium">Schedule Meeting</p>
              <p className="text-gray-500 text-sm">Book consultation</p>
            </button>
            
            <button className="p-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors text-left">
              <DollarSign className="w-6 h-6 text-green-500 mb-2" />
              <p className="text-white font-medium">Request Quote</p>
              <p className="text-gray-500 text-sm">New project quote</p>
            </button>
            
            <button className="p-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors text-left">
              <Clock className="w-6 h-6 text-orange-500 mb-2" />
              <p className="text-white font-medium">View Hours</p>
              <p className="text-gray-500 text-sm">Track time spent</p>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
