export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  auth: {
    signin: '/login',
    signup: '/signup',
  },
  artworks: '/api/artworks',
  categories: '/api/categories',
  artists: '/api/artists',
  transactions: '/api/transactions',
  checkout: '/api/checkout',
} as const; 