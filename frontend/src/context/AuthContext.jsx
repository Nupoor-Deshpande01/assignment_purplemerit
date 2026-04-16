import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, logout as apiLogout, getMe, register as apiRegister } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await getMe();
        if (response.success && response.data?.user) {
          setUser(response.data.user);
        } else {
          setUser(null);
          setAccessToken(null);
          localStorage.removeItem('accessToken');
        }
      } catch (error) {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem('accessToken');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await apiLogin(credentials);
      if (response.success && response.data) {
        setAccessToken(response.data.accessToken);
        localStorage.setItem('accessToken', response.data.accessToken);
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      return { success: false, message: error.message || 'Login error' };
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('accessToken');
    }
  };

  const register = async (data) => {
    try {
        const response = await apiRegister(data);
        if(response.success && response.data) {
            setAccessToken(response.data.accessToken);
            localStorage.setItem('accessToken', response.data.accessToken);
            setUser(response.data.user);
            return { success: true };
        }
        return { success: false, message: response.message || 'Registration failed'};
    } catch (error) {
        return { success: false, message: error.message || 'Registration error' }
    }
  }

  const updateProfile = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
