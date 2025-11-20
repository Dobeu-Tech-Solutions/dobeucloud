import { Suspense } from 'react';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import Invoice from '@/lib/models/Invoice';
import { Button } from '@/components/ui/button';
import { Plus, Mail, Phone, Shield, CheckCircle, XCircle } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';

async function getUsersWithStats() {
  await dbConnect();
  
  const users = await User.find().sort({ createdAt: -1 }).lean();
  
  // Get invoice stats for each user
  const userIds = users.map(u => u._id);
  const invoiceStats = await Invoice.aggregate([
    { $match: { client: { $in: userIds } } },
    {
      $group: {
        _id: '$client',
        totalSpent: { $sum: '$paidAmount' },
        invoiceCount: { $sum: 1 },
      },
    },
  ]);

  // Map stats to users
  const usersWithStats = users.map(user => {
    const stats = invoiceStats.find(s => s._id.toString() === user._id.toString());
    return {
      ...user,
      totalSpent: stats?.totalSpent || 0,
      invoiceCount: stats?.invoiceCount || 0,
    } as any;
  });

  return usersWithStats;
}

export default async function UsersManagement() {
  const users = await getUsersWithStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/users/invite">
            <Plus className="mr-2 h-4 w-4" />
            Invite User
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-2xl font-bold">{users.length}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-2xl font-bold">
            {users.filter(u => u.emailVerified).length}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Verified Users</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-2xl font-bold">
            {users.filter(u => u.role === 'admin').length}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Admins</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <Suspense fallback={<div>Loading users...</div>}>
            {users.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No users yet
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Lifetime Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user) => (
                      <tr key={user._id.toString()}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                {user.name}
                                {user.role === 'admin' && (
                                  <Shield className="w-4 h-4 text-blue-500" />
                                )}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {user.company || 'No company'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm space-y-1">
                            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                              <Mail className="w-4 h-4 text-gray-400" />
                              {user.email}
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <Phone className="w-4 h-4 text-gray-400" />
                                {user.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              {user.emailVerified ? (
                                <>
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  <span className="text-sm text-green-600 dark:text-green-400">
                                    Email Verified
                                  </span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4 text-red-500" />
                                  <span className="text-sm text-red-600 dark:text-red-400">
                                    Unverified
                                  </span>
                                </>
                              )}
                            </div>
                            {user.phoneVerified && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Phone verified
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {formatCurrency(user.totalSpent)}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400">
                              {user.invoiceCount} invoices
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            variant="link"
                            className="text-blue-600 hover:text-blue-900"
                            asChild
                          >
                            <Link href={`/admin/users/${user._id}`}>
                              View Details
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
