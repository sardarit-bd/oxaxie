const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined. Check your .env files.');
}

export const apiUrl = (endpoint) => {
  const base = API_BASE_URL.replace(/\/$/, '');
  const path = endpoint.replace(/^\//, '');
  return `${base}/${path}`;
};

export async function apiFetch(endpoint, options = {}) {
  const url = apiUrl(endpoint);

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = { message: 'Something went wrong. Please try again.' };
  }

  if (!response.ok) {
    const message = data.message || 'An error occurred';

    const errors = data.errors || null;

    const error = new Error(message);
    error.status = response.status;
    error.errors = errors; 
    throw error;
  }

  return data;
}