import { Redis } from '@upstash/redis';

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
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

const LIKES_KEY = 'poetry:likes';

// Read likes from Redis
const readLikes = async (): Promise<Record<number, number>> => {
  try {
    const data = await redis.get<Record<number, number>>(LIKES_KEY);
    return data || {};
  } catch (error) {
    console.error('Error reading likes from Redis:', error);
    return {};
  }
};

// Write likes to Redis
const writeLikes = async (likes: Record<number, number>) => {
  try {
    await redis.set(LIKES_KEY, likes);
  } catch (error) {
    console.error('Error writing likes to Redis:', error);
    throw error;
  }
};

export default async function handler(
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

  const { poemId } = req.query;
  const poemIndex = parseInt(poemId as string, 10);

  if (isNaN(poemIndex)) {
    res.status(400).json({ error: 'Invalid poem ID' });
    return;
  }

  try {
    const likes = await readLikes();
    const currentCount = likes[poemIndex] || 0;

    if (req.method === 'POST') {
      // Increment like count
      likes[poemIndex] = currentCount + 1;
      await writeLikes(likes);
      res.status(200).json({ poemId: poemIndex, count: likes[poemIndex] });
    } else if (req.method === 'DELETE') {
      // Decrement like count (minimum 0)
      likes[poemIndex] = Math.max(0, currentCount - 1);
      await writeLikes(likes);
      res.status(200).json({ poemId: poemIndex, count: likes[poemIndex] });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error updating likes:', error);
    res.status(500).json({ error: 'Failed to update likes' });
  }
}

