import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import type { Pengguna } from '../types';

type AuthState = {
  pengguna: Pengguna | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthCtx = createContext<AuthState | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pengguna, setPengguna] = useState<Pengguna | null>(() => {
    const raw = localStorage.getItem('pengguna');
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    setToken(data.token);
    setPengguna(data.pengguna);
    localStorage.setItem('token', data.token);
    localStorage.setItem('pengguna', JSON.stringify(data.pengguna));
  };

  const logout = () => {
    setToken(null);
    setPengguna(null);
    localStorage.removeItem('token');
    localStorage.removeItem('pengguna');
  };

  useEffect(() => {
    // noop, token disuntik di interceptor
  }, [token]);

  const value = useMemo(() => ({ pengguna, token, login, logout }), [pengguna, token]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
