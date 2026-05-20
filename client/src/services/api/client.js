import { API_URL } from '../../config/env';
import { getItem } from '../../lib/storage';
import { STORAGE_KEYS } from '../../constants/app';

async function request(path, options = {}) {
  const token = await getItem(STORAGE_KEYS.authToken);
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export const apiClient = {
  get: (path, options = {}) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options = {}) =>
    request(path, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    }),
  del: (path, options = {}) => request(path, { ...options, method: 'DELETE' }),
};
