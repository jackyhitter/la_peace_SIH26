import { useEffect } from 'react';
import { useCameraStore } from '../store/cameraStore';
import { usePolling } from './usePolling';

export function useCameras() {
  const cameras = useCameraStore((state) => state.cameras);
  const summary = useCameraStore((state) => state.summary);
  const selectedCamera = useCameraStore((state) => state.selectedCamera);
  const fetchCameras = useCameraStore((state) => state.fetchCameras);
  const fetchSummary = useCameraStore((state) => state.fetchSummary);
  const setSelectedCamera = useCameraStore((state) => state.setSelectedCamera);

  useEffect(() => {
    fetchCameras();
  }, [fetchCameras]);

  // Poll camera summary counts every 30 seconds
  usePolling(fetchSummary, 30000);

  return {
    cameras,
    summary,
    selectedCamera,
    setSelectedCamera,
    fetchCameras,
    fetchSummary,
  };
}
