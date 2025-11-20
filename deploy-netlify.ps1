# Netlify deployment script for Windows
# Usage: .\deploy-netlify.ps1

Write-Host "Deploying to Netlify..." -ForegroundColor Green

# Check if Netlify CLI is installed
try {
    netlify --version | Out-Null
}
catch {
    Write-Host "Installing Netlify CLI..." -ForegroundColor Yellow
    npm install -g netlify-cli
}

# Set Netlify auth token
$env:NETLIFY_AUTH_TOKEN = "nfp_L3GkfX5enG8XiWGyELjcR6wve1BP6hgX9e6d"

# Build the project
Write-Host "Building project..." -ForegroundColor Yellow
npm run build

# Create new site if not exists
Write-Host "Creating Netlify site..." -ForegroundColor Yellow
try {
    netlify sites:create --name dobeucloud --account-slug dobeu-tech-solutions
}
catch {
    Write-Host "Site may already exist, continuing..." -ForegroundColor Yellow
}

# Link to existing site
Write-Host "Linking to Netlify site..." -ForegroundColor Yellow
netlify link --name dobeucloud

# Deploy to production
Write-Host "Deploying to production..." -ForegroundColor Yellow
netlify deploy --prod --dir=.next

# Set up custom domain
Write-Host "Adding custom domain..." -ForegroundColor Yellow
netlify domains:add dobeu.cloud

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Visit https://dobeu.cloud once DNS propagates" -ForegroundColor Cyan
