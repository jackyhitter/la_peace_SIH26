import { create } from 'zustand';
import api from '../lib/api';
import { CAMERA_NODES } from '../lib/constants';

export const useCameraStore = create((set) => ({
  cameras: CAMERA_NODES,
  summary: { total: 46, active: 44, fault: 2, offline: 0 },
  selectedCamera: null,
  loading: false,
  error: null,

  fetchCameras: async () => {
    try {
      const response = await api.get('/api/cameras');
      if (response.data && response.data.length > 0) {
        set({ cameras: response.data });
      }
    } catch (err) {
      // Fallback to CAMERA_NODES constants
    }
  },

  fetchSummary: async () => {
    try {
      const response = await api.get('/api/cameras/summary');
      if (response.data) {
        set({ summary: response.data });
      }
    } catch (err) {
      // Keep existing summary
    }
  },

  setSelectedCamera: (camera) => set({ selectedCamera: camera }),
}));
