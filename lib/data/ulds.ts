import type { Uld } from "./types";

// Source-of-truth ULD data for the DHL ULD Academy.
//
// Unit conversions:
//   inches      = cm / 2.54          (rounded to 1 decimal)
//   pounds      = kg * 2.20462       (rounded to integer)
//
// volumeM3 uses the published value where the brief supplies one. Where it does
// not, it is an ESTIMATE derived from the external box volume (L*W*H in metres)
// with a reduction for the typical contour/taper of the ULD. Each estimate is
// flagged inline with a // comment.

export const ulds: Uld[] = [
  {
    code: "AKE",
    iataName: "LD3",
    name: "LD3 Lower-Deck Container",
    dimensionsCm: { l: 153, w: 153, h: 163 },
    dimensionsIn: { l: 60.2, w: 60.2, h: 64.2 },
    maxGrossWeightKg: 1588,
    maxGrossWeightLbs: 3501,
    volumeM3: 4.53, // published
    contour: "lower-deck",
    compatibleAircraft: [
      "b747-8f",
      "b747-400f",
      "b777f",
      "b767-300f",
      "a300-600f",
      "a330-200f",
    ],
    useCase:
      "The most common lower-deck container in air cargo. Its contoured base fits the curved belly of widebody aircraft, making it the workhorse for belly-hold freight.",
    shape: "container",
    accentColor: "#D40511",
  },
  {
    code: "PMC",
    iataName: "—",
    name: 'Pallet 96"×125" (PMC)',
    dimensionsCm: { l: 317, w: 243, h: 163 },
    dimensionsIn: { l: 124.8, w: 95.7, h: 64.2 },
    maxGrossWeightKg: 11340,
    maxGrossWeightLbs: 25000,
    volumeM3: 11.56, // published
    contour: "main-deck",
    compatibleAircraft: [
      "b747-8f",
      "b747-400f",
      "b777f",
      "b767-300f",
      "b757-200f",
      "a300-600f",
      "a330-200f",
    ],
    useCase:
      "The workhorse main-deck pallet across the freighter fleet. Cargo is built up and secured with nets, giving maximum flexibility for irregular and oversized loads.",
    shape: "pallet",
    accentColor: "#FFCC00",
  },
  {
    code: "PGA",
    iataName: "—",
    name: 'Pallet 96"×125" Wide (PGA)',
    dimensionsCm: { l: 317, w: 243, h: 163 },
    dimensionsIn: { l: 124.8, w: 95.7, h: 64.2 },
    maxGrossWeightKg: 6804,
    maxGrossWeightLbs: 15000,
    volumeM3: 11.56, // estimate: same external footprint as PMC
    contour: "main-deck",
    compatibleAircraft: ["b747-8f"],
    useCase:
      "A wider main-deck pallet configured for the Boeing 747-8F. Used for high-volume, lower-density builds on the nose-loading main deck.",
    shape: "pallet",
    accentColor: "#6B7280",
  },
  {
    code: "DQF",
    iataName: "LD8",
    name: "LD8 Full-Width Lower-Deck Container",
    dimensionsCm: { l: 317, w: 153, h: 163 },
    dimensionsIn: { l: 124.8, w: 60.2, h: 64.2 },
    maxGrossWeightKg: 5035,
    maxGrossWeightLbs: 11100,
    volumeM3: 7.0, // estimate: ~317*153*163cm box less contour taper
    contour: "lower-deck",
    compatibleAircraft: ["b767-300f", "a300-600f"],
    useCase:
      "A full-width lower-deck container spanning the belly cross-section of the 767 and A300. Carries two LD3-footprints' worth of volume in a single unit.",
    shape: "container-full",
    accentColor: "#D40511",
  },
  {
    code: "AAP",
    iataName: "LD1",
    name: "LD1 Lower-Deck Container",
    dimensionsCm: { l: 200, w: 153, h: 163 },
    dimensionsIn: { l: 78.7, w: 60.2, h: 64.2 },
    maxGrossWeightKg: 1588,
    maxGrossWeightLbs: 3501,
    volumeM3: 4.4, // estimate: contoured LD1, ~200*153*163cm box less taper
    contour: "lower-deck",
    compatibleAircraft: [],
    useCase:
      "Reference-only in this academy: the LD1 is oriented to passenger widebody belly holds (notably the A380) and is not part of the primary DHL freighter fleet.",
    shape: "container",
    accentColor: "#6B7280",
  },
  {
    code: "AMF",
    iataName: "—",
    name: 'Pallet 96"×125" (AMF)',
    dimensionsCm: { l: 317, w: 244, h: 163 },
    dimensionsIn: { l: 124.8, w: 96.1, h: 64.2 },
    maxGrossWeightKg: 4626,
    maxGrossWeightLbs: 10199,
    volumeM3: 10.0, // estimate: ~317*244*163cm box less net/taper allowance
    contour: "main-deck",
    compatibleAircraft: ["b747-8f"],
    useCase:
      "A 96-inch main-deck pallet used on the Boeing 747-8F. Suited to lighter, high-cube builds where the lower weight limit is not a constraint.",
    shape: "pallet",
    accentColor: "#FFCC00",
  },
  {
    code: "AMP",
    iataName: "—",
    name: 'Pallet 88"×108" (AMP)',
    dimensionsCm: { l: 274, w: 218, h: 163 },
    dimensionsIn: { l: 107.9, w: 85.8, h: 64.2 },
    maxGrossWeightKg: 3175,
    maxGrossWeightLbs: 7001,
    volumeM3: 8.6, // estimate: ~274*218*163cm box less taper
    contour: "main-deck",
    compatibleAircraft: ["b757-200f"],
    useCase:
      "A smaller-footprint main-deck pallet oriented to the narrowbody Boeing 757-200F, whose main deck cannot accept full 125-inch pallets.",
    shape: "pallet",
    accentColor: "#6B7280",
  },
  {
    code: "RKN",
    iataName: "—",
    name: "RKN Refrigerated Container",
    dimensionsCm: { l: 153, w: 153, h: 163 },
    dimensionsIn: { l: 60.2, w: 60.2, h: 64.2 },
    maxGrossWeightKg: 1500,
    maxGrossWeightLbs: 3307,
    volumeM3: 4.0, // published (usable volume is reduced by the refrigeration unit)
    contour: "lower-deck",
    compatibleAircraft: [
      "b747-8f",
      "b747-400f",
      "b777f",
      "b767-300f",
      "a300-600f",
      "a330-200f",
    ],
    useCase:
      "A temperature-controlled (reefer) container sharing the AKE footprint. Provides active refrigeration for pharmaceuticals, perishables and other cold-chain freight.",
    shape: "reefer",
    accentColor: "#D40511",
  },
  {
    code: "AKH",
    iataName: "LD3-45",
    name: "LD3-45 Tall Lower-Deck Container",
    dimensionsCm: { l: 153, w: 153, h: 203 },
    dimensionsIn: { l: 60.2, w: 60.2, h: 79.9 },
    maxGrossWeightKg: 1588,
    maxGrossWeightLbs: 3501,
    volumeM3: 5.6, // estimate: AKE volume scaled by extra height (203/163)
    contour: "lower-deck",
    compatibleAircraft: ["b747-8f", "b777f"],
    useCase:
      "A taller variant of the LD3, gaining extra cube for high-volume freight in aircraft whose lower-deck height envelope can accept the additional height.",
    shape: "container-tall",
    accentColor: "#D40511",
  },
  {
    code: "PKC",
    iataName: "—",
    name: 'Pallet 88"×125" Contoured (PKC)',
    dimensionsCm: { l: 317, w: 243, h: 163 },
    dimensionsIn: { l: 124.8, w: 95.7, h: 64.2 },
    maxGrossWeightKg: 10000, // estimate: contoured to the fuselage; assumed similar to PMC class
    maxGrossWeightLbs: 22046,
    volumeM3: 11.0, // estimate: PMC-class footprint, slightly reduced by fuselage contour
    contour: "main-deck",
    compatibleAircraft: ["b747-8f", "b747-400f", "b767-300f"],
    useCase:
      "A main-deck pallet whose build-up is contoured to follow the upper fuselage curve, recovering side-wall volume that a square build would waste.",
    shape: "contoured",
    accentColor: "#FFCC00",
  },
];
