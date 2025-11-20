import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuoteItem {
  service: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface IQuote extends Document {
  quoteNumber: string;
  client: mongoose.Types.ObjectId;
  issueDate: Date;
  expiryDate: Date;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  projectName: string;
  projectScope: string;
  services: string[];
  items: IQuoteItem[];
  subtotal: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  total: number;
  currency: string;
  terms?: string;
  notes?: string;
  attachments?: string[];
  sentAt?: Date;
  respondedAt?: Date;
  response?: {
    status: 'accepted' | 'rejected';
    message?: string;
    date: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const QuoteItemSchema = new Schema<IQuoteItem>({
  service: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  rate: { type: Number, required: true, min: 0 },
  amount: { type: Number, required: true, min: 0 },
});

const QuoteSchema = new Schema<IQuote>(
  {
    quoteNumber: {
      type: String,
      required: true,
      unique: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'accepted', 'rejected', 'expired'],
      default: 'draft',
    },
    projectName: {
      type: String,
      required: true,
    },
    projectScope: {
      type: String,
      required: true,
    },
    services: [{
      type: String,
      required: true,
    }],
    items: {
      type: [QuoteItemSchema],
      required: true,
      validate: [(val: IQuoteItem[]) => val.length > 0, 'At least one item is required'],
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    terms: String,
    notes: String,
    attachments: [String],
    sentAt: Date,
    respondedAt: Date,
    response: {
      status: {
        type: String,
        enum: ['accepted', 'rejected'],
      },
      message: String,
      date: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Generate quote number
QuoteSchema.pre('save', async function (next) {
  if (this.isNew && !this.quoteNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.models.Quote.countDocuments({
      createdAt: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1),
      },
    });
    this.quoteNumber = `QT-${year}-${String(count + 1).padStart(4, '0')}`;
  }

  // Check expiry status
  if (this.expiryDate < new Date() && this.status === 'sent') {
    this.status = 'expired';
  }

  next();
});

// Indexes
QuoteSchema.index({ quoteNumber: 1 });
QuoteSchema.index({ client: 1, status: 1 });
QuoteSchema.index({ status: 1, expiryDate: 1 });

const Quote: Model<IQuote> = mongoose.models.Quote || mongoose.model<IQuote>('Quote', QuoteSchema);

export default Quote;
