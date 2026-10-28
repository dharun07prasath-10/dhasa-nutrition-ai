import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch of profile (or demo user auto-authenticated)
    api.getProfile()
      .then(userData => {
        setUser(userData);
      })
      .catch(err => {
        console.warn('Initial profile load notice:', err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (username, password) => {
    const data = await api.login({ username, password });
    localStorage.setItem('ai_fitness_token', data.access_token);
    setUser(data.user);
    return data;
  };

  const register = async (formData) => {
    const data = await api.register(formData);
    localStorage.setItem('ai_fitness_token', data.access_token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('ai_fitness_token');
    // Refresh page or revert to default demo user
    api.getProfile().then(setUser).catch(() => setUser(null));
  };

  const updateUser = (newUserData) => {
    setUser(newUserData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

