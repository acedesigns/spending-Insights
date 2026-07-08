/* =======================================================
 *
 * Created by anele on 01/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */

import { useCallback, useEffect, useState } from 'react'
import { fetchSpendingSnapshot, type SpendingSnapshot } from '../services/spendingService'

interface UseSpendingDataResult {
  data: SpendingSnapshot | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}


/**
 * Loads the customer's spending snapshot once on mount and exposes a
 * `retry` handle for the error state to re-trigger the fetch.
 *
 * @returns Object with the loaded `data` (or null), `isLoading` and `error`
 * state, and a `retry` callback to re-run the fetch.
 */
export function useSpendingData(): UseSpendingDataResult {
  const [data, setData] = useState<SpendingSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchSpendingSnapshot()
      .then((snapshot) => {
        if (cancelled) return;
        setData(snapshot);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Something went wrong.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setAttempt((n) => n + 1);
  }, []);

  return { data, isLoading, error, retry };
}
