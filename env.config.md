# Environment Configuration

## Required Environment Variables for Netlify

Copy these environment variables to your Netlify dashboard under Site Settings > Environment Variables:

### MongoDB Connection
```
MONGODB_URI=mongodb+srv://jeremyw_db_user:4l7pQxun7GnBnSUc@cluster0.pqf8x5.mongodb.net/dobeucloud?retryWrites=true&w=majority
```

### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Email Configuration (Resend via Supabase Edge Functions)
```
RESEND_API_KEY=your_resend_api_key
```

### Payment Processing
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET=your_paypal_secret
NEXT_PUBLIC_SQUARE_APPLICATION_ID=your_square_application_id
NEXT_PUBLIC_SQUARE_LOCATION_ID=your_square_location_id
SQUARE_ACCESS_TOKEN=your_square_access_token
```

### Third-Party Integrations
```
NEXT_PUBLIC_INTERCOM_APP_ID=xu0gfiqb
NEXT_PUBLIC_APOLLO_APP_ID=68faee78c5da6c000d9ae0de
```

### Google Analytics
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_measurement_id
```

### Twilio (Phase 2)
```
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### Site Configuration
```
NEXT_PUBLIC_SITE_URL=https://dobeu.cloud
```

## Note
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- All other variables are server-side only
- Update placeholder values with actual credentials before deployment
