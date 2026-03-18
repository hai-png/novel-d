#!/bin/bash

# Plesk Git deployment script
# This script runs automatically after git pull in Plesk

echo " Starting deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Build the project
echo "🔨 Building project..."
npm run build

echo "✅ Deployment complete!"
