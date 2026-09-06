import { useState } from 'react';
import api from '../lib/api';

export function usePlateSearch() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (plateNumber) => {
    if (!plateNumber || !plateNumber.trim()) return;
    setLoading(true);
    setError(null);

    const cleanPlate = plateNumber.trim().toUpperCase();

    try {
      // Parallel fetch to plate search and RTO lookup
      const [searchRes, rtoRes] = await Promise.allSettled([
        api.get('/api/plates/search', { params: { plate: cleanPlate } }),
        api.get('/api/rto/lookup', { params: { plate: cleanPlate } }),
      ]);

      const searchData = searchRes.status === 'fulfilled' ? searchRes.value.data : null;
      const rtoData = rtoRes.status === 'fulfilled' ? rtoRes.value.data : null;

      setResult({
        plate_number: cleanPlate,
        events: searchData?.events || [],
        rto: rtoData || searchData?.rto || null,
        blacklist_entry: searchData?.blacklist_entry || null,
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Plate search failed');
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setResult(null);
    setError(null);
  };

  return {
    result,
    loading,
    error,
    search,
    clear,
  };
}
