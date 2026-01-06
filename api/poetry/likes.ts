const { Redis } = require('@upstash/redis');

// Vercel serverless function types
interface VercelRequest {
  method?: string;
  query: Record<string, string | string[] | undefined>;
  body?: any;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (data: any) => void;
  setHeader: (name: string, value: string) => void;
  end: () => void;
}

// Initialize Redis client (supports both Upstash Redis and Vercel KV)
// Vercel KV uses KV_REST_API_URL and KV_REST_API_TOKEN
// Upstash Redis uses UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';

let redis: any = null;

if (redisUrl && redisToken) {
  try {
    redis = new Redis({
      url: redisUrl,
      token: redisToken,
    });
  } catch (error) {
    console.error('Failed to initialize Redis client:', error);
  }
} else {
  console.error('Redis configuration missing!');
  console.error('KV_REST_API_URL:', redisUrl ? 'Set' : 'Missing');
  console.error('KV_REST_API_TOKEN:', redisToken ? 'Set' : 'Missing');
}

const LIKES_KEY = 'poetry:likes';

// Read likes from Redis
const readLikes = async (): Promise<Record<number, number>> => {
  if (!redis) {
    throw new Error('Redis client not initialized');
  }
  try {
    const data = await redis.get(LIKES_KEY);
    return (data as Record<number, number>) || {};
  } catch (error) {
    console.error('Error reading likes from Redis:', error);
    throw error;
  }
};

module.exports = async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET' || req.method === 'get') {
    try {
      // Check if Redis is configured
      if (!redis) {
        console.error('Redis not initialized');
        return res.status(500).json({ 
          error: 'Redis not configured',
          message: 'KV_REST_API_URL and KV_REST_API_TOKEN must be set in Vercel environment variables',
          redisUrl: redisUrl ? 'Set (length: ' + redisUrl.length + ')' : 'Missing',
          redisToken: redisToken ? 'Set (length: ' + redisToken.length + ')' : 'Missing',
          envCheck: {
            KV_REST_API_URL: !!process.env.KV_REST_API_URL,
            KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
            UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
            UPSTASH_REDIS_REST_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN
          }
        });
      }
      console.log('Fetching likes from Redis...');
      const likes = await readLikes();
      console.log('Likes fetched:', likes);
      res.status(200).json(likes);
    } catch (error) {
      console.error('Error fetching likes:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorDetails = error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      } : {};
      res.status(500).json({ 
        error: 'Failed to fetch likes',
        details: errorMessage,
        ...errorDetails
      });
    }
  } else {
    console.error('Method not allowed:', req.method);
    res.status(405).json({ 
      error: 'Method not allowed',
      received: req.method,
      allowed: ['GET']
    });
  }
}

