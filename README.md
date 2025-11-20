# Dobeu Cloud - Tech Consulting Website

A modern, full-featured tech consulting website built with Next.js, TypeScript, and MongoDB.

## Features

### 🚀 Core Features
- **Infinite Scroll Landing Page** - Smooth scrolling experience with parallax effects
- **Multi-language Support** - English/Spanish toggle with next-intl
- **Dark/Light Theme** - System-aware theme switching
- **Authentication System** - Email/SMS verification with Supabase
- **Admin Portal** - Comprehensive content and user management
- **Client Dashboard** - Invoice viewing, appointment scheduling, file uploads

### 💼 Business Features
- **Invoicing System** - Create, send, and track invoices with payment integration
- **Quote Management** - Dynamic quote generation and tracking
- **Appointment Scheduling** - Calendar integration with availability management
- **Portfolio Showcase** - Dynamic portfolio with categorization
- **Contact Forms** - Multi-purpose forms with validation

### 💳 Payment Processing
- **PayPal Integration** - Accept payments via PayPal
- **Square Integration** - Alternative payment processing
- **Payment Tracking** - Comprehensive payment history

### 📊 Analytics & Monitoring
- **Google Analytics 4** - Page views and user behavior tracking
- **Apollo Tracking** - Visitor intelligence and lead scoring
- **Custom Analytics** - MongoDB-based analytics with AI insights
- **Sentry Integration** - Error tracking and performance monitoring
- **Core Web Vitals** - Real-time performance metrics

### 🛠 Technical Features
- **MongoDB Database** - Scalable data storage with Mongoose ORM
- **GitHub Actions CI/CD** - Automated testing and deployment
- **Netlify Hosting** - Fast, global CDN with automatic deployments
- **Intercom Support** - Live chat for visitors and authenticated users
- **SEO Optimized** - Meta tags, structured data, sitemap
- **Responsive Design** - Mobile-first approach
- **Accessibility** - WCAG 2.1 AA compliant

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Authentication**: Supabase Auth
- **Payments**: PayPal, Square
- **Analytics**: Google Analytics, Apollo, Custom MongoDB analytics
- **Error Tracking**: Sentry
- **Support**: Intercom
- **Hosting**: Netlify
- **CI/CD**: GitHub Actions

## Project Structure

```
dobeucloud/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (legal)/           # Terms of Service, Privacy Policy
│   ├── admin/             # Admin portal
│   ├── dashboard/         # User dashboard
│   ├── api/               # API routes
│   └── schedule/          # Appointment scheduling
├── components/            # Reusable React components
├── lib/                   # Utilities and configurations
│   ├── models/            # MongoDB schemas
│   ├── supabase-client.ts # Supabase client config
│   └── mongodb.ts         # MongoDB connection
├── public/                # Static assets
├── .github/workflows/     # GitHub Actions
└── middleware.ts          # Next.js middleware
```

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# MongoDB
MONGODB_URI=your-mongodb-connection-string

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=your-ga4-measurement-id
NEXT_PUBLIC_INTERCOM_APP_ID=your-intercom-app-id
NEXT_PUBLIC_APOLLO_APP_ID=your-apollo-app-id

# Payments
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_SECRET=your-paypal-secret
NEXT_PUBLIC_SQUARE_APPLICATION_ID=your-square-app-id
NEXT_PUBLIC_SQUARE_LOCATION_ID=your-square-location-id
SQUARE_ACCESS_TOKEN=your-square-access-token

# Sentry
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn

# Site
NEXT_PUBLIC_SITE_URL=https://dobeu.cloud
ADMIN_EMAIL=admin@dobeu.cloud
```

## Getting Started

1. **Clone the repository**
```bash
git clone https://github.com/Dobeu-Tech-Solutions/dobeucloud.git
cd dobeucloud
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Copy `.env.example` to `.env.local` and fill in your values

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to http://localhost:3000

## Deployment

### Netlify Deployment

1. **Connect GitHub repository to Netlify**
   - Log in to Netlify
   - Click "New site from Git"
   - Select the repository

2. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Set environment variables**
   - Add all environment variables from `.env.local`

4. **Deploy**
   - Netlify will automatically deploy on push to master

### GitHub Actions

The project includes several GitHub Actions workflows:

- **Main CI/CD Pipeline** - Runs on every push/PR
  - Linting
  - Type checking
  - Security scanning
  - Tests
  - Build verification
  - Lighthouse performance tests

- **Database Integrity Check** - Daily scheduled job
  - MongoDB health check
  - Data validation

- **Code Review** - On pull requests
  - Code quality analysis
  - Bundle size analysis
  - AI-powered review

- **Dependabot** - Weekly dependency updates

## Admin Setup

1. **Create admin user**
   - Sign up normally through `/register`
   - Update user role in MongoDB: `db.users.updateOne({email: "admin@email.com"}, {$set: {role: "admin"}})`

2. **Access admin portal**
   - Navigate to `/admin`
   - Use admin credentials

## Performance Optimization

- **Image optimization** with Next.js Image component
- **Code splitting** automatic with Next.js
- **Font optimization** with next/font
- **Lazy loading** for components and images
- **Edge caching** with Netlify
- **Database indexes** for fast queries

## Security

- **Environment variables** for sensitive data
- **HTTPS only** enforced by Netlify
- **Input validation** with Zod
- **SQL injection protection** with Mongoose
- **XSS protection** built into React
- **CSRF protection** with Supabase
- **Rate limiting** on API routes
- **Security headers** configured

## Monitoring

- **Sentry** for error tracking
- **Core Web Vitals** monitoring
- **Custom performance metrics**
- **Real-time error alerts**
- **Performance dashboards**

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software owned by Dobeu Tech Solutions.

## Support

For support, email support@dobeu.cloud or use the Intercom chat on the website.