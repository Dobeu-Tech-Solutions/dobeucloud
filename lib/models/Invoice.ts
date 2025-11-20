import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface IPayment {
  date: Date;
  amount: number;
  method: 'paypal' | 'square' | 'bank_transfer' | 'other';
  transactionId?: string;
  notes?: string;
}

export interface IInvoice extends Document {
  invoiceNumber: string;
  client: mongoose.Types.ObjectId;
  issueDate: Date;
  dueDate: Date;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: IInvoiceItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  currency: string;
  notes?: string;
  terms?: string;
  payments: IPayment[];
  paidAmount: number;
  balance: number;
  sentAt?: Date;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSchema = new Schema<IInvoiceItem>({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  rate: { type: Number, required: true, min: 0 },
  amount: { type: Number, required: true, min: 0 },
});

const PaymentSchema = new Schema<IPayment>({
  date: { type: Date, required: true },
  amount: { type: Number, required: true, min: 0 },
  method: { 
    type: String, 
    enum: ['paypal', 'square', 'bank_transfer', 'other'],
    required: true 
  },
  transactionId: String,
  notes: String,
});

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: {
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
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
      default: 'draft',
    },
    items: {
      type: [InvoiceItemSchema],
      required: true,
      validate: [(val: IInvoiceItem[]) => val.length > 0, 'At least one item is required'],
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    taxRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
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
    notes: String,
    terms: String,
    payments: {
      type: [PaymentSchema],
      default: [],
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    balance: {
      type: Number,
      required: true,
    },
    sentAt: Date,
    paidAt: Date,
  },
  {
    timestamps: true,
  }
);

// Generate invoice number
InvoiceSchema.pre('save', async function (next) {
  if (this.isNew && !this.invoiceNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.models.Invoice.countDocuments({
      createdAt: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1),
      },
    });
    this.invoiceNumber = `INV-${year}-${String(count + 1).padStart(4, '0')}`;
  }

  // Calculate balance
  this.balance = this.total - this.paidAmount;

  // Update status based on payments and dates
  if (this.balance === 0 && this.paidAmount > 0) {
    this.status = 'paid';
    if (!this.paidAt) {
      this.paidAt = new Date();
    }
  } else if (this.dueDate < new Date() && this.balance > 0 && this.status !== 'cancelled') {
    this.status = 'overdue';
  }

  next();
});

// Indexes
InvoiceSchema.index({ invoiceNumber: 1 });
InvoiceSchema.index({ client: 1, status: 1 });
InvoiceSchema.index({ status: 1, dueDate: 1 });

const Invoice: Model<IInvoice> = mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);

export default Invoice;
