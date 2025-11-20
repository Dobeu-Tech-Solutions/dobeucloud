import { formatRelativeTime } from '@/lib/utils';
import dbConnect from '@/lib/mongodb';
import Contact from '@/lib/models/Contact';
import Invoice from '@/lib/models/Invoice';
import Quote from '@/lib/models/Quote';
import Appointment from '@/lib/models/Appointment';
import { 
  MessageSquare, 
  Receipt, 
  FileText, 
  Calendar,
  User
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'contact' | 'invoice' | 'quote' | 'appointment' | 'user';
  title: string;
  description: string;
  timestamp: Date;
  icon: any;
  color: string;
}

async function getRecentActivity(): Promise<Activity[]> {
  await dbConnect();

  const [contacts, invoices, quotes, appointments] = await Promise.all([
    Contact.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select('name subject createdAt')
      .lean(),
    Invoice.find()
      .sort({ updatedAt: -1 })
      .limit(3)
      .populate('client', 'name')
      .select('invoiceNumber client status updatedAt')
      .lean(),
    Quote.find()
      .sort({ updatedAt: -1 })
      .limit(3)
      .populate('client', 'name')
      .select('quoteNumber client status updatedAt')
      .lean(),
    Appointment.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('client', 'name')
      .select('title client startTime createdAt')
      .lean(),
  ]);

  const activities: Activity[] = [];

  // Add contacts
  contacts.forEach(contact => {
    activities.push({
      id: contact._id.toString(),
      type: 'contact',
      title: `New message from ${contact.name}`,
      description: contact.subject,
      timestamp: contact.createdAt,
      icon: MessageSquare,
      color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    });
  });

  // Add invoices
  invoices.forEach(invoice => {
    activities.push({
      id: invoice._id.toString(),
      type: 'invoice',
      title: `Invoice ${invoice.invoiceNumber}`,
      description: `${invoice.status} - ${(invoice.client as any)?.name || 'Unknown'}`,
      timestamp: invoice.updatedAt,
      icon: Receipt,
      color: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    });
  });

  // Add quotes
  quotes.forEach(quote => {
    activities.push({
      id: quote._id.toString(),
      type: 'quote',
      title: `Quote ${quote.quoteNumber}`,
      description: `${quote.status} - ${(quote.client as any)?.name || 'Unknown'}`,
      timestamp: quote.updatedAt,
      icon: FileText,
      color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    });
  });

  // Add appointments
  appointments.forEach(appointment => {
    activities.push({
      id: appointment._id.toString(),
      type: 'appointment',
      title: appointment.title,
      description: `With ${(appointment.client as any)?.name || 'Unknown'}`,
      timestamp: appointment.createdAt,
      icon: Calendar,
      color: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    });
  });

  // Sort by timestamp and return top 10
  return activities
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10);
}

export default async function RecentActivity() {
  const activities = await getRecentActivity();

  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
          No recent activity
        </p>
      ) : (
        activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${activity.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {formatRelativeTime(activity.timestamp)}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
