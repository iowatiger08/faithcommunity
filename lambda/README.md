# Blogger API Proxy Lambda

This Lambda function securely proxies requests to the Blogger API using an API key stored in AWS Secrets Manager.

## Architecture

```
Angular App (S3) → API Gateway → Lambda → AWS Secrets Manager → Blogger API
```

## Prerequisites

1. **AWS CLI** - Install from https://aws.amazon.com/cli/
2. **AWS SAM CLI** - Install from https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html
3. **Node.js 18+** - For Lambda runtime

## Secret Configuration

Your secret is already configured at:
- **ARN**: `arn:aws:secretsmanager:us-west-2:166782860262:secret:prod/blogger-3y8Pt2`
- **Name**: `prod/blogger`

The secret should contain your Blogger API key in one of these formats:

### Option 1: JSON format (recommended)
```json
{
  "api_key": "your-blogger-api-key-here"
}
```

### Option 2: Plain text
```
your-blogger-api-key-here
```

## Deployment Steps

### 1. Install Lambda Dependencies

```bash
cd lambda/blogger-proxy
npm install
cd ..
```

### 2. Build the SAM Application

```bash
sam build
```

### 3. Deploy to AWS

First-time deployment (will prompt for configuration):
```bash
sam deploy --guided
```

Follow the prompts:
- **Stack Name**: `blogger-proxy-stack`
- **AWS Region**: `us-west-2`
- **Confirm changes before deploy**: `Y`
- **Allow SAM CLI IAM role creation**: `Y`
- **Disable rollback**: `N`
- **Save arguments to configuration file**: `Y`

Subsequent deployments:
```bash
sam deploy
```

### 4. Get the API Gateway URL

After deployment, SAM will output the API Gateway URL:
```
Outputs
---------------------------------------------------------------------------
Key                 BloggerApiUrl
Description         API Gateway endpoint URL for Blogger proxy
Value               https://xxxxxxxxxx.execute-api.us-west-2.amazonaws.com/prod/blogger/posts
```

### 5. Update Angular Environment

Copy the API Gateway URL from the output and update:

**src/environments/environment.prod.ts**:
```typescript
export const environment = {
  production: true,
  bloggerApiUrl: 'https://YOUR_ACTUAL_API_URL_HERE/prod/blogger/posts'
};
```

### 6. Rebuild and Deploy Angular App

```bash
npm run build
# Then deploy the dist folder to your S3 bucket
```

## Testing the Lambda Function

### Test via API Gateway URL
```bash
curl https://YOUR_API_GATEWAY_URL/prod/blogger/posts
```

### Test Lambda Locally (Optional)

Start local API:
```bash
sam local start-api
```

Then test:
```bash
curl http://localhost:3000/blogger/posts
```

## Security Considerations

### Update CORS Settings for Production

In `lambda/blogger-proxy/index.mjs`, update the CORS origin:
```javascript
const headers = {
  'Access-Control-Allow-Origin': 'https://your-cloudfront-domain.cloudfront.net',
  // or 'https://your-s3-bucket.s3-website-us-west-2.amazonaws.com'
  ...
};
```

Also update in `lambda/template.yaml`:
```yaml
Cors:
  AllowOrigin: "'https://your-cloudfront-domain.cloudfront.net'"
```

### IAM Permissions

The Lambda function has been granted permission to:
- Read the specific secret: `arn:aws:secretsmanager:us-west-2:166782860262:secret:prod/blogger-3y8Pt2`

## Monitoring and Logs

View Lambda logs:
```bash
sam logs -n BloggerProxyFunction --stack-name blogger-proxy-stack --tail
```

Or via AWS Console:
- CloudWatch Logs → Log Groups → `/aws/lambda/blogger-proxy-stack-BloggerProxyFunction-*`

## Troubleshooting

### Lambda returns 500 error
- Check CloudWatch Logs for the Lambda function
- Verify the secret exists and contains valid API key
- Ensure Lambda has permissions to access Secrets Manager

### CORS errors in browser
- Verify CORS headers in `index.mjs`
- Update `AllowOrigin` to match your domain
- Redeploy after changes: `sam build && sam deploy`

### Blogger API returns 403
- Verify the API key in Secrets Manager is correct
- Check if the API key has Blogger API v3 enabled in Google Cloud Console

## Cost Estimation

- **Lambda**: ~$0.20 per 1 million requests (within free tier limits)
- **API Gateway**: ~$3.50 per 1 million requests
- **Secrets Manager**: ~$0.40 per month per secret + $0.05 per 10,000 API calls

For a small church website, this should cost less than $1/month.

## Cleanup

To remove all AWS resources:
```bash
sam delete --stack-name blogger-proxy-stack
```
