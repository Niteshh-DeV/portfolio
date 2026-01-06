// Use relative path for API calls - Vercel will route /api/* to serverless functions
const API_BASE_URL = '/api';

export interface PoetryLikes {
  [poemId: number]: number;
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
export async function incrementLike(poemId: number): Promise<number> {
  try {
    const response = await fetch(`${API_BASE_URL}/poetry/likes/${poemId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to increment like');
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
export async function decrementLike(poemId: number): Promise<number> {
  try {
    const response = await fetch(`${API_BASE_URL}/poetry/likes/${poemId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to decrement like');
    }
    const data = await response.json();
    return data.count;
  } catch (error) {
    console.error('Error decrementing like:', error);
    throw error;
  }
}

