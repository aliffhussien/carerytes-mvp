import { mockRoutes, type SupportRoute } from "@/data/mockRoutes";

export type SupportNeed = "treatment-cost" | "transport" | "medicine-equipment" | "general";
export type HouseholdBand = "b40" | "m40" | "unknown";
export type TreatmentFacility = "government" | "private" | "both" | "not-sure";
export type YesNoNotSure = "yes" | "no" | "not-sure";

export type SupportCheckInput = {
  supportNeed: SupportNeed;
  householdBand: HouseholdBand;
  treatmentFacility: TreatmentFacility;
  kwspMember?: YesNoNotSure;
  hasInsurance?: YesNoNotSure;
  includeNgoZakat?: YesNoNotSure;
  locationState?: string;
};

// Confidence labels per the RYTS Engine spec — the engine only ever suggests,
// never confirms eligibility.
export type MatchLabel =
  | "Likely relevant"
  | "Maybe relevant"
  | "Not enough information"
  | "Needs official verification";

export type RouteMatch = {
  route: SupportRoute;
  matchLabel: MatchLabel;
  reason: string;
};

const LABEL_PRIORITY: Record<MatchLabel, number> = {
  "Likely relevant": 0,
  "Maybe relevant": 1,
  "Not enough information": 2,
  "Needs official verification": 3,
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
export function getRouteMatches(input: SupportCheckInput): RouteMatch[] {
  const isTreatmentCost = input.supportNeed === "treatment-cost";
  const isTransport = input.supportNeed === "transport";
  const isMedicineEquipment = input.supportNeed === "medicine-equipment";
  const isGeneralSupport = input.supportNeed === "general";
  const isB40 = input.householdBand === "b40";
  const isM40 = input.householdBand === "m40";
  const isLowerIncomeBand = isB40 || isM40;
  const isGovernmentFacility =
    input.treatmentFacility === "government" || input.treatmentFacility === "both";
  const includeNgoZakat = input.includeNgoZakat !== "no";

  const matches: RouteMatch[] = [];

  function addMatch(routeId: string, matchLabel: MatchLabel, reason: string) {
    const route = findRoute(routeId);
    if (route) matches.push({ route, matchLabel, reason });
  }

  // MAKNA — cancer patients facing financial difficulty (B40 or M40). NGO route, gated by includeNgoZakat.
  if (isTreatmentCost && isLowerIncomeBand && includeNgoZakat) {
    addMatch(
      "makna-bursary",
      "Maybe relevant",
      "You selected treatment cost support and a B40/M40 household band, which MAKNA's patient assistance considers — the hospital's medical social work assessment decides the rest."
    );
  }

  // mySalam — B40 household, critical illness or government hospital admission.
  if (isTreatmentCost && isB40 && isGovernmentFacility) {
    addMatch(
      "mysalam",
      "Likely relevant",
      "You selected treatment cost support, B40 household, and government hospital treatment — mySalam's core criteria."
    );
  }

  // PeKa B40 — B40 health screening, plus a verified transport incentive for MOH
  // cancer treatment journeys and medical equipment assistance up to RM20,000.
  if (isB40 && (isTreatmentCost || isTransport || isMedicineEquipment)) {
    if (isTransport) {
      addMatch(
        "peka-b40",
        "Maybe relevant",
        "You selected transport support and B40 household — PeKa B40's transport incentive covers journeys for cancer treatment at MOH hospitals, but your current STR/B40 status and MOH hospital route weren't checked in this flow."
      );
    } else if (isMedicineEquipment) {
      addMatch(
        "peka-b40",
        "Maybe relevant",
        "You selected medicine/equipment support and B40 household — PeKa B40 includes medical equipment assistance up to RM20,000, but your current STR/B40 status wasn't checked in this flow."
      );
    } else {
      addMatch(
        "peka-b40",
        "Maybe relevant",
        "You selected treatment cost support and B40 household — PeKa B40 covers this, but your current STR/B40 status wasn't checked in this flow."
      );
    }
  }

  // KWSP Health Withdrawal — now gated by the kwspMember answer when given.
  if (isTreatmentCost && input.kwspMember !== "no") {
    if (input.kwspMember === "yes") {
      addMatch(
        "kwsp-health-withdrawal",
        "Likely relevant",
        "You selected treatment cost support and told us you're a KWSP member — this route's core criterion."
      );
    } else {
      addMatch(
        "kwsp-health-withdrawal",
        "Not enough information",
        "This route depends on your KWSP membership and account balance, which this check didn't ask about."
      );
    }
  }

  // KWSP Incapacitation Withdrawal — same membership gate, for the broader "general support" need.
  if (isGeneralSupport && input.kwspMember !== "no") {
    if (input.kwspMember === "yes") {
      addMatch(
        "kwsp-incapacitation-withdrawal",
        "Maybe relevant",
        "You're a KWSP member with a general support need — this route also depends on your stop-working date, which this check didn't ask about."
      );
    } else {
      addMatch(
        "kwsp-incapacitation-withdrawal",
        "Not enough information",
        "This route depends on your KWSP membership and stop-working date, which this check didn't ask about."
      );
    }
  }

  // TBP KKM — routed through government/university hospital, not income-tier gated.
  // Verified as covering medical equipment/devices as well as general treatment cost.
  if (isGovernmentFacility && (isTreatmentCost || isMedicineEquipment)) {
    addMatch(
      "tbp-kkm",
      "Maybe relevant",
      "You selected government hospital treatment — TBP is arranged through the hospital's Medical Social Work Officer, not a direct application."
    );
  }

  // Breast Cancer Foundation — NGO route, gated by includeNgoZakat. Diagnosis type and
  // income threshold still aren't asked in this check.
  if (isTreatmentCost && includeNgoZakat) {
    addMatch(
      "breast-cancer-foundation",
      "Not enough information",
      "This fund is specific to breast cancer diagnosis and a RM5,000 household income threshold, which weren't checked in this flow."
    );
  }

  // JKM BPT — caregiver of bedridden patient, or chronic patient needing continuous care.
  if ((isTreatmentCost || isGeneralSupport) && isLowerIncomeBand) {
    addMatch(
      "jkm-bpt",
      "Maybe relevant",
      "You selected a B40/M40 household with treatment or general support needs — JKM BPT covers caregivers or chronic patients, but this depends on a treatment verification letter."
    );
  }

  // Assunta Hospital ASSISS — hospital-specific; which hospital isn't asked in this check.
  if (isTreatmentCost && isB40) {
    addMatch(
      "assunta-assiss",
      "Not enough information",
      "This route is limited to treatment specifically at Assunta Hospital, Petaling Jaya, which wasn't checked in this flow."
    );
  }

  // NKF Dialysis Welfare/Subsidy — NGO route, gated by includeNgoZakat. Also covers a
  // verified Patient Transport Subsidy. Dialysis/kidney involvement still isn't asked.
  if ((isTreatmentCost || isTransport) && includeNgoZakat) {
    if (isTransport) {
      addMatch(
        "nkf-dialysis",
        "Not enough information",
        "NKF runs a Patient Transport Subsidy alongside dialysis welfare support — this check didn't ask whether dialysis/kidney treatment is involved in your situation."
      );
    } else {
      addMatch(
        "nkf-dialysis",
        "Not enough information",
        "NKF supports dialysis/kidney patients specifically — this check didn't ask whether dialysis is involved in your treatment."
      );
    }
  }

  // Insurance/Takaful claim checklist — now gated by the hasInsurance answer when given.
  if (isTreatmentCost && input.hasInsurance !== "no") {
    if (input.hasInsurance === "yes") {
      addMatch(
        "insurance-takaful-checklist",
        "Maybe relevant",
        "You told us you have insurance or takaful coverage — this checklist applies, but your specific policy terms still need checking with your insurer."
      );
    } else {
      addMatch(
        "insurance-takaful-checklist",
        "Not enough information",
        "This checklist applies if you have an insurance or takaful policy — this check didn't ask whether you're covered."
      );
    }
  }

  // State zakat medical aid — gated by includeNgoZakat, then matched by location state;
  // religion/Asnaf status is self-disclosed.
  if (isTreatmentCost && includeNgoZakat && input.locationState) {
    const zakatRouteId = ZAKAT_STATE_ROUTE_IDS[input.locationState];
    if (zakatRouteId) {
      addMatch(
        zakatRouteId,
        "Maybe relevant",
        "You selected a state with a known zakat/baitulmal medical aid scheme — this depends on Muslim/Asnaf status, which this check didn't ask about."
      );
    } else if (ZAKAT_REFERRAL_STATES.has(input.locationState)) {
      addMatch(
        "zakat-referral-no-online-scheme",
        "Needs official verification",
        "No structured public online zakat medical aid scheme was found for your state — check directly with your state Baitulmal office."
      );
    }
  }

  return matches.sort((a, b) => LABEL_PRIORITY[a.matchLabel] - LABEL_PRIORITY[b.matchLabel]);
}
