import type { QuizQuestion } from "./types";

// Quiz bank for the DHL ULD Academy. At least 14 questions across all four
// categories so a 10-question quiz can sample without repetition. Every answer
// is derived strictly from ulds.ts, aircraft.ts, compatibility.ts and
// standards.ts.

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q-specs-ake-weight",
    question: "What is the maximum gross weight of an AKE (LD3) container?",
    options: ["1,134 kg", "1,588 kg", "5,035 kg", "11,340 kg"],
    correctIndex: 1,
    explanation:
      "The AKE (LD3) has a maximum gross weight of 1,588 kg, the standard rating for lower-deck LD3-family containers.",
    category: "specs",
  },
  {
    id: "q-specs-ake-iata",
    question: "Which IATA designation corresponds to the AKE container?",
    options: ["LD1", "LD3", "LD8", "LD3-45"],
    correctIndex: 1,
    explanation:
      "The AKE is the IATA LD3, the most common lower-deck container in air cargo.",
    category: "specs",
  },
  {
    id: "q-specs-pmc-weight",
    question: "What is the maximum gross weight of a PMC main-deck pallet?",
    options: ["6,804 kg", "10,000 kg", "11,340 kg", "5,035 kg"],
    correctIndex: 2,
    explanation:
      "The PMC pallet is rated to 11,340 kg (25,000 lb), making it the workhorse main-deck pallet across the freighter fleet.",
    category: "specs",
  },
  {
    id: "q-specs-volume",
    question: "Approximately what internal volume does an AKE (LD3) offer?",
    options: ["1.0 m³", "4.5 m³", "11.6 m³", "7.0 m³"],
    correctIndex: 1,
    explanation:
      "The AKE provides roughly 4.53 m³ of usable volume, contoured to fit the curved lower deck of widebody aircraft.",
    category: "specs",
  },
  {
    id: "q-specs-akh-tall",
    question: "How does the AKH (LD3-45) differ from a standard AKE (LD3)?",
    options: [
      "It is refrigerated",
      "It is taller, gaining extra volume",
      "It is full-width",
      "It is a main-deck pallet",
    ],
    correctIndex: 1,
    explanation:
      "The AKH (LD3-45) shares the LD3 footprint but is taller (203 cm vs 163 cm), adding cube for high-volume freight.",
    category: "specs",
  },
  {
    id: "q-compat-rkn-purpose",
    question: "What does the RKN container provide that an AKE does not?",
    options: [
      "A larger footprint",
      "Active temperature control (refrigeration)",
      "A higher weight limit",
      "Main-deck compatibility",
    ],
    correctIndex: 1,
    explanation:
      "The RKN is a temperature-controlled (reefer) container on the AKE footprint, used for pharmaceuticals, perishables and other cold-chain freight.",
    category: "compatibility",
  },
  {
    id: "q-compat-747-lowerdeck",
    question: "Which ULD fits the lower deck of a Boeing 747-8F?",
    options: ["PMC", "AKE", "AMP", "PGA"],
    correctIndex: 1,
    explanation:
      "The AKE (LD3) loads in the lower deck of the 747-8F (28 positions). PMC, PGA and AMF are main-deck pallets; AMP is for the narrowbody 757-200F.",
    category: "compatibility",
  },
  {
    id: "q-compat-pga-only",
    question: "Which aircraft is the only one carrying the PGA pallet?",
    options: [
      "Boeing 777F",
      "Boeing 747-8F",
      "Airbus A330-200F",
      "Boeing 767-300F",
    ],
    correctIndex: 1,
    explanation:
      "The PGA wide pallet is configured exclusively for the Boeing 747-8F in this fleet.",
    category: "compatibility",
  },
  {
    id: "q-compat-dqf",
    question:
      "The DQF (LD8) full-width container is compatible with which pair of aircraft?",
    options: [
      "747-8F and 777F",
      "767-300F and A300-600F",
      "757-200F and A330-200F",
      "747-400F and 777F",
    ],
    correctIndex: 1,
    explanation:
      "The full-width DQF (LD8) loads into the 767-300F and A300-600F, whose lower decks have full-width bays sized for it.",
    category: "compatibility",
  },
  {
    id: "q-compat-amp-narrow",
    question: "Which ULD is oriented to the narrowbody Boeing 757-200F?",
    options: ["PMC", "AMP", "AKE", "DQF"],
    correctIndex: 1,
    explanation:
      "The AMP (88\"×108\") is the smaller-footprint pallet for the 757-200F lower deck; the 757-200F main deck takes the PMC.",
    category: "compatibility",
  },
  {
    id: "q-aircraft-payload",
    question: "Which freighter has the highest maximum payload?",
    options: [
      "Boeing 777F",
      "Boeing 747-8F",
      "Airbus A330-200F",
      "Boeing 747-400F",
    ],
    correctIndex: 1,
    explanation:
      "The Boeing 747-8F leads the fleet with a maximum payload of about 134,200 kg.",
    category: "aircraft",
  },
  {
    id: "q-aircraft-airbus",
    question: "Which two aircraft in the fleet are built by Airbus?",
    options: [
      "747-8F and 777F",
      "A300-600F and A330-200F",
      "767-300F and 757-200F",
      "A330-200F and 777F",
    ],
    correctIndex: 1,
    explanation:
      "The A300-600F and A330-200F are the Airbus freighters; the rest of the fleet is Boeing.",
    category: "aircraft",
  },
  {
    id: "q-aircraft-narrowbody",
    question: "Which aircraft in the fleet is a narrowbody freighter?",
    options: [
      "Boeing 767-300F",
      "Boeing 757-200F",
      "Airbus A300-600F",
      "Boeing 777F",
    ],
    correctIndex: 1,
    explanation:
      "The Boeing 757-200F is the only narrowbody, which is why it relies on the smaller AMP pallet in its lower deck.",
    category: "aircraft",
  },
  {
    id: "q-aircraft-range",
    question: "Which freighter offers the longest range?",
    options: [
      "Boeing 747-8F",
      "Boeing 777F",
      "Airbus A300-600F",
      "Boeing 767-300F",
    ],
    correctIndex: 1,
    explanation:
      "The Boeing 777F has the longest range in the fleet at roughly 9,070 km (about 4,897 nm).",
    category: "aircraft",
  },
  {
    id: "q-standards-tagging",
    question:
      "Under IATA standards, what colour ULD tag indicates a unit is NOT serviceable for loading?",
    options: ["Green", "Blue", "Red", "Yellow"],
    correctIndex: 2,
    explanation:
      "A red NSC (Non-Serviceable Container/Unit) tag flags damage beyond limits; the ULD must be withdrawn from service until repaired.",
    category: "standards",
  },
  {
    id: "q-standards-securing",
    question:
      "Why is correct netting and securing of a built-up ULD critical to flight safety?",
    options: [
      "It speeds up loading",
      "It keeps the load within weight-and-balance and stops cargo shifting in flight",
      "It reduces ULD tare weight",
      "It is only a cosmetic requirement",
    ],
    correctIndex: 1,
    explanation:
      "Proper securing keeps cargo within the contour and the aircraft within its weight-and-balance envelope, preventing dangerous load shift during flight.",
    category: "standards",
  },
  {
    id: "q-standards-contour",
    question:
      "What is the purpose of building a ULD to a contour (e.g. the PKC pallet)?",
    options: [
      "To increase the tare weight",
      "To match the fuselage curve and recover otherwise wasted side-wall volume",
      "To make the unit refrigerated",
      "To allow lower-deck loading",
    ],
    correctIndex: 1,
    explanation:
      "Contouring shapes the build-up to the upper-fuselage curve, using volume that a square build would leave empty while staying within the loadable envelope.",
    category: "standards",
  },
];
