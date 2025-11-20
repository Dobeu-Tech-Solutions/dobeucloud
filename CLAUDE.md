# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dobeu Cloud is a modern tech consulting website built with Next.js 16 (App Router), featuring payment processing, user authentication, internationalization, and comprehensive analytics tracking. The application uses a hybrid database approach with MongoDB for analytics/business data and Supabase for authentication.

## Common Commands

### Development
```bash
npm run dev          # Start development server on localhost:3000
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Deployment
```bash
npm run netlify:build    # Build for Netlify deployment (includes standalone setup)
netlify deploy --prod    # Manual Netlify deployment (requires netlify-cli)
```

### Testing & CI
The project uses GitHub Actions workflows:
- `main.yml` - Main CI pipeline (build, lint, type-check)
- `code-review.yml` - Automated code review checks
- `database-check.yml` - Database connection and schema validation

## Architecture Overview

### Database Strategy (Dual-Database Hybrid)

The application uses **two separate databases** for different concerns:

1. **Supabase** (`lib/supabase.ts`)
   - **Purpose**: Authentication and user profiles only
   - **Usage**: Auth via `@supabase/ssr` with middleware-based session management
   - **Client Types**:
     - `createBrowserSupabaseClient()` - Client-side auth
     - `createServerSupabaseClient()` - Server Components/Route Handlers
     - `createAdminSupabaseClient()` - Admin operations (service role key)
   - **Profile Table**: Stores `user_id`, `role` (admin/user), and basic profile data

2. **MongoDB** (`lib/mongodb.ts`)
   - **Purpose**: All business data, analytics, and application state
   - **Connection**: Cached connection with connection pooling (maxPoolSize: 10)
   - **Models** (Mongoose schemas in `lib/models/`):
     - `User.ts` - Extended user data beyond auth
     - `Invoice.ts` - Billing and invoice records
     - `Quote.ts` - Service quote requests
     - `Appointment.ts` - Scheduling data
     - `Portfolio.ts` - Project portfolio items
     - `Contact.ts` - Contact form submissions
     - `Analytics.ts` - Custom analytics events

**Important**: Never mix concerns. Auth queries go to Supabase, everything else to MongoDB. The two systems are linked via user ID.

### Authentication & Authorization

Authentication flow is handled in `middleware.ts`:
- **Protected Routes**: `/dashboard`, `/admin`, `/invoicing`, `/quotes`
- **Admin Routes**: `/admin` (requires `role: 'admin'` in Supabase profiles table)
- **Auth Routes**: `/login`, `/register`, `/reset-password` (redirect to dashboard if logged in)
- Middleware validates sessions and role-based access before route access
- Session cookies managed via Supabase SSR (@supabase/ssr)

### Internationalization (i18n)

- Uses `next-intl` for internationalization
- Supported locales: English (en), Spanish (es)
- Translation messages in `lib/i18n/messages.ts` (large file with nested objects)
- Language context: `components/language-context.tsx`
- Language switcher: `components/language-switcher.tsx`
- No middleware-based locale routing; uses context-based switching

### Payment Processing

Two payment providers integrated in `lib/payments/`:
- **PayPal** (`paypal.ts`)
  - API routes: `/api/payments/paypal/create-order`, `/api/payments/paypal/capture-order`
  - Client-side integration via `@paypal/react-paypal-js`
- **Square** (`square.ts`)
  - API route: `/api/payments/square/create-payment`
  - Client-side SDK: `react-square-web-payments-sdk`
- Payment records stored in MongoDB via `/api/payments/record`

### Analytics & Tracking

Three-tier analytics system:
1. **Google Analytics 4** (`lib/analytics.ts`)
   - Custom events tracked via hooks: `hooks/use-analytics.ts`
   - Provider: `components/analytics-provider.tsx`

2. **Apollo.io** visitor intelligence (`lib/apollo.ts`)
   - Script injection: `components/apollo-script.tsx`
   - Hook: `hooks/use-apollo-tracking.ts`

3. **Custom MongoDB Analytics** (`lib/models/Analytics.ts`)
   - API endpoint: `/api/analytics/track`
   - Stores custom business events

### Email System

Email sending handled via **Supabase Edge Functions** (not Next.js API routes):
- Located in `supabase/functions/send-email/`
- Uses Resend API (`RESEND_API_KEY` environment variable)
- Invoked from server-side code via Supabase Function invocations

### Component Architecture

- **Landing Page**: Modular sections in `components/landing/`
- **UI Components**: Radix UI primitives in `components/ui/` (shadcn/ui pattern)
- **Dashboard**: User-specific components in `components/dashboard/`
- **Payments**: Payment form components in `components/payments/`
- **Providers**: Context providers in root layout:
  - `providers.tsx` - Theme provider (next-themes)
  - `analytics-provider.tsx` - GA4 tracking
  - `intercom-provider.tsx` - Customer support chat
  - `language-context.tsx` - i18n context

### Route Structure (App Router)

```
app/
├── page.tsx                    # Landing page
├── layout.tsx                  # Root layout (providers, metadata)
├── (auth)/                     # Auth route group (no layout)
│   ├── login/
│   ├── register/
│   └── reset-password/
├── dashboard/                  # User dashboard (protected)
├── admin/                      # Admin portal (admin-only)
├── quotes/                     # Quote management (protected)
├── api/                        # API routes
│   ├── auth/register/          # User registration
│   ├── payments/               # Payment processing endpoints
│   ├── analytics/track/        # Custom analytics
│   └── quotes/request/         # Quote submission
```

### Environment Variables

**Critical**: All environment variables must be set in `.env.local` (local dev) and Netlify dashboard (production). See `env.config.md` for complete list.

**Database**:
- `MONGODB_URI` - MongoDB connection string

**Authentication**:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Admin service key (server-only)

**Payment**:
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `PAYPAL_SECRET`
- `NEXT_PUBLIC_SQUARE_APPLICATION_ID`, `NEXT_PUBLIC_SQUARE_LOCATION_ID`, `SQUARE_ACCESS_TOKEN`

**Third-Party**:
- `NEXT_PUBLIC_INTERCOM_APP_ID` - Customer support
- `NEXT_PUBLIC_APOLLO_APP_ID` - Visitor tracking
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics

**Email**:
- `RESEND_API_KEY` - For Supabase edge functions

### TypeScript Configuration

- Path alias: `@/*` maps to root directory
- Strict mode enabled
- JSX runtime: `react-jsx` (automatic JSX transform)
- Target: ES2017

### Deployment Architecture

**Platform**: Netlify with Next.js plugin (`@netlify/plugin-nextjs`)
- Build command: `npm run netlify:build`
- Output: `.next` directory
- Node version: 18 (specified in `netlify.toml`)
- Security headers configured in `netlify.toml`
- API routes proxied to Netlify Functions via redirects

**Build Process**:
1. `next build` - Creates standalone build
2. Copy static assets to `.next/standalone/`
3. Copy public folder to standalone directory

### Key Integration Points

- **Intercom**: Live chat widget injected via `components/intercom-provider.tsx`
- **Apollo**: Visitor tracking script in `components/apollo-script.tsx`
- **Supabase Edge Functions**: Email sending (not Next.js API routes)
- **MongoDB**: All application data storage and analytics
- **Supabase**: Authentication and user profiles only

### Development Guidelines

1. **Database Operations**:
   - Use `dbConnect()` from `lib/mongodb.ts` before any MongoDB operations
   - Import models from `lib/models/index.ts`
   - For auth: use Supabase client helpers from `lib/supabase.ts`

2. **API Routes**:
   - Always validate environment variables exist
   - Use try-catch for external API calls
   - Return proper HTTP status codes
   - Record important events in MongoDB Analytics model

3. **Component Development**:
   - Use Radix UI primitives from `components/ui/`
   - Implement i18n via `lib/i18n/messages.ts` lookups
   - Add analytics tracking via `use-analytics` hook for important interactions
   - Follow existing patterns in `components/landing/` for new sections

4. **Authentication**:
   - Client components: `createBrowserSupabaseClient()`
   - Server components: `createServerSupabaseClient()`
   - Admin operations: `createAdminSupabaseClient()`
   - Always check user session in protected API routes
   - Role verification happens in middleware for route-level protection

5. **Styling**:
   - Tailwind CSS v4 (uses `@tailwindcss/postcss`)
   - Theme system via `next-themes`
   - Global styles in `app/globals.css`
   - Follow existing utility patterns

### Testing Strategy

No formal test suite currently. Testing happens via:
- GitHub Actions workflows (lint, build, type-check)
- Manual testing in development
- Database connectivity checks in CI
