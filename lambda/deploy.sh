#!/bin/bash

# Deployment script for Blogger Lambda Proxy
# This script packages and deploys the Lambda function

set -e

echo "=== Blogger Lambda Deployment Script ==="
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed."
    echo "Please see INSTALL.md for installation instructions."
    exit 1
fi

# Check if SAM CLI is installed
if ! command -v sam &> /dev/null; then
    echo "⚠️  SAM CLI is not installed."
    echo "You can:"
    echo "  1. Install SAM CLI: brew install aws-sam-cli"
    echo "  2. Or follow manual deployment steps in INSTALL.md"
    exit 1
fi

echo "✓ AWS CLI and SAM CLI are installed"
echo ""

# Navigate to blogger-proxy directory
cd blogger-proxy

# Install dependencies
echo "📦 Installing dependencies..."
npm install

cd ..

# Build SAM application
echo "🔨 Building SAM application..."
sam build

# Deploy
echo "🚀 Deploying to AWS..."
echo ""
echo "Note: On first deployment, you'll be prompted for configuration."
echo "Recommended answers:"
echo "  - Stack Name: blogger-proxy-stack"
echo "  - AWS Region: us-west-2"
echo "  - Confirm changes: Y"
echo "  - Allow IAM role creation: Y"
echo "  - Disable rollback: N"
echo "  - Save config: Y"
echo ""

sam deploy --guided

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Copy the 'BloggerApiUrl' from the output above"
echo "  2. Update src/environments/environment.prod.ts with this URL"
echo "  3. Rebuild your Angular app: npm run build"
echo "  4. Deploy to S3"
