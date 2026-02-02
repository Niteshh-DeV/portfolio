// Use relative path for API calls - Vercel will route /api/* to serverless functions
const API_BASE_URL = '/api';

export interface PoetryLikes {
  [poemId: string]: number;
}

/**
 * Fetch all poem like counts from the backend
 */
export async function fetchLikes(): Promise<PoetryLikes> {
  try {
    const response = await fetch(`${API_BASE_URL}/poetry/likes`);
    if (!response.ok) {
      throw new Error('Failed to fetch likes');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching likes:', error);
    return {};
  }
}

/**
 * Increment like count for a specific poem
 */
export async function incrementLike(poemId: string): Promise<number> {
  try {
    const response = await fetch(`${API_BASE_URL}/poetry/likes/${poemId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', response.status, errorData);
      throw new Error(errorData.error || `Failed to increment like: ${response.status}`);
    }
    const data = await response.json();
    return data.count;
  } catch (error) {
    console.error('Error incrementing like:', error);
    throw error;
  }
}

/**
 * Decrement like count for a specific poem
 */
export async function decrementLike(poemId: string): Promise<number> {
  try {
    const response = await fetch(`${API_BASE_URL}/poetry/likes/${poemId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', response.status, errorData);
      throw new Error(errorData.error || `Failed to decrement like: ${response.status}`);
    }
    const data = await response.json();
    return data.count;
  } catch (error) {
    console.error('Error decrementing like:', error);
    throw error;
  }
}

/**
 * Migrate/merge likes (used to move index-based keys to stable IDs)
 */
export async function migrateLikes(
  likes: Record<string, number>,
  removeKeys: string[] = []
): Promise<PoetryLikes> {
  try {
    const response = await fetch(`${API_BASE_URL}/poetry/likes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ likes, removeKeys }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', response.status, errorData);
      throw new Error(errorData.error || `Failed to migrate likes: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error migrating likes:', error);
    throw error;
  }
}

