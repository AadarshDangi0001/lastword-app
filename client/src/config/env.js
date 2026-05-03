const fallbackApiUrl = 'http://localhost:5000/api';

export const API_URL = process.env.EXPO_PUBLIC_API_URL || fallbackApiUrl;
