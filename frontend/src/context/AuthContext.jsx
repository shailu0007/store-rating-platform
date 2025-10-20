
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../config/axiosInstance';
import authApi from '../api/authApi';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
  }, []);

  const saveUserAndToken = (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    if (token) localStorage.setItem('token', token);
    setCurrentUser(user);
  };

  const clearUser = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const login = async ({ email, password }) => {
    const res = await authApi.login({ email, password });
    const user = res?.data?.user ?? res?.data ?? null;
    const token = res?.data?.token ?? null;
    if (user) saveUserAndToken(user, token);
    return res.data;
  };

  const signup = async ({ name, email, address, password }) => {
    const res = await authApi.register({ name, email, address, password });
    return res.data;
  };

  const logout = async ({ redirect = true, redirectTo = '/auth/login' } = {}) => {
    try {
      await authApi.logout().catch(() => {});
    } catch (e) {}
    clearUser();

    if (redirect) {
      window.location.assign(redirectTo);
    }
  };

  const changePassword = async ({ currentPassword, newPassword }) => {
    const res = await authApi.changePassword({ currentPassword, newPassword });
    if (res?.data?.user) {
      saveUserAndToken(res.data.user, res.data.token ?? localStorage.getItem('token'));
    }
    return res.data;
  };

  const refreshUser = async () => {
    try {
      const res = await authApi.me();
      if (res?.data?.user) {
        saveUserAndToken(res.data.user, res.data.token ?? localStorage.getItem('token'));
      }
      return res.data;
    } catch (e) {
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      setCurrentUser,
      login,
      signup,
      logout,
      changePassword,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
