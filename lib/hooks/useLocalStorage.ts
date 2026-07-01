"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import { useIsClient } from "./useIsClient";

// Fired on same-tab writes so other hook instances re-read synchronously.
// (The native `storage` event only fires in *other* tabs.)
const LOCAL_EVENT = "uld-academy:local-storage";

/**
 * SSR-safe typed localStorage state hook built on `useSyncExternalStore`.
 *
 * - During SSR and the first client render it returns `initial`, so server and
 *   client markup match (no hydration warning).
 * - The persisted value is read from `localStorage` via the store snapshot and
 *   kept referentially stable through an internal cache, so consumers don't
 *   re-render unless the stored JSON actually changes.
 * - Writes are JSON-encoded, resilient to quota / private-mode errors, and
 *   broadcast to other hook instances in the same tab and to other tabs.
 *
 * The third tuple element, `hydrated`, flips to `true` after mount so consumers
 * can avoid flashing a first-time/empty state before storage has been read.
 *
 * @param key      Stable storage key. Changing it re-reads from storage.
 * @param initial  Fallback value; pass a stable reference (e.g. a module-level
 *                 constant) so snapshots stay referentially stable.
 */
export function useLocalStorage<T>(
  key: string,
  initial: T,
): readonly [T, (value: T | ((prev: T) => T)) => void, boolean] {
  // Cache keeps the parsed value referentially stable between snapshots.
  const cache = useRef<{ raw: string | null; value: T }>({
    raw: null,
    value: initial,
  });

  const subscribe = useCallback(
    (onChange: () => void) => {
      const handler = (e: Event) => {
        if (e instanceof StorageEvent) {
          if (e.key === null || e.key === key) onChange();
          return;
        }
        if (e instanceof CustomEvent && e.detail === key) onChange();
      };
      window.addEventListener("storage", handler);
      window.addEventListener(LOCAL_EVENT, handler as EventListener);
      return () => {
        window.removeEventListener("storage", handler);
        window.removeEventListener(LOCAL_EVENT, handler as EventListener);
      };
    },
    [key],
  );

  const getSnapshot = useCallback((): T => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === cache.current.raw) return cache.current.value;
      cache.current = {
        raw,
        value: raw === null ? initial : (JSON.parse(raw) as T),
      };
      return cache.current.value;
    } catch {
      return cache.current.value;
    }
  }, [key, initial]);

  const getServerSnapshot = useCallback((): T => initial, [initial]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useIsClient();

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      // Read the freshest persisted value so functional updates compose
      // correctly even across separate hook instances.
      let prev: T;
      try {
        const raw = window.localStorage.getItem(key);
        prev = raw === null ? initial : (JSON.parse(raw) as T);
      } catch {
        prev = cache.current.value;
      }
      const resolved =
        typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        // Ignore quota / private-mode write failures.
      }
      window.dispatchEvent(new CustomEvent(LOCAL_EVENT, { detail: key }));
    },
    [key, initial],
  );

  return [value, set, hydrated] as const;
}
