import { create } from 'zustand';
import api from '../lib/api';

const storedToken = sessionStorage.getItem('cityapr_token');
let storedOperator = null;
try {
  const raw = sessionStorage.getItem('cityapr_operator');
  if (raw) storedOperator = JSON.parse(raw);
} catch (e) {
  storedOperator = null;
}

export const useAuthStore = create((set) => ({
  token: storedToken,
  operator: storedOperator,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,

  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/api/auth/login', { username, password });
      const { access_token, operator } = response.data;
      
      sessionStorage.setItem('cityapr_token', access_token);
      sessionStorage.setItem('cityapr_operator', JSON.stringify(operator));
      
      set({
        token: access_token,
        operator,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      return true;
    } catch (err) {
      // Smart Hackathon Demo Fallback: Allow login if default credentials are used even if backend is offline
      if (username === 'admin' && password === 'admin123') {
        const demoOperator = {
          id: 1,
          username: 'admin',
          display_name: 'Chief Controller (Demo / Offline Mode)'
        };
        const demoToken = 'demo-jwt-token-sih2026-cityapr';
        sessionStorage.setItem('cityapr_token', demoToken);
        sessionStorage.setItem('cityapr_operator', JSON.stringify(demoOperator));
        set({
          token: demoToken,
          operator: demoOperator,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
        return true;
      }

      const message = err.response?.data?.detail || 'Authentication failed. Please check credentials or start backend API.';
      set({ error: message, loading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (e) {
      // Ignore logout errors
    } finally {
      sessionStorage.removeItem('cityapr_token');
      sessionStorage.removeItem('cityapr_operator');
      set({
        token: null,
        operator: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
