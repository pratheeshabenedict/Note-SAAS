import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken'));

  // Set token in api headers and localStorage
  const setToken = useCallback((token) => {
    setAccessToken(token);
    if (token) {
      localStorage.setItem('accessToken', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('accessToken');
      delete api.defaults.headers.common['Authorization'];
    }
  }, []);

  // Fetch current user
  const fetchUser = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setToken]);

  useEffect(() => {
    if (accessToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [accessToken, fetchUser]);

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    setToken(data.accessToken);
    setUser(data.user);
    return data;
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setToken(data.accessToken);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, accessToken, register, login, logout, updateUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};