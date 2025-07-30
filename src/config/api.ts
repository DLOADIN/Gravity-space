export const API_BASE_URL = 'http://localhost:5000';

export const API_ENDPOINTS = {
  auth: {
    signin: '/login',
    signup: '/signup',
    logout: '/logout'
  },
  dashboard: {
    stats: '/dashboard/stats',
    artistStats: '/dashboard/artist-stats'
  },
  categories: '/categories',
  artists: '/artists',
  artworks: '/artworks',
  transactions: '/transactions',
  marketplace: '/marketplace',
  portfolio: '/portfolio'
}; 