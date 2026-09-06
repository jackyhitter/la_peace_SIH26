import { useEffect } from 'react';
import { useAlertStore } from '../store/alertStore';
import { usePolling } from './usePolling';

export function useAlerts(pollInterval = 15000) {
  const alerts = useAlertStore((state) => state.alerts);
  const activeCount = useAlertStore((state) => state.activeCount);
  const recentReads = useAlertStore((state) => state.recentReads);
  const loading = useAlertStore((state) => state.loading);
  const error = useAlertStore((state) => state.error);
  const fetchAlerts = useAlertStore((state) => state.fetchAlerts);
  const fetchRecentReads = useAlertStore((state) => state.fetchRecentReads);
  const resolveAlert = useAlertStore((state) => state.resolveAlert);

  // Poll alerts and recent reads every 15s
  usePolling(fetchAlerts, pollInterval);
  usePolling(fetchRecentReads, pollInterval);

  return {
    alerts,
    activeCount,
    recentReads,
    loading,
    error,
    fetchAlerts,
    fetchRecentReads,
    resolveAlert,
  };
}
