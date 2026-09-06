import { create } from 'zustand';
import api from '../lib/api';

export const useAlertStore = create((set, get) => ({
  alerts: [],
  activeCount: 0,
  recentReads: [],
  loading: false,
  error: null,
  lastFetched: null,

  fetchAlerts: async () => {
    try {
      const response = await api.get('/api/alerts', { params: { status: 'active', limit: 20 } });
      const items = response.data.items || [];
      set({
        alerts: items,
        activeCount: items.length,
        lastFetched: new Date(),
        error: null,
      });
    } catch (err) {
      set({ error: 'Failed to fetch alerts' });
    }
  },

  fetchRecentReads: async () => {
    try {
      const response = await api.get('/api/plates/logs', { params: { limit: 5 } });
      set({ recentReads: response.data.items || [] });
    } catch (err) {
      // Silently fail polling
    }
  },

  resolveAlert: async (alertId) => {
    const previousAlerts = get().alerts;
    // Optimistic UI update: filter out immediately
    const updatedAlerts = previousAlerts.filter((a) => a.id !== alertId);
    set({
      alerts: updatedAlerts,
      activeCount: updatedAlerts.length,
    });

    try {
      await api.patch(`/api/alerts/${alertId}/resolve`);
    } catch (err) {
      // Revert if error occurs
      set({
        alerts: previousAlerts,
        activeCount: previousAlerts.length,
        error: 'Failed to resolve alert on server.',
      });
    }
  },
}));
