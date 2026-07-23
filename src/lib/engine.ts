import { mockRoutes, type SupportRoute } from "@/data/mockRoutes";

export type SupportNeed = "treatment-cost" | "transport" | "medicine-equipment" | "general";
export type HouseholdBand = "b40" | "m40" | "unknown";
export type TreatmentFacility = "government" | "private" | "both" | "not-sure";

export type SupportCheckInput = {
  supportNeed: SupportNeed;
  householdBand: HouseholdBand;
  treatmentFacility: TreatmentFacility;
  locationState?: string;
};

function findRoute(id: string): SupportRoute | undefined {
  return mockRoutes.find((route) => route.id === id);
}

// Maps questionnaire locationState values to their matching zakat route id.
// KL/Labuan/Putrajaya all fall under MAIWP (Wilayah Persekutuan).
const ZAKAT_STATE_ROUTE_IDS: Record<string, string> = {
  selangor: "zakat-selangor",
  johor: "zakat-johor",
  perak: "zakat-perak",
  melaka: "zakat-melaka",
  kedah: "zakat-kedah",
  "negeri-sembilan": "zakat-negeri-sembilan",
  pahang: "zakat-pahang",
  perlis: "zakat-perlis",
  sarawak: "zakat-sarawak",
  terengganu: "zakat-terengganu",
  "kuala-lumpur": "zakat-wilayah-persekutuan",
  labuan: "zakat-wilayah-persekutuan",
  putrajaya: "zakat-wilayah-persekutuan",
};

// States with no verified public online zakat medical aid scheme —
// shown with a direct-referral fallback route instead.
const ZAKAT_REFERRAL_STATES = new Set(["kelantan", "penang", "sabah"]);

/**
 * RYTS Engine — rules-based matching only. Returns possible routes based on
 * answers; the final decision for any route always belongs to the agency or provider.
 */
export function getPossibleRoutes(input: SupportCheckInput): SupportRoute[] {
  const isTreatmentCost = input.supportNeed === "treatment-cost";
  const isGeneralSupport = input.supportNeed === "general";
  const isB40 = input.householdBand === "b40";
  const isM40 = input.householdBand === "m40";
  const isLowerIncomeBand = isB40 || isM40;
  const isGovernmentFacility =
    input.treatmentFacility === "government" || input.treatmentFacility === "both";

  const matches: SupportRoute[] = [];

  // MAKNA — cancer patients facing financial difficulty (B40 or M40).
  if (isTreatmentCost && isLowerIncomeBand) {
    const makna = findRoute("makna-bursary");
    if (makna) matches.push(makna);
  }

  // mySalam — B40 household, critical illness or government hospital admission.
  if (isTreatmentCost && isB40 && isGovernmentFacility) {
    const mySalam = findRoute("mysalam");
    if (mySalam) matches.push(mySalam);
  }

  // PeKa B40 — B40 health screening and support.
  if (isTreatmentCost && isB40) {
    const pekaB40 = findRoute("peka-b40");
    if (pekaB40) matches.push(pekaB40);
  }

  // KWSP Health Withdrawal — not income-tier gated; KWSP membership is self-disclosed.
  if (isTreatmentCost) {
    const kwspHealth = findRoute("kwsp-health-withdrawal");
    if (kwspHealth) matches.push(kwspHealth);
  }

  // KWSP Incapacitation Withdrawal — broader "general support" need (unable to work).
  if (isGeneralSupport) {
    const kwspIncapacitation = findRoute("kwsp-incapacitation-withdrawal");
    if (kwspIncapacitation) matches.push(kwspIncapacitation);
  }

  // TBP KKM — routed through government/university hospital, not income-tier gated.
  if (isTreatmentCost && isGovernmentFacility) {
    const tbpKkm = findRoute("tbp-kkm");
    if (tbpKkm) matches.push(tbpKkm);
  }

  // Breast Cancer Foundation — cancer type and income self-disclosed on the card itself.
  if (isTreatmentCost) {
    const bcf = findRoute("breast-cancer-foundation");
    if (bcf) matches.push(bcf);
  }

  // JKM BPT — caregiver of bedridden patient, or chronic patient needing continuous care.
  if ((isTreatmentCost || isGeneralSupport) && isLowerIncomeBand) {
    const jkmBpt = findRoute("jkm-bpt");
    if (jkmBpt) matches.push(jkmBpt);
  }

  // Assunta Hospital ASSISS — tighter income band, hospital-specific.
  if (isTreatmentCost && isB40) {
    const assunta = findRoute("assunta-assiss");
    if (assunta) matches.push(assunta);
  }

  // State zakat medical aid — matched by location state; religion is self-disclosed.
  if (isTreatmentCost && input.locationState) {
    const zakatRouteId = ZAKAT_STATE_ROUTE_IDS[input.locationState];
    if (zakatRouteId) {
      const zakatRoute = findRoute(zakatRouteId);
      if (zakatRoute) matches.push(zakatRoute);
    } else if (ZAKAT_REFERRAL_STATES.has(input.locationState)) {
      const referral = findRoute("zakat-referral-no-online-scheme");
      if (referral) matches.push(referral);
    }
  }

  return matches;
}
