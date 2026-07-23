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

/**
 * RYTS Engine — rules-based matching only. Returns possible routes based on
 * answers; the final decision for any route always belongs to the agency or provider.
 */
export function getPossibleRoutes(input: SupportCheckInput): SupportRoute[] {
  const isTreatmentCost = input.supportNeed === "treatment-cost";
  const isB40 = input.householdBand === "b40";
  const isGovernmentFacility =
    input.treatmentFacility === "government" || input.treatmentFacility === "both";

  const matches: SupportRoute[] = [];

  if (isTreatmentCost && isB40) {
    const makna = findRoute("makna-bursary");
    if (makna) matches.push(makna);
  }

  if (isTreatmentCost && isB40 && isGovernmentFacility) {
    const mySalam = findRoute("mysalam");
    if (mySalam) matches.push(mySalam);
  }

  if (isTreatmentCost && isB40) {
    const pekaB40 = findRoute("peka-b40");
    if (pekaB40) matches.push(pekaB40);
  }

  return matches;
}
