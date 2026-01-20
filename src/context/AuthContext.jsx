/**
 * Authentication Context for managing user state
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '@/services';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
        // Verify token is still valid
        AuthService.getMe()
          .then((response) => {
            if (response.success) {
              setUser(response.data.user);
              localStorage.setItem('user', JSON.stringify(response.data.user));
            }
          })
          .catch(() => {
            // Token invalid, logout
            logout();
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    try {
      const response = await AuthService.login({ email, password });
      if (response.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await AuthService.signup(userData);
      if (response.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const refreshAuth = async () => {
    try {
      const response = await AuthService.getMe();
      if (response.success) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      logout();
      return { success: false };
    }
  };

  // Check if user is admin
  const isAdmin = user?.role === 'admin' || user?.role === 'Admin';

  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    signup,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

