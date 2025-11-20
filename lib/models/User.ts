import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  phone?: string;
  phoneVerified: boolean;
  smsOptIn: boolean;
  emailVerified: boolean;
  role: 'client' | 'admin';
  stripeCustomerId?: string;
  squareCustomerId?: string;
  paypalEmail?: string;
  newsletterSubscribed: boolean;
  language: 'en' | 'es';
  theme: 'light' | 'dark' | 'system';
  supabaseId: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    smsOptIn: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['client', 'admin'],
      default: 'client',
    },
    stripeCustomerId: String,
    squareCustomerId: String,
    paypalEmail: String,
    newsletterSubscribed: {
      type: Boolean,
      default: false,
    },
    language: {
      type: String,
      enum: ['en', 'es'],
      default: 'en',
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
    supabaseId: {
      type: String,
      required: true,
      unique: true,
    },
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ supabaseId: 1 });
UserSchema.index({ role: 1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
