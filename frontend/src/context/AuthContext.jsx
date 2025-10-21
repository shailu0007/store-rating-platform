
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../config/axiosInstance';
import authApi from '../api/authApi';


const AuthContext = createContext();

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const readStoredToken = () => {
  try {
    return localStorage.getItem('token') || null;
  } catch {
    return null;
  }
};

// helper to accept either axios response or already-unwrapped data
const normalizeApiResponse = (res) => {
  if (!res) return null;
  return res && typeof res === 'object' && 'data' in res ? res.data : res;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(true); // start true until we've checked token

  // Set axios auth header and optionally refresh user on mount
  useEffect(() => {
    const init = async () => {
      const token = readStoredToken();
      if (token) {
        // if axiosInstance is a created instance, set default header on it
        axios.defaults.headers = axios.defaults.headers || {};
        axios.defaults.headers.Authorization = `Bearer ${token}`;

        // try to refresh / validate token & get user
        try {
          await refreshUser();
        } catch (e) {
          // ignore - refreshUser will clear user if invalid
        }
      }
      setLoading(false);
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveUserAndToken = (user, token) => {
    try {
      if (user) localStorage.setItem('user', JSON.stringify(user));
      if (token) {
        localStorage.setItem('token', token);
        axios.defaults.headers = axios.defaults.headers || {};
        axios.defaults.headers.Authorization = `Bearer ${token}`;
      }
      setCurrentUser(user);
    } catch (err) {
      console.error('saveUserAndToken error', err);
    }
  };

  const clearUser = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      if (axios?.defaults?.headers) delete axios.defaults.headers.Authorization;
      setCurrentUser(null);
    } catch (err) {
      console.error('clearUser error', err);
      setCurrentUser(null);
    }
  };

  const login = async ({ email, password }) => {
    const res = await authApi.login({ email, password });
    const data = normalizeApiResponse(res);
    const user = data?.user ?? null;
    const token = data?.token ?? null;
    if (user) saveUserAndToken(user, token);
    return data;
  };

  const signup = async ({ name, email, address, password }) => {
    const res = await authApi.register({ name, email, address, password });
    return normalizeApiResponse(res);
  };

  const logout = async ({ redirect = true, redirectTo = '/auth/login' } = {}) => {
    try {
      await authApi.logout().catch(() => {});
    } catch (e) {
      // ignore
    }
    clearUser();
    if (redirect) window.location.assign(redirectTo);
  };

  const changePassword = async ({ currentPassword, newPassword }) => {
    const res = await authApi.changePassword({ currentPassword, newPassword });
    const data = normalizeApiResponse(res);
    if (data?.user || data?.token) {
      const user = data.user ?? currentUser;
      const token = data.token ?? readStoredToken();
      saveUserAndToken(user, token);
    }
    return data;
  };

  const refreshUser = async () => {
    try {
      const res = await authApi.me();
      const data = normalizeApiResponse(res);
      if (data?.user) {
        saveUserAndToken(data.user, data.token ?? readStoredToken());
      }
      return data;
    } catch (e) {
      // token invalid or network error -> clear local auth
      clearUser();
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loading,
        login,
        signup,
        logout,
        changePassword,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;