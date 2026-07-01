// DHL ULD Academy — static data layer type contract.
// The UI is being built against this contract. Do NOT rename fields.

export type ContourType = "lower-deck" | "main-deck" | "pallet";

export type UldShape =
  | "container"
  | "container-tall"
  | "pallet"
  | "reefer"
  | "contoured"
  | "container-full";

export type CompatLevel = "full" | "partial" | "none";

export interface Uld {
  /** ULD type code, e.g. "AKE". */
  code: string;
  /** IATA designation, e.g. "LD3". Use "—" when none applies. */
  iataName: string;
  /** Human-friendly short name. */
  name: string;
  /** External dimensions in centimetres. */
  dimensionsCm: { l: number; w: number; h: number };
  /** External dimensions in inches (converted, rounded to 1 decimal). */
  dimensionsIn: { l: number; w: number; h: number };
  /** Maximum gross weight in kilograms. */
  maxGrossWeightKg: number;
  /** Maximum gross weight in pounds (converted, rounded to integer). */
  maxGrossWeightLbs: number;
  /** Best-known internal volume in cubic metres (estimated where source omits). */
  volumeM3: number;
  contour: ContourType;
  /** Array of Aircraft.id values this ULD is carried on. */
  compatibleAircraft: string[];
  /** 1-2 sentence description of the typical use case. */
  useCase: string;
  /** Drives SVG illustration selection. */
  shape: UldShape;
  /** Accent hex colour: "#D40511" red, "#FFCC00" yellow, or "#6B7280" grey. */
  accentColor: string;
}

export interface DeckPosition {
  uldType: string;
  count: number;
}

export interface Aircraft {
  /** Kebab-case id, e.g. "b747-8f". */
  id: string;
  /** Short code, e.g. "747-8F". */
  code: string;
  /** Full name, e.g. "Boeing 747-8F". */
  name: string;
  manufacturer: "Boeing" | "Airbus";
  maxPayloadKg: number;
  /** Maximum payload in pounds (converted, rounded to integer). */
  maxPayloadLbs: number;
  rangeKm: number;
  /** Range in nautical miles (converted, rounded to integer). */
  rangeNm: number;
  mainDeck: DeckPosition[];
  lowerDeck: DeckPosition[];
  /** Array of Uld.code values this aircraft can carry. */
  compatibleUlds: string[];
  bodyType: "wide" | "narrow";
}

export interface CompatCell {
  aircraftId: string;
  uldCode: string;
  level: CompatLevel;
  note?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  /** Exactly 4 options. */
  options: string[];
  correctIndex: number;
  /** Shown after the user answers. */
  explanation: string;
  category: "specs" | "compatibility" | "aircraft" | "standards";
}

export interface StandardSection {
  id: string;
  title: string;
  /** A lucide-react icon NAME, e.g. "Scale", "AlertTriangle", "Tag", "Ruler". */
  icon: string;
  points: string[];
}
