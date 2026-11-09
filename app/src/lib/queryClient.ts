import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './apiError';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      // Retrying can't fix a 4xx (bad token, bad input); retry network and server errors twice.
      retry: (failures, error) =>
        failures < 2 && !(error instanceof ApiError && error.status >= 400 && error.status < 500),
    },
  },
});
