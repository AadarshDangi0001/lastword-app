import { apiClient } from './client';

export function loginUser({ email, password }) {
  return apiClient.post('/auth/login', { email, password });
}

export function signupUser({ name, email, password }) {
  return apiClient.post('/auth/signup', { name, email, password });
}

export function logoutUser({ refreshToken } = {}) {
  return apiClient.post('/auth/logout', { refreshToken });
}

export function fetchMe() {
  return apiClient.get('/auth/me');
}
