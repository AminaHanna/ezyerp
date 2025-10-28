import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: () => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook for making API calls with loading and error states
 * @param apiFunction - The API function to call
 * @param onSuccess - Optional callback on success
 * @param onError - Optional callback on error
 * @returns Object with data, isLoading, error, execute, and reset
 */
export const useApi = <T,>(
  apiFunction: () => Promise<T>,
  onSuccess?: (data: T) => void,
  onError?: (error: string) => void
): UseApiReturn<T> => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const { logout } = useAuth();

  const execute = useCallback(async () => {
    setState({ data: null, isLoading: true, error: null });

    try {
      const result = await apiFunction();
      setState({ data: result, isLoading: false, error: null });
      onSuccess?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";

      // Check if it's an authentication error
      if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
        logout();
      }

      setState({ data: null, isLoading: false, error: errorMessage });
      onError?.(errorMessage);
    }
  }, [apiFunction, onSuccess, onError, logout]);

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};

