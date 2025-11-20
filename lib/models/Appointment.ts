import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAppointment extends Document {
  title: string;
  description?: string;
  client: mongoose.Types.ObjectId;
  host: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  type: 'consultation' | 'project_review' | 'support' | 'training' | 'other';
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  location: {
    type: 'online' | 'in_person' | 'phone';
    details?: string;
    meetingUrl?: string;
  };
  reminder: {
    email: boolean;
    sms: boolean;
    sent: boolean;
    sentAt?: Date;
  };
  notes?: string;
  attachments?: string[];
  googleEventId?: string;
  outlookEventId?: string;
  rescheduledFrom?: mongoose.Types.ObjectId;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    host: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    startTime: {
      type: Date,
      required: true,
      index: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 15,
      max: 480, // 8 hours max
    },
    type: {
      type: String,
      enum: ['consultation', 'project_review', 'support', 'training', 'other'],
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'cancelled', 'completed', 'no_show'],
      default: 'scheduled',
      index: true,
    },
    location: {
      type: {
        type: String,
        enum: ['online', 'in_person', 'phone'],
        required: true,
      },
      details: String,
      meetingUrl: String,
    },
    reminder: {
      email: {
        type: Boolean,
        default: true,
      },
      sms: {
        type: Boolean,
        default: false,
      },
      sent: {
        type: Boolean,
        default: false,
      },
      sentAt: Date,
    },
    notes: String,
    attachments: [String],
    googleEventId: String,
    outlookEventId: String,
    rescheduledFrom: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    cancellationReason: String,
  },
  {
    timestamps: true,
  }
);

// Validate end time is after start time
AppointmentSchema.pre('save', function (next) {
  if (this.endTime <= this.startTime) {
    next(new Error('End time must be after start time'));
  }
  
  // Calculate duration
  this.duration = Math.round((this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60));
  
  next();
});

// Indexes for calendar queries
AppointmentSchema.index({ startTime: 1, endTime: 1 });
AppointmentSchema.index({ host: 1, startTime: 1 });
AppointmentSchema.index({ client: 1, status: 1 });
AppointmentSchema.index({ status: 1, startTime: 1 });
AppointmentSchema.index({ 'reminder.sent': 1, startTime: 1 });

const Appointment: Model<IAppointment> = mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);

export default Appointment;
