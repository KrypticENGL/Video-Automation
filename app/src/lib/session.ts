// The JWT lives in expo-secure-store (Android Keystore). https://docs.expo.dev/versions/latest/sdk/securestore/
import * as SecureStore from 'expo-secure-store';
import { useSyncExternalStore } from 'react';
import { queryClient } from './queryClient';

const KEY = 'session_token';

type Session = { loaded: boolean; token: string | null };
let state: Session = { loaded: false, token: null };
const listeners = new Set<() => void>();

function set(next: Session) {
  state = next;
  listeners.forEach((l) => l());
}

export const getToken = () => state.token;

/** Call once at startup. */
export async function loadSession() {
  // SecureStore is unavailable on web (dev-only self-check): treat as logged out.
  const token = await SecureStore.getItemAsync(KEY).catch(() => null);
  set({ loaded: true, token });
}

export async function signIn(token: string) {
  set({ loaded: true, token });
  await SecureStore.setItemAsync(KEY, token).catch(() => {});
}

export async function signOut() {
  set({ loaded: true, token: null });
  queryClient.clear(); // drop the previous user's cached data
  await SecureStore.deleteItemAsync(KEY).catch(() => {});
}

export function useSession(): Session {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
  );
}
