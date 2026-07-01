import type { CompatCell, CompatLevel } from "./types";
import { aircraft } from "./aircraft";
import { ulds } from "./ulds";

// Domain-sensible "partial" overrides keyed by `${aircraftId}:${uldCode}`.
//
// A "partial" means: the aircraft can physically carry the ULD, but only in a
// subset of positions or under a restriction, so it should not be presented as
// a clean "anywhere" fit. These are layered on top of the base full/none logic
// derived from each aircraft's compatibleUlds list.
const PARTIAL_OVERRIDES: Record<string, string> = {
  // AKH (LD3-45) is taller than a standard LD3 and only fits the extra-height
  // lower-deck positions, not every belly bay.
  "b747-8f:AKH": "Fits only the extra-height (LD3-45) lower-deck positions.",
  "b777f:AKH": "Fits only the extra-height (LD3-45) lower-deck positions.",
  // DQF (LD8) is full-width and only loads into the specific lower-deck bays
  // sized for a full-width container.
  "b767-300f:DQF": "Loads only in full-width lower-deck bays.",
  "a300-600f:DQF": "Loads only in full-width lower-deck bays.",
  // PKC is contoured to the fuselage, so its build-up must match the position's
  // contour template; it is not interchangeable with square PMC positions.
  "b767-300f:PKC": "Requires a fuselage-contoured build matching the position template.",
};

function partialKey(aircraftId: string, uldCode: string): string {
  return `${aircraftId}:${uldCode}`;
}

/**
 * Build the full aircraft × ULD compatibility matrix.
 *
 * Level rules:
 *  - "full"    when the ULD code is in the aircraft's compatibleUlds list
 *  - "partial" when a domain override applies (carried, but position-restricted)
 *  - "none"    otherwise
 */
export function buildCompatibilityMatrix(): CompatCell[] {
  const cells: CompatCell[] = [];

  for (const ac of aircraft) {
    for (const uld of ulds) {
      const isCompatible = ac.compatibleUlds.includes(uld.code);
      const overrideNote = PARTIAL_OVERRIDES[partialKey(ac.id, uld.code)];

      let level: CompatLevel;
      let note: string | undefined;

      if (isCompatible && overrideNote) {
        level = "partial";
        note = overrideNote;
      } else if (isCompatible) {
        level = "full";
      } else {
        level = "none";
      }

      cells.push({
        aircraftId: ac.id,
        uldCode: uld.code,
        level,
        ...(note ? { note } : {}),
      });
    }
  }

  return cells;
}

/** Memoized matrix — built once on module load. */
export const compatibilityMatrix: CompatCell[] = buildCompatibilityMatrix();

/** Look up the compatibility level for a single aircraft × ULD pair. */
export function getCompatLevel(
  aircraftId: string,
  uldCode: string,
): CompatLevel {
  const cell = compatibilityMatrix.find(
    (c) => c.aircraftId === aircraftId && c.uldCode === uldCode,
  );
  return cell ? cell.level : "none";
}
