# Deployment Instructions for dobeu.cloud

## Current Status
- ✅ Next.js project initialized with TypeScript and all dependencies
- ✅ Git repository initialized with remote set to GitHub
- ✅ Netlify configuration files created
- ⚠️ GitHub push requires SAML SSO authentication
- 🔄 Netlify deployment ready to be configured

## Step 1: Push to GitHub

Since your organization has SAML SSO enabled, you need to:

1. **Authenticate with GitHub** using one of these methods:
   
   a) **Using GitHub Personal Access Token (PAT)**:
   ```bash
   # Create a PAT at: https://github.com/settings/tokens
   # Select scopes: repo, workflow
   
   # Set the remote URL with your PAT
   git remote set-url origin https://YOUR_GITHUB_USERNAME:YOUR_PAT@github.com/Dobeu-Tech-Solutions/dobeucloud.git
   
   # Push to GitHub
   git push -u origin master
   ```
   
   b) **Using GitHub CLI**:
   ```bash
   # Install GitHub CLI if not installed
   # Download from: https://cli.github.com/
   
   # Login with SSO
   gh auth login --with-token
   
   # Push using gh
   gh repo clone Dobeu-Tech-Solutions/dobeucloud --clone=false
   git push -u origin master
   ```

   c) **Using SSH**:
   ```bash
   # Add SSH key to GitHub account
   # Generate if needed: ssh-keygen -t ed25519 -C "your_email@example.com"
   
   # Change remote to SSH
   git remote set-url origin git@github.com:Dobeu-Tech-Solutions/dobeucloud.git
   
   # Push
   git push -u origin master
   ```

## Step 2: Deploy to Netlify

### Option A: Via Netlify Dashboard (Recommended)

1. **Log in to Netlify** at https://app.netlify.com/

2. **Import from GitHub**:
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub"
   - Authorize Netlify to access your GitHub organization
   - Select `Dobeu-Tech-Solutions/dobeucloud` repository

3. **Configure build settings**:
   - **Branch to deploy**: `master`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - Click "Show advanced" → "New variable"

4. **Add environment variables** (from `env.config.md`):
   ```
   MONGODB_URI=mongodb+srv://jeremyw_db_user:4l7pQxun7GnBnSUc@cluster0.pqf8x5.mongodb.net/dobeucloud?retryWrites=true&w=majority
   NEXT_PUBLIC_INTERCOM_APP_ID=xu0gfiqb
   NEXT_PUBLIC_APOLLO_APP_ID=68faee78c5da6c000d9ae0de
   NEXT_PUBLIC_SITE_URL=https://dobeu.cloud
   ```
   
   Add other variables as you get the credentials:
   - Supabase keys
   - PayPal/Square credentials
   - Google Analytics ID
   - etc.

5. **Deploy site**:
   - Click "Deploy site"
   - Wait for build to complete

### Option B: Via Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Create and link site**:
   ```bash
   netlify init
   # Choose "Create & configure a new site"
   # Site name: dobeucloud
   # Team: Your team name
   ```

4. **Set environment variables**:
   ```bash
   netlify env:set MONGODB_URI "mongodb+srv://jeremyw_db_user:4l7pQxun7GnBnSUc@cluster0.pqf8x5.mongodb.net/dobeucloud?retryWrites=true&w=majority"
   netlify env:set NEXT_PUBLIC_INTERCOM_APP_ID "xu0gfiqb"
   netlify env:set NEXT_PUBLIC_APOLLO_APP_ID "68faee78c5da6c000d9ae0de"
   netlify env:set NEXT_PUBLIC_SITE_URL "https://dobeu.cloud"
   ```

5. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

## Step 3: Configure Custom Domain

1. **In Netlify Dashboard**:
   - Go to "Domain settings"
   - Click "Add custom domain"
   - Enter `dobeu.cloud`
   - Click "Verify"

2. **Update DNS Records**:
   - Add the following records to your domain registrar:
   
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   
   Type: CNAME
   Name: www
   Value: [your-netlify-subdomain].netlify.app
   ```
   
   OR use Netlify DNS (recommended):
   - Click "Add domain to Netlify DNS"
   - Update nameservers at your registrar to Netlify's

3. **Enable HTTPS**:
   - Once DNS propagates (5-30 minutes)
   - Netlify will automatically provision SSL certificate

## Step 4: Verify Deployment

1. **Check deployment status**: 
   - Visit Netlify dashboard → Your site → Deploys

2. **Test the site**:
   - Temporary URL: `https://[your-site-name].netlify.app`
   - Custom domain: `https://dobeu.cloud` (after DNS propagation)

3. **Monitor build logs** for any errors

## Troubleshooting

### Build Fails
- Check environment variables are set correctly
- Review build logs in Netlify dashboard
- Ensure all dependencies are in package.json

### Domain Not Working
- DNS propagation can take up to 48 hours
- Verify DNS records with: `nslookup dobeu.cloud`
- Check SSL certificate status in Netlify dashboard

### GitHub Push Issues
- Ensure you have proper permissions in the organization
- Try using a Personal Access Token with full repo scope
- Contact your GitHub organization admin for SAML SSO access

## Next Steps

After successful deployment:
1. Complete MongoDB setup (already configured with connection string)
2. Create Supabase project and add credentials
3. Configure payment processors (PayPal/Square)
4. Add Google Analytics tracking
5. Continue with remaining implementation tasks
