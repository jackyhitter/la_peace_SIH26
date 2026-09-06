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
      const message = err.response?.data?.detail || 'Authentication failed. Please check credentials.';
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
