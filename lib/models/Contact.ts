import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  source: 'contact_form' | 'quote_request' | 'schedule_meeting';
  status: 'new' | 'in_progress' | 'completed' | 'spam';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: mongoose.Types.ObjectId;
  tags: string[];
  notes?: {
    text: string;
    author: mongoose.Types.ObjectId;
    createdAt: Date;
  }[];
  metadata?: {
    ip?: string;
    userAgent?: string;
    referrer?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      enum: ['contact_form', 'quote_request', 'schedule_meeting'],
      required: true,
    },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'completed', 'spam'],
      default: 'new',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    tags: [{
      type: String,
      lowercase: true,
      trim: true,
    }],
    notes: [{
      text: String,
      author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    metadata: {
      ip: String,
      userAgent: String,
      referrer: String,
      utm_source: String,
      utm_medium: String,
      utm_campaign: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ContactSchema.index({ email: 1 });
ContactSchema.index({ status: 1, priority: 1 });
ContactSchema.index({ source: 1, createdAt: -1 });
ContactSchema.index({ assignedTo: 1, status: 1 });

const Contact: Model<IContact> = mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;
