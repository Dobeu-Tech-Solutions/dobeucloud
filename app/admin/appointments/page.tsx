import { Suspense } from 'react';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Appointment, { type IAppointment } from '@/lib/models/Appointment';
import User from '@/lib/models/User';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Video, Phone, User as UserIcon } from 'lucide-react';
import { formatDate, formatRelativeTime } from '@/lib/utils';

interface PopulatedAppointment extends Omit<IAppointment, 'client' | 'host'> {
  client?: {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
  } | null;
  host?: {
    _id: string;
    name: string;
  } | null;
}

async function getAppointments(): Promise<any[]> {
  await dbConnect();
  return Appointment.find()
    .populate('client', 'name email phone')
    .populate('host', 'name')
    .sort({ startTime: 1 })
    .lean()
    .exec();
}

function getStatusColor(status: string) {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'scheduled':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    case 'completed':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    case 'no_show':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  }
}

function getLocationIcon(type: string) {
  switch (type) {
    case 'online':
      return Video;
    case 'phone':
      return Phone;
    case 'in_person':
      return MapPin;
    default:
      return Calendar;
  }
}

export default async function AppointmentsManagement() {
  const appointments = await getAppointments();
  
  const now = new Date();
  const upcoming = appointments.filter(apt => new Date(apt.startTime) >= now && apt.status !== 'cancelled');
  const past = appointments.filter(apt => new Date(apt.startTime) < now || apt.status === 'cancelled');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Appointments</h2>
          <p className="text-muted-foreground">
            Manage scheduled appointments and meetings
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/admin/appointments/availability">
              <Clock className="mr-2 h-4 w-4" />
              Set Availability
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/appointments/new">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-2xl font-bold">{upcoming.length}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-2xl font-bold">
            {upcoming.filter(apt => {
              const startDate = new Date(apt.startTime);
              return startDate.toDateString() === now.toDateString();
            }).length}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Today</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-2xl font-bold">
            {upcoming.filter(apt => {
              const startDate = new Date(apt.startTime);
              const endOfWeek = new Date(now);
              endOfWeek.setDate(now.getDate() + 7);
              return startDate >= now && startDate <= endOfWeek;
            }).length}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">This Week</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-2xl font-bold">
            {appointments.filter(apt => apt.status === 'confirmed').length}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Confirmed</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Upcoming Appointments</h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <Suspense fallback={<div>Loading appointments...</div>}>
                {upcoming.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No upcoming appointments
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcoming.map((appointment) => {
                      const LocationIcon = getLocationIcon(appointment.location.type);
                      return (
                        <div
                          key={appointment._id.toString()}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-lg font-medium">{appointment.title}</h4>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <UserIcon className="w-4 h-4" />
                                    <span>{(appointment.client as any)?.name || 'Unknown'}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <Clock className="w-4 h-4" />
                                    <span>
                                      {formatDate(appointment.startTime)} at{' '}
                                      {new Date(appointment.startTime).toLocaleTimeString('en-US', {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                      })}
                                    </span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <LocationIcon className="w-4 h-4" />
                                    <span>
                                      {appointment.location.type.charAt(0).toUpperCase() + 
                                       appointment.location.type.slice(1).replace('_', ' ')}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <Calendar className="w-4 h-4" />
                                    <span>{appointment.duration} minutes</span>
                                  </div>
                                </div>
                              </div>
                              
                              {appointment.notes && (
                                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                                  {appointment.notes}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex gap-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <Link href={`/admin/appointments/${appointment._id}`}>
                                  View Details
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Suspense>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Past Appointments</h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <Suspense fallback={<div>Loading appointments...</div>}>
                {past.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No past appointments
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Client
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {past.slice(0, 10).map((appointment) => (
                          <tr key={appointment._id.toString()}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {appointment.title}
                            </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {(appointment.client as any)?.name || 'Unknown'}
                        </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(appointment.startTime)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button
                                variant="link"
                                className="text-blue-600 hover:text-blue-900"
                                asChild
                              >
                                <Link href={`/admin/appointments/${appointment._id}`}>
                                  View
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
      </div>
    </div>
  );
}
