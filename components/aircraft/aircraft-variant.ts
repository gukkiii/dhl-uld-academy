import type { AircraftVariant } from "@/components/aircraft/AircraftSilhouette";

/** Map an Aircraft.id (with freighter suffix) to a silhouette variant. */
const ID_TO_VARIANT: Record<string, AircraftVariant> = {
  "b747-8f": "b747",
  "b747-400f": "b747",
  "b777f": "b777",
  "b767-300f": "b767",
  "b757-200f": "b757",
  "a300-600f": "a300",
  "a330-200f": "a330",
};

export function variantForAircraftId(id: string): AircraftVariant {
  return ID_TO_VARIANT[id] ?? "b777";
}
