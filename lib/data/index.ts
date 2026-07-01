// Barrel for the DHL ULD Academy static data layer.

import type { Aircraft, Uld } from "./types";
import { aircraft } from "./aircraft";
import { ulds } from "./ulds";
import { quizQuestions } from "./quiz";

// Re-export the full contract and datasets.
export * from "./types";
export { ulds } from "./ulds";
export { aircraft } from "./aircraft";
export {
  buildCompatibilityMatrix,
  compatibilityMatrix,
  getCompatLevel,
} from "./compatibility";
export { quizQuestions } from "./quiz";
export { standards } from "./standards";

// --- Convenience lookups ---------------------------------------------------

/** Find a ULD by its type code (e.g. "AKE"). */
export function getUldByCode(code: string): Uld | undefined {
  return ulds.find((u) => u.code === code);
}

/** Find an aircraft by its id (e.g. "b747-8f"). */
export function getAircraftById(id: string): Aircraft | undefined {
  return aircraft.find((a) => a.id === id);
}

/** All ULDs an aircraft can carry, resolved from its compatibleUlds list. */
export function uldsForAircraft(aircraftId: string): Uld[] {
  const ac = getAircraftById(aircraftId);
  if (!ac) return [];
  return ulds.filter((u) => ac.compatibleUlds.includes(u.code));
}

/** All aircraft that can carry a given ULD, resolved from its code. */
export function aircraftForUld(uldCode: string): Aircraft[] {
  return aircraft.filter((a) => a.compatibleUlds.includes(uldCode));
}

// --- Stat counts -----------------------------------------------------------

export const uldCount: number = ulds.length;
export const aircraftCount: number = aircraft.length;
export const quizCount: number = quizQuestions.length;
