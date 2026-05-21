# Installation and Deployment Guide

You have two options for deploying the Lambda function:

## Option 1: Install AWS SAM CLI (Recommended)

AWS SAM CLI makes deploying Lambda functions much easier.

### Install via Homebrew (macOS):
```bash
brew install aws-sam-cli
```

### Or download the installer:
1. Visit: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html
2. Download the macOS installer
3. Run the .pkg file

### Verify installation:
```bash
sam --version
```

Then follow the deployment steps in `README.md`.

---

## Option 2: Manual Deployment via AWS Console

If you prefer not to install SAM CLI, you can deploy manually:

### Step 1: Prepare the Lambda Package

```bash
cd lambda/blogger-proxy
npm install
zip -r ../function.zip .
cd ..
```

### Step 2: Deploy via AWS Console

1. **Create the Lambda Function**:
   - Go to AWS Console → Lambda → Create function
   - Choose "Author from scratch"
   - Function name: `blogger-proxy`
   - Runtime: Node.js 18.x
   - Architecture: x86_64
   - Click "Create function"

2. **Upload the Code**:
   - In the function page, click "Upload from" → ".zip file"
   - Upload `lambda/function.zip`
   - Click "Save"

3. **Configure Environment** (if needed):
   - No environment variables needed (using hardcoded values)

4. **Add Secrets Manager Permissions**:
   - Go to Configuration → Permissions
   - Click on the role name (opens IAM)
   - Click "Add permissions" → "Attach policies"
   - Click "Create policy"
   - Use JSON:
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Action": "secretsmanager:GetSecretValue",
           "Resource": "arn:aws:secretsmanager:us-west-2:166782860262:secret:prod/blogger-3y8Pt2"
         }
       ]
     }
     ```
   - Name it: `BloggerSecretReadPolicy`
   - Attach it to the Lambda role

5. **Test the Function**:
   - In Lambda console, click "Test"
   - Create new test event with this JSON:
     ```json
     {
       "httpMethod": "GET",
       "headers": {},
       "body": null
     }
     ```
   - Click "Test" and verify it returns Blogger posts

6. **Create API Gateway**:
   - Go to API Gateway → Create API
   - Choose "HTTP API" → Build
   - Add integration → Lambda
   - Select your `blogger-proxy` function
   - API name: `blogger-api`
   - Click "Next" → "Next" → "Create"

7. **Configure CORS**:
   - In API Gateway, go to CORS settings
   - Add: `*` (or your specific domain)
   - Methods: GET, OPTIONS
   - Headers: `Content-Type, X-Amz-Date, Authorization, X-Api-Key`

8. **Get your API URL**:
   - Go to Stages → $default
   - Copy the "Invoke URL"
   - Your endpoint will be: `https://YOUR_ID.execute-api.us-west-2.amazonaws.com/blogger/posts`

9. **Add /blogger/posts route**:
   - Go to Routes → Create
   - Method: GET
   - Path: `/blogger/posts`
   - Integration: Select your Lambda function
   - Create route

10. **Update Angular Environment**:
    - Update `src/environments/environment.prod.ts`:
      ```typescript
      export const environment = {
        production: true,
        bloggerApiUrl: 'https://YOUR_ACTUAL_API_ID.execute-api.us-west-2.amazonaws.com/blogger/posts'
      };
      ```

---

## Option 3: Install AWS CLI Only (Alternative)

You can also install just AWS CLI and use CloudFormation:

### Install AWS CLI via Homebrew:
```bash
brew install awscli
```

### Or use the installer you already downloaded:
The file `AWSCLIV2.pkg` in your project root can be installed by double-clicking it.

### After installation, configure AWS CLI:
```bash
aws configure
```

Enter your:
- AWS Access Key ID
- AWS Secret Access Key
- Default region: `us-west-2`
- Default output format: `json`

Then I can provide you with CloudFormation deployment commands.

---

## Recommended Approach

For easiest deployment: **Install SAM CLI via Homebrew** (Option 1), then follow `README.md`.

For no installation: **Manual Console Deployment** (Option 2).
