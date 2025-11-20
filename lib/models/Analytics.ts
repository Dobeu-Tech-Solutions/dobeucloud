import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnalytics extends Document {
  event: string;
  category: 'page_view' | 'user_action' | 'conversion' | 'error' | 'performance';
  userId?: mongoose.Types.ObjectId;
  sessionId: string;
  data: Record<string, any>;
  metadata: {
    ip?: string;
    userAgent?: string;
    referrer?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    browser?: string;
    os?: string;
    device?: string;
    country?: string;
    city?: string;
  };
  createdAt: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>(
  {
    event: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['page_view', 'user_action', 'conversion', 'error', 'performance'],
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    data: {
      type: Schema.Types.Mixed,
      default: {},
    },
    metadata: {
      ip: String,
      userAgent: String,
      referrer: String,
      utm_source: String,
      utm_medium: String,
      utm_campaign: String,
      browser: String,
      os: String,
      device: String,
      country: String,
      city: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Indexes for analytics queries
AnalyticsSchema.index({ createdAt: -1 });
AnalyticsSchema.index({ category: 1, createdAt: -1 });
AnalyticsSchema.index({ event: 1, createdAt: -1 });
AnalyticsSchema.index({ 'metadata.utm_source': 1, createdAt: -1 });
AnalyticsSchema.index({ 'metadata.country': 1, createdAt: -1 });

// TTL index to automatically delete old analytics after 1 year
AnalyticsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 31536000 });

const Analytics: Model<IAnalytics> = mongoose.models.Analytics || mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);

export default Analytics;
