import Constants from 'expo-constants';
import { networkError, toApiError } from './apiError';
import { getToken, signOut } from './session';

const TIMEOUT_MS = 15_000;
const DEV_API_PORT = 4000;

// Production: `extra.apiUrl` in app config. Development: the PC running Metro also runs the API,
// so reuse its LAN address (hostUri is "192.168.x.x:8081") and the phone needs no setup.
function baseUrl(): string {
  const configured = Constants.expoConfig?.extra?.apiUrl as string | undefined;
  if (configured) return configured.replace(/\/$/, '');
  // A release build must never fall back to a dev address or send the password over plain http.
  if (!__DEV__) throw new Error('Set extra.apiUrl in app.json to the https API address.');
  const host = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';
  return `http://${host}:${DEV_API_PORT}`;
}

export const API_URL = baseUrl();

// Response shapes, mirroring SPEC.md §4.
export type LoginResponse = { token: string };
export type Me = { id: string; email: string };

type Options = { method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'; body?: unknown };

/** JSON request with the session JWT. Throws ApiError with a user-facing message. */
export async function api<T>(path: string, { method = 'GET', body }: Options = {}): Promise<T> {
  const token = getToken();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res: Response;
  let json: unknown;
  try {
    res = await fetch(API_URL + path, {
      method,
      signal: controller.signal,
      headers: {
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    // Read the body inside the timeout too; a non-JSON body (e.g. a proxy error page) becomes null.
    json = await res.text().then((text) => {
      try {
        return JSON.parse(text) as unknown;
      } catch {
        return null;
      }
    });
  } catch {
    throw networkError();
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    // An expired or revoked token: drop it, which sends the user to Login. The token check stops a
    // slow 401 from an old session signing out a new one.
    if (res.status === 401 && token && getToken() === token) void signOut();
    throw toApiError(res.status, json);
  }
  return json as T;
}

export const login = (email: string, password: string) =>
  api<LoginResponse>('/auth/login', { method: 'POST', body: { email, password } });

export const getMe = () => api<Me>('/me');
