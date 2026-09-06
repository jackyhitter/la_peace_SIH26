import { useEffect, useRef, useState } from 'react';

export function usePolling(fetchFn, interval = 15000, enabled = true) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const savedFetchFn = useRef(fetchFn);

  useEffect(() => {
    savedFetchFn.current = fetchFn;
  }, [fetchFn]);

  useEffect(() => {
    if (!enabled) return;

    let isMounted = true;

    const execute = async () => {
      try {
        setLoading(true);
        await savedFetchFn.current();
        if (isMounted) setError(null);
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Execute immediately on mount or when enabled changes
    execute();

    // Set up repeating interval
    const timerId = setInterval(execute, interval);

    return () => {
      isMounted = false;
      clearInterval(timerId);
    };
  }, [interval, enabled]);

  return { loading, error };
}
