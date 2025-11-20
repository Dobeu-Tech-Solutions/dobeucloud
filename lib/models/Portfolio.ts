import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPortfolio extends Document {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  tags: string[];
  images: {
    thumbnail: string;
    gallery: string[];
  };
  client?: string;
  projectDate: Date;
  projectUrl?: string;
  technologies: string[];
  features: string[];
  testimonial?: {
    text: string;
    author: string;
    position?: string;
    company?: string;
  };
  metrics?: {
    name: string;
    value: string;
    improvement?: string;
  }[];
  published: boolean;
  featured: boolean;
  order: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioSchema = new Schema<IPortfolio>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
      maxLength: 200,
    },
    category: {
      type: String,
      required: true,
    },
    tags: [{
      type: String,
      lowercase: true,
      trim: true,
    }],
    images: {
      thumbnail: {
        type: String,
        required: true,
      },
      gallery: [{
        type: String,
      }],
    },
    client: String,
    projectDate: {
      type: Date,
      required: true,
    },
    projectUrl: String,
    technologies: [{
      type: String,
      required: true,
    }],
    features: [{
      type: String,
      required: true,
    }],
    testimonial: {
      text: String,
      author: String,
      position: String,
      company: String,
    },
    metrics: [{
      name: String,
      value: String,
      improvement: String,
    }],
    published: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug from title if not provided
PortfolioSchema.pre('save', function (next) {
  if (this.isNew && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }
  next();
});

// Indexes
PortfolioSchema.index({ slug: 1 });
PortfolioSchema.index({ published: 1, featured: 1, order: 1 });
PortfolioSchema.index({ category: 1, published: 1 });
PortfolioSchema.index({ tags: 1 });

const Portfolio: Model<IPortfolio> = mongoose.models.Portfolio || mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);

export default Portfolio;
