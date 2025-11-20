# Dobeu Cloud - Tech Consulting Website

A modern tech consulting website built with Next.js, featuring infinite scroll design, payment processing, scheduling, and comprehensive user management.

## 🚀 Features

- **Infinite Scroll Landing Page** with smooth animations
- **Multi-language Support** (English/Spanish)
- **Dark/Light Theme** with system preference detection
- **Payment Processing** via PayPal and Square
- **User Authentication** with email/SMS verification
- **Customer Portal** with invoicing and billing history
- **Quote Request System** for custom services
- **Scheduling System** with Google Calendar/Outlook integration
- **Real-time Support** via Intercom
- **Visitor Intelligence** with Apollo tracking
- **Analytics** via Google Analytics 4 and custom MongoDB tracking

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Authentication**: Supabase Auth
- **Payment**: PayPal & Square
- **Hosting**: Netlify
- **Email**: Resend (via Supabase Edge Functions)
- **Support**: Intercom
- **Analytics**: Google Analytics 4 & Apollo

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB database
- Supabase account
- PayPal & Square merchant accounts
- Netlify account

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/Dobeu-Tech-Solutions/dobeucloud.git
cd dobeucloud
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file based on `env.config.md`

4. Run the development server:
```bash
npm run dev
```

## 🚀 Deployment

### Manual Netlify Deployment

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Create and link the site:
```bash
netlify init
```

4. Deploy:
```bash
netlify deploy --prod
```

### GitHub Auto-Deploy

1. Push to GitHub:
```bash
git push -u origin master
```

2. In Netlify Dashboard:
   - Import project from GitHub
   - Select `Dobeu-Tech-Solutions/dobeucloud`
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Add environment variables from `env.config.md`

3. Configure custom domain:
   - Add `dobeu.cloud` in Domain settings
   - Update DNS records as instructed

## 📁 Project Structure

```
dobeucloud/
├── app/                    # Next.js app directory
│   ├── (landing)/         # Landing page sections
│   ├── (auth)/            # Authentication pages
│   ├── (legal)/           # TOS and Privacy pages
│   ├── dashboard/         # User dashboard
│   ├── admin/             # Admin portal
│   ├── invoicing/         # Invoice management
│   ├── quotes/            # Quote request system
│   └── api/               # API routes
├── components/            # Reusable components
├── lib/                   # Utilities and configs
├── styles/                # Global styles
├── public/                # Static assets
├── .github/workflows/     # CI/CD pipelines
└── supabase/             # Edge functions
```

## 🔑 Environment Variables

See `env.config.md` for a complete list of required environment variables.

## 📱 Contact

- Website: [dobeu.cloud](https://dobeu.cloud)
- Email: support@dobeu.cloud
- Twitter: [@dobeutech](https://twitter.com/dobeutech)
- LinkedIn: [Dobeu Tech Solutions](https://linkedin.com/company/dobeu-tech-solutions)

## 📄 License

Copyright © 2024 Dobeu Tech Solutions. All rights reserved.