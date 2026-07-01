import type { StandardSection } from "./types";

// Key points from the IATA ULD Regulations / ULD Technical Manual, distilled for
// the academy. Icons are valid lucide-react icon names.

export const standards: StandardSection[] = [
  {
    id: "weight-balance",
    title: "Weight & Balance Limits",
    icon: "Scale",
    points: [
      "Never exceed the ULD's marked Maximum Gross Weight (MGW) — it is stencilled on the unit and printed on the ULD tag.",
      "Distribute load evenly to respect maximum running-load and area-load limits of the aircraft floor.",
      "The combined tare plus cargo weight must keep the aircraft within its certified centre-of-gravity envelope.",
      "Heavy and dense items go low and centred; avoid concentrated point loads on container floors or pallet bases.",
    ],
  },
  {
    id: "damage-reporting",
    title: "Damage Reporting & Serviceability",
    icon: "AlertTriangle",
    points: [
      "Inspect every ULD before build-up against the serviceability limits in the IATA ULD Regulations (ULDR).",
      "A unit exceeding damage limits is Non-Serviceable and must be tagged and removed from service immediately.",
      "Report damage promptly so the ULD can be routed for repair by an approved facility, preserving traceability.",
      "Never load freight onto a ULD with cracked baseboards, torn nets, broken locks or out-of-limit dents.",
    ],
  },
  {
    id: "tagging",
    title: "ULD Tagging Standards",
    icon: "Tag",
    points: [
      "Every ULD carries an ULD Control Receipt / identification tag showing the ULD number, owner code and MGW.",
      "A serviceable unit shows a valid serviceability tag; a Non-Serviceable Container (NSC) carries a red tag.",
      "The ULD number follows the IATA format: a three-letter type code, serial number and two-letter owner code.",
      "Remove or update old routing and dangerous-goods labels so only current information is visible.",
    ],
  },
  {
    id: "buildup-contour",
    title: "Build-Up & Contour Rules",
    icon: "Ruler",
    points: [
      "Build cargo within the ULD's contour template so it fits the aircraft loading envelope and door profile.",
      "Keep cargo inside the pallet edges — no overhang that could foul rollers, locks or the fuselage.",
      "Stack to a stable, interlocked pattern; cap with lighter items and fill voids to prevent shifting.",
      "Respect maximum build height for the intended deck position (lower-deck vs main-deck differ).",
    ],
  },
  {
    id: "securing-netting",
    title: "Securing & Netting",
    icon: "Network",
    points: [
      "Restrain every pallet build with an approved net rated for the load and correctly hooked to all pallet rings.",
      "Tension nets evenly; straps and nets must contain the load against forward, aft, lateral and vertical g-forces.",
      "Close and latch container doors/curtains so contents cannot escape the contour in flight.",
      "Verify ULDs are locked into the aircraft's restraint system (latches/locks engaged) before departure.",
    ],
  },
  {
    id: "regulatory-ownership",
    title: "Regulatory Ownership & Accountability",
    icon: "ShieldCheck",
    points: [
      "The IATA ULD Regulations (ULDR) are the global standard governing ULD operation, build-up and handling.",
      "The operating carrier is accountable for airworthy loading; ground handlers must follow the carrier's procedures.",
      "ULDs are tracked assets — control receipts establish custody as a unit moves between handling parties.",
      "Dangerous-goods loads add IATA DGR requirements on top of standard ULD build-up and securing rules.",
    ],
  },
];
