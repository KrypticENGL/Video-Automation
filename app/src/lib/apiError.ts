/** Every failed API call throws this. `message` is always safe to show the user. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const networkError = () =>
  new ApiError(
    0,
    'network',
    "Can't reach the server. Check your internet connection and try again.",
  );

const fallback: Record<number, string> = {
  401: 'Please log in again.',
  429: 'Too many attempts. Try again in a few minutes.',
};

/** Maps an error response to an ApiError. Server shape: { error: { code, message } }. */
export function toApiError(status: number, body: unknown): ApiError {
  const error = (body as { error?: { code?: unknown; message?: unknown } } | null)?.error;
  const code = typeof error?.code === 'string' ? error.code : 'unknown';
  // 5xx and validation messages are for developers, not the client: use friendly copy instead.
  const showServerMessage =
    typeof error?.message === 'string' && status < 500 && code !== 'invalid_input';
  const message = showServerMessage
    ? (error.message as string)
    : (fallback[status] ?? 'Something went wrong. Please try again.');
  return new ApiError(status, code, message);
}
