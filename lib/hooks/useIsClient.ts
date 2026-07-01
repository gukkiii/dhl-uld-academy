"use client";

import { useSyncExternalStore } from "react";

// A subscribe that never fires — client-ness never changes after mount.
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Returns `false` during SSR and the first (hydration) client render, then
 * `true` thereafter. Built on `useSyncExternalStore` so it never calls
 * `setState` inside an effect and never causes a hydration mismatch. Use it to
 * gate rendering of client-only / non-deterministic UI (e.g. randomised decks
 * or localStorage-derived state).
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
