#!/bin/bash

# Netlify deployment script
# Usage: ./deploy-netlify.sh

echo "Deploying to Netlify..."

# Install Netlify CLI if not already installed
if ! command -v netlify &> /dev/null; then
    echo "Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Set Netlify auth token
export NETLIFY_AUTH_TOKEN="nfp_L3GkfX5enG8XiWGyELjcR6wve1BP6hgX9e6d"

# Build the project
npm run build

# Create new site if not exists
netlify sites:create --name dobeucloud --account-slug dobeu-tech-solutions || echo "Site may already exist"

# Link to existing site
netlify link --name dobeucloud

# Deploy to production
netlify deploy --prod --dir=.next

# Set up custom domain
netlify domains:add dobeu.cloud

echo "Deployment complete!"
echo "Visit https://dobeu.cloud once DNS propagates"
