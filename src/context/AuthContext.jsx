import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api.js";
import { authService } from "../services/authService.js";

const AuthContext = createContext(null);
const STORAGE_KEY = import.meta.env.VITE_AUTH_STORAGE_KEY || "lms-auth";
const TOKEN_STORAGE_KEY = import.meta.env.VITE_TOKEN_STORAGE_KEY || "lms-token";

const readStoredState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }

    return { token: localStorage.getItem(TOKEN_STORAGE_KEY), user: null };
  } catch {
    return { token: localStorage.getItem(TOKEN_STORAGE_KEY), user: null };
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readStoredState().token);
  const [user, setUser] = useState(() => readStoredState().user);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (token && user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, [token, user]);

  useEffect(() => {
    api.setToken(token);
  }, [token]);

  useEffect(() => {
    api.onUnauthorized(() => {
      setToken(null);
      setUser(null);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setReady(true);
        return;
      }

      try {
        const data = await authService.me();
        setUser(data.user);
      } catch (_error) {
        setToken(null);
        setUser(null);
      } finally {
        setReady(true);
      }
    };

    bootstrap();
  }, [token]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      api.setToken(data.token); // Synchronously update the API client headers
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const refreshMe = async () => {
    if (!token) return null;
    const data = await authService.me();
    setUser(data.user);
    return data.user;
  };

  const value = { token, user, loading, ready, login, logout, refreshMe };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
