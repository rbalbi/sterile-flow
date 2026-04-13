export type ProtocolCode = "standard" | "sanitize" | "sterilize";

export interface Protocol {
  code: ProtocolCode;
  label: string;
  turnaroundHours: number;
  helperText: string;
  surchargePctPerGarment: number;
  dot: string;
}

export interface GarmentType {
  id: string;
  label: string;
  protocolsSupported: ProtocolCode[];
  hazardousEligible: boolean;
}

export interface PickupLocation {
  id: string;
  label: string;
  building: string;
  floor: string;
  isHazardEligible: boolean;
}

export const PROTOCOLS: Protocol[] = [
  {
    code: "standard",
    label: "Standard",
    turnaroundHours: 24,
    helperText:
      "Returned in 24 hours. Everyday laundering using eco-friendly clinical detergents.",
    surchargePctPerGarment: 0,
    dot: "var(--sterile-text-secondary)",
  },
  {
    code: "sanitize",
    label: "Sanitize",
    turnaroundHours: 12,
    helperText: "Returned in 12 hours. High-heat, recommended after clinical use.",
    surchargePctPerGarment: 0,
    dot: "var(--sterile-primary-gradient-end)",
  },
  {
    code: "sterilize",
    label: "Sterilize",
    turnaroundHours: 36,
    helperText: "Returned in 36 hours. Autoclave-compatible items only.",
    surchargePctPerGarment: 0.4,
    dot: "var(--sterile-hazard-amber)",
  },
];

export const GARMENT_TYPES: GarmentType[] = [
  { id: "scrubs-top", label: "Scrubs top", protocolsSupported: ["standard", "sanitize", "sterilize"], hazardousEligible: true },
  { id: "scrubs-bottom", label: "Scrubs bottom", protocolsSupported: ["standard", "sanitize", "sterilize"], hazardousEligible: true },
  { id: "lab-coat", label: "Lab coat", protocolsSupported: ["standard", "sanitize"], hazardousEligible: true },
  { id: "surgical-gown", label: "Surgical gown", protocolsSupported: ["standard", "sanitize", "sterilize"], hazardousEligible: true },
  { id: "scrub-cap", label: "Scrub cap", protocolsSupported: ["standard", "sanitize"], hazardousEligible: false },
  { id: "patient-gown", label: "Patient gown", protocolsSupported: ["standard", "sanitize"], hazardousEligible: true },
  { id: "linens", label: "Linens", protocolsSupported: ["standard", "sanitize"], hazardousEligible: true },
  { id: "other", label: "Other", protocolsSupported: ["standard", "sanitize"], hazardousEligible: false },
];

export const PICKUP_LOCATIONS: PickupLocation[] = [
  { id: "icu-west-4", label: "ICU — West Wing Level 4", building: "West", floor: "4", isHazardEligible: true },
  { id: "or-main-3", label: "Main OR — Level 3", building: "Main", floor: "3", isHazardEligible: true },
  { id: "er-east-1", label: "Emergency Dept — East Level 1", building: "East", floor: "1", isHazardEligible: true },
  { id: "peds-west-2", label: "Pediatrics — West Wing Level 2", building: "West", floor: "2", isHazardEligible: true },
  { id: "admin-5", label: "Admin Offices — Level 5", building: "Main", floor: "5", isHazardEligible: false },
];

export const HAZARD_CATEGORIES = [
  { id: "bodily_fluids", label: "Blood / bodily fluids" },
  { id: "human_tissue", label: "Human tissue or remains" },
  { id: "chemical_contaminant", label: "Chemical contaminant" },
  { id: "sharps_risk", label: "Sharps risk" },
  { id: "infectious_disease", label: "Infectious disease exposure (requires isolation handling)" },
] as const;

export type HazardCategoryId = (typeof HAZARD_CATEGORIES)[number]["id"];
