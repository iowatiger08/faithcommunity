import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const BLOGGER_API_URL = 'https://www.googleapis.com/blogger/v3/blogs';
const SECRET_ARN = 'arn:aws:secretsmanager:us-west-2:166782860262:secret:prod/blogger-3y8Pt2';
const BLOG_ID = '8000554665921912318';

const secretsClient = new SecretsManagerClient({ region: 'us-west-2' });

const ALLOWED_ORIGINS = new Set([
  'https://hopeandtruthministry.com',
  'https://www.hopeandtruthministry.com',
  'https://tigersndragons.com',
  'https://www.tigersndragons.com',
  'http://localhost:4321', // Astro dev
  'http://localhost:5173', // Vite dev
  'http://localhost:4173', // Vite preview
  'http://localhost:3000', // Next.js / generic
]);

function buildCorsHeaders(event) {
  const requestOrigin =
    event?.headers?.origin || event?.headers?.Origin || '';
  const allowed = ALLOWED_ORIGINS.has(requestOrigin) ? requestOrigin : '';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Vary': 'Origin',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Content-Type': 'application/json',
  };
}

/**
 * Lambda handler to proxy Blogger API requests
 * Retrieves API key from AWS Secrets Manager and fetches recent blog posts
 */
export const handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  const headers = buildCorsHeaders(event);

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS' || event.requestContext?.http?.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Retrieve the Blogger API key from Secrets Manager
    console.log('Fetching secret from Secrets Manager...');
    const secretResponse = await secretsClient.send(
      new GetSecretValueCommand({
        SecretId: SECRET_ARN,
        VersionStage: 'AWSCURRENT'
      })
    );

    let apiKey;
    if (secretResponse.SecretString) {
      try {
        // Try to parse as JSON first
        const secret = JSON.parse(secretResponse.SecretString);
        apiKey = secret.api_key || secret.key || secret.apiKey;
      } catch {
        // If not JSON, use as plain text
        apiKey = secretResponse.SecretString;
      }
    }

    if (!apiKey) {
      throw new Error('API key not found in secret');
    }

    // Fetch recent posts from Blogger API
    console.log('Fetching posts from Blogger API...');
    const bloggerUrl = `${BLOGGER_API_URL}/${BLOG_ID}/posts?key=${apiKey}&maxResults=5&orderBy=published`;

    const response = await fetch(bloggerUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Blogger API error:', response.status, errorText);
      throw new Error(`Blogger API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log(`Successfully fetched ${data.items?.length || 0} posts`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch blogger posts',
        message: error.message
      })
    };
  }
};
