import { API_BASE_URL } from '@/config/api'

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  headers?: Record<string, string>
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options

  // Ensure endpoint starts with '/'
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const url = `${API_BASE_URL}${normalizedEndpoint}`

  // Get JWT token from localStorage
  const token = localStorage.getItem('token')
  
  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  }

  // Add Authorization header if token exists
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include', // Include cookies for session-based auth as fallback
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }))
    throw new Error(error.message || 'An error occurred')
  }

  return response.json()
}

export const api = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    apiClient<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T>(endpoint: string, body: any, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    apiClient<T>(endpoint, { ...options, method: 'POST', body }),
  
  put: <T>(endpoint: string, body: any, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    apiClient<T>(endpoint, { ...options, method: 'PUT', body }),
  
  delete: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    apiClient<T>(endpoint, { ...options, method: 'DELETE' }),
} 