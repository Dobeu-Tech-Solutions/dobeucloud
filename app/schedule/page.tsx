'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, Phone, MapPin, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';

interface TimeSlot {
  time: string;
  available: boolean;
}

const appointmentTypes = [
  {
    id: 'consultation',
    title: 'Initial Consultation',
    duration: 30,
    description: 'Discuss your project needs and explore how we can help',
    icon: Video,
  },
  {
    id: 'project_review',
    title: 'Project Review',
    duration: 60,
    description: 'Review ongoing project progress and plan next steps',
    icon: Video,
  },
  {
    id: 'support',
    title: 'Technical Support',
    duration: 45,
    description: 'Get help with technical issues or questions',
    icon: Phone,
  },
  {
    id: 'training',
    title: 'Training Session',
    duration: 90,
    description: 'Learn how to use and manage your new system',
    icon: Video,
  },
];

const locationTypes = [
  { id: 'online', title: 'Video Call', icon: Video },
  { id: 'phone', title: 'Phone Call', icon: Phone },
  { id: 'in_person', title: 'In-Person (Office)', icon: MapPin },
];

// Generate mock time slots
function generateTimeSlots(date: Date): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const dayOfWeek = date.getDay();
  
  // No appointments on weekends
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return slots;
  }
  
  // Generate slots from 9 AM to 5 PM
  for (let hour = 9; hour < 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      // Mock availability (random for demo)
      const available = Math.random() > 0.3;
      slots.push({ time, available });
    }
  }
  
  return slots;
}

export default function SchedulePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      const slots = generateTimeSlots(selectedDate);
      setAvailableSlots(slots);
    }
  }, [selectedDate]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleDateSelect = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date >= today) {
      setSelectedDate(date);
      setSelectedTime('');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const appointmentData = {
        type: selectedType,
        location: selectedLocation,
        date: selectedDate,
        time: selectedTime,
        duration: appointmentTypes.find(t => t.id === selectedType)?.duration || 30,
        ...formData,
      };
      
      // TODO: Submit to API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Appointment scheduled successfully! You will receive a confirmation email shortly.');
      router.push('/dashboard/appointments');
    } catch (error) {
      toast.error('Failed to schedule appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepComplete = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return selectedType !== '';
      case 2:
        return selectedLocation !== '';
      case 3:
        return selectedDate !== null && selectedTime !== '';
      case 4:
        return formData.name !== '' && formData.email !== '';
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Schedule a Meeting
          </h1>
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className={`flex items-center ${num < 4 ? 'flex-1' : ''}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                      step > num
                        ? 'bg-green-500 text-white'
                        : step === num
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {step > num ? <Check className="w-5 h-5" /> : num}
                  </div>
                  {num < 4 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition-colors ${
                        step > num
                          ? 'bg-green-500'
                          : 'bg-gray-300 dark:bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm">
              <span>Type</span>
              <span>Location</span>
              <span>Date & Time</span>
              <span>Details</span>
            </div>
          </div>

          {/* Step 1: Appointment Type */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Select Appointment Type</CardTitle>
                <CardDescription>
                  Choose the type of meeting that best fits your needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {appointmentTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <motion.div
                        key={type.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <button
                          onClick={() => setSelectedType(type.id)}
                          className={`w-full p-6 text-left rounded-lg border-2 transition-colors ${
                            selectedType === type.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${
                              selectedType === type.id
                                ? 'bg-blue-100 dark:bg-blue-800/30'
                                : 'bg-gray-100 dark:bg-gray-800'
                            }`}>
                              <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {type.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {type.description}
                              </p>
                              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-2">
                                {type.duration} minutes
                              </p>
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!selectedType}
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Select Meeting Location</CardTitle>
                <CardDescription>
                  Choose how you'd like to meet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {locationTypes.map((location) => {
                    const Icon = location.icon;
                    return (
                      <motion.div
                        key={location.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <button
                          onClick={() => setSelectedLocation(location.id)}
                          className={`w-full p-6 rounded-lg border-2 transition-colors ${
                            selectedLocation === location.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
                          }`}
                        >
                          <Icon className="w-8 h-8 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {location.title}
                          </h3>
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="mt-6 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!selectedLocation}
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Date & Time */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Select Date & Time</CardTitle>
                <CardDescription>
                  Choose an available time slot
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Calendar */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">
                        {currentMonth.toLocaleDateString('en-US', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </h3>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handlePrevMonth}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleNextMonth}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div
                          key={day}
                          className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {getDaysInMonth(currentMonth).map((date, index) => {
                        if (!date) {
                          return <div key={index} />;
                        }
                        
                        const isToday = date.toDateString() === new Date().toDateString();
                        const isSelected = selectedDate?.toDateString() === date.toDateString();
                        const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                        
                        return (
                          <button
                            key={index}
                            onClick={() => handleDateSelect(date)}
                            disabled={isPast}
                            className={`p-2 rounded-lg text-sm transition-colors ${
                              isSelected
                                ? 'bg-blue-500 text-white'
                                : isToday
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                : isPast
                                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                          >
                            {date.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div>
                    <h3 className="font-medium mb-4">Available Times</h3>
                    {selectedDate ? (
                      <div className="max-h-96 overflow-y-auto">
                        <div className="grid grid-cols-3 gap-2">
                          {availableSlots.map((slot) => (
                            <button
                              key={slot.time}
                              onClick={() => setSelectedTime(slot.time)}
                              disabled={!slot.available}
                              className={`p-2 rounded-lg text-sm transition-colors ${
                                selectedTime === slot.time
                                  ? 'bg-blue-500 text-white'
                                  : slot.available
                                  ? 'border border-gray-300 dark:border-gray-700 hover:border-blue-500'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              {slot.time}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                        Select a date to view available times
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(4)}
                    disabled={!selectedDate || !selectedTime}
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Contact Details */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
                <CardDescription>
                  Please provide your contact details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Message / Additional Information
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                      placeholder="Please let us know what you'd like to discuss..."
                    />
                  </div>
                  
                  {/* Summary */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-medium mb-3">Appointment Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Type:</span>
                        <span className="font-medium">
                          {appointmentTypes.find(t => t.id === selectedType)?.title}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Location:</span>
                        <span className="font-medium">
                          {locationTypes.find(l => l.id === selectedLocation)?.title}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Date:</span>
                        <span className="font-medium">
                          {selectedDate?.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Time:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                        <span className="font-medium">
                          {appointmentTypes.find(t => t.id === selectedType)?.duration} minutes
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep(3)}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!formData.name || !formData.email || isSubmitting}
                  >
                    {isSubmitting ? 'Scheduling...' : 'Schedule Appointment'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
