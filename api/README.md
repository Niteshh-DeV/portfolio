# Poetry Likes API

This directory contains Vercel serverless functions for managing poetry likes.

## API Endpoints

### GET `/api/poetry/likes`
Returns all poem like counts.

**Response:**
```json
{
  "0": 5,
  "1": 12,
  "2": 3,
  ...
}
```

### POST `/api/poetry/likes/:poemId`
Increments the like count for a specific poem.

**Response:**
```json
{
  "poemId": 0,
  "count": 6
}
```

### DELETE `/api/poetry/likes/:poemId`
Decrements the like count for a specific poem (minimum 0).

**Response:**
```json
{
  "poemId": 0,
  "count": 4
}
```

## Local Development

For local development, use Vercel CLI:

```bash
npm install -g vercel
vercel dev
```

This will start both the frontend and API serverless functions locally.

## Data Storage

- **Production**: Data is stored persistently in **Vercel KV** (Redis)
- Uses environment variables: `KV_REST_API_URL` and `KV_REST_API_TOKEN`
- Likes persist across deployments and are shared across all users

