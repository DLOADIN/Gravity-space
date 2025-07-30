import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api-client';
import { API_ENDPOINTS } from '../config/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'artist';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'user' | 'artist') => Promise<void>;
  signout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const signin = async (email: string, password: string) => {
    try {
      const data = await api.post<{ message: string; role: 'user' | 'artist'; name: string; id: number }>(API_ENDPOINTS.auth.signin, {
        email,
        password
      });
      const user: User = { 
        id: data.id, 
        name: data.name, 
        email, 
        role: data.role 
      };
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      navigate(data.role === 'artist' ? '/artist-dashboard' : '/collector-dashboard');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string, role: 'user' | 'artist') => {
    try {
      await api.post<{ message: string }>(API_ENDPOINTS.auth.signup, {
        name,
        email,
        password,
        role
      });
      // After signup, redirect to sign in
      navigate('/signin');
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signout = async () => {
    try {
      // Call logout endpoint to clear server session
      await api.post(API_ENDPOINTS.auth.logout, {});
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      navigate('/signin');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signin, signup, signout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 