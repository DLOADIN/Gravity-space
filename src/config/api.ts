export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  auth: {
    signin: '/login',
    signup: '/signup',
  },
  dashboard: {
    stats: '/dashboard/stats',
  },
  categories: '/categories',
  artists: '/artists',
  artworks: '/artworks',
  transactions: '/api/transactions',
  checkout: '/api/checkout',
} as const; 