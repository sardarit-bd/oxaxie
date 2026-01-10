const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    'NEXT_PUBLIC_API_BASE_URL is not defined. Check your .env files.'
  );
}

/**
 * Build external API URL
 */
export const apiUrl = (endpoint) => {
  const base = API_BASE_URL.replace(/\/$/, '');
  const path = endpoint.replace(/^\//, '');
  return `${base}/${path}`;
};

/**
 * Unified fetch helper
 *
 * Rules:
 * 1. If endpoint starts with `/api/` → call Next.js API (proxy)
 * 2. Otherwise → call external API
 * 3. Cookies are automatically included (for auth)
 */
export async function apiFetch(endpoint, options = {}) {
  const isInternalApi = endpoint.startsWith('/api/');

  const url = isInternalApi ? endpoint : apiUrl(endpoint);

  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
    ...options,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = { message: 'Something went wrong. Please try again.' };
  }

  if (!response.ok) {
    const error = new Error(data.message || 'An error occurred');
    error.status = response.status;
    error.errors = data.errors || null;
    throw error;
  }

  return data;
}
