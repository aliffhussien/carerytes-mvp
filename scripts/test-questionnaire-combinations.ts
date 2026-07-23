import { getRouteMatches, type SupportCheckInput } from "@/lib/engine";
import { mockRoutes, validateMockRoutes, type SupportRoute } from "@/data/mockRoutes";
import { scanUnsafeTerms } from "@/lib/safety";
import { questionnaire } from "@/data/questionnaire";
import { buildChecklistText } from "@/lib/checklist";

const SUPPORT_NEEDS = ["treatment-cost", "transport", "medicine-equipment", "general"] as const;
const HOUSEHOLD_BANDS = ["b40", "m40", "unknown"] as const;
const TREATMENT_FACILITIES = ["government", "private", "both", "not-sure"] as const;

const locationOptions = questionnaire.find((q) => q.id === "locationState")?.options ?? [];
const LOCATION_STATES: (string | undefined)[] = [undefined, ...locationOptions.map((o) => o.value)];

type RunResult = {
  input: SupportCheckInput;
  routeIds: string[];
  error?: string;
};

function requiredFieldsMissing(route: SupportRoute): string[] {
  const missing: string[] = [];
  if (!route.title) missing.push("title");
  if (!route.provider) missing.push("provider");
  if (!route.routeSummary) missing.push("routeSummary");
  if (!route.verificationNote) missing.push("verificationNote");
  if (!route.finalDecisionBy) missing.push("finalDecisionBy");
  if (!route.officialSourceUrl) missing.push("officialSourceUrl");
  if (!/^https?:\/\//.test(route.officialSourceUrl ?? "")) missing.push("officialSourceUrl (not a valid URL)");
  return missing;
}

function main() {
  console.log("=== CareRytes questionnaire combination test ===\n");

  // 1. Safety scan across all mock route copy.
  const safetyIssues = validateMockRoutes();
  console.log(`Mock routes: ${mockRoutes.length}`);
  console.log(safetyIssues.length === 0 ? "Safety scan: CLEAN" : `Safety scan: ${safetyIssues.length} issue(s)`);
  safetyIssues.forEach((i) => console.log("  -", i));
  console.log("");

  // 2. Duplicate route id check.
  const idCounts = new Map<string, number>();
  for (const route of mockRoutes) {
    idCounts.set(route.id, (idCounts.get(route.id) ?? 0) + 1);
  }
  const duplicateIds = [...idCounts.entries()].filter(([, count]) => count > 1);
  console.log(duplicateIds.length === 0 ? "Duplicate route ids: none" : `Duplicate route ids found: ${duplicateIds.map(([id]) => id).join(", ")}`);
  console.log("");

  // 3. Field integrity check per route.
  let fieldIssueCount = 0;
  for (const route of mockRoutes) {
    const missing = requiredFieldsMissing(route);
    if (missing.length > 0) {
      fieldIssueCount++;
      console.log(`Field issue in "${route.id}": missing/invalid ${missing.join(", ")}`);
    }
  }
  console.log(fieldIssueCount === 0 ? "Route field integrity: CLEAN\n" : `Route field integrity: ${fieldIssueCount} route(s) with issues\n`);

  // 4. Exhaustive combination run through the engine.
  const results: RunResult[] = [];
  let errorCount = 0;
  let zeroRouteCount = 0;
  const routeHitCounts = new Map<string, number>();

  for (const supportNeed of SUPPORT_NEEDS) {
    for (const householdBand of HOUSEHOLD_BANDS) {
      for (const treatmentFacility of TREATMENT_FACILITIES) {
        for (const locationState of LOCATION_STATES) {
          const input: SupportCheckInput = {
            supportNeed,
            householdBand,
            treatmentFacility,
            locationState,
          };

          try {
            const matches = getRouteMatches(input);
            const routeIds = matches.map((m) => m.route.id);
            routeIds.forEach((id) => routeHitCounts.set(id, (routeHitCounts.get(id) ?? 0) + 1));
            if (routeIds.length === 0) zeroRouteCount++;

            // Scan the rendered copy of every matched route (including the engine's
            // generated reason text) as a final safety net, on top of validateMockRoutes().
            for (const { route, reason } of matches) {
              const text = [
                route.title,
                route.routeSummary,
                route.verificationNote,
                reason,
                ...route.missingInformation,
                ...route.documentsToPrepare,
              ].join(" ");
              const unsafe = scanUnsafeTerms(text);
              if (unsafe.length > 0) {
                errorCount++;
                results.push({
                  input,
                  routeIds,
                  error: `Route "${route.id}" contains forbidden terms: ${unsafe.join(", ")}`,
                });
              }
            }

            // Also scan the exported checklist text (the same content a user
            // downloads and brings to a hospital/agency counter).
            if (matches.length > 0) {
              const checklistText = buildChecklistText(matches, new Date("2026-01-01"));
              const unsafeChecklist = scanUnsafeTerms(checklistText);
              if (unsafeChecklist.length > 0) {
                errorCount++;
                results.push({
                  input,
                  routeIds,
                  error: `Checklist export contains forbidden terms: ${unsafeChecklist.join(", ")}`,
                });
              }
            }

            results.push({ input, routeIds });
          } catch (err) {
            errorCount++;
            results.push({
              input,
              routeIds: [],
              error: err instanceof Error ? err.message : String(err),
            });
          }
        }
      }
    }
  }

  const totalCombinations = SUPPORT_NEEDS.length * HOUSEHOLD_BANDS.length * TREATMENT_FACILITIES.length * LOCATION_STATES.length;

  console.log(`Total combinations tested: ${totalCombinations}`);
  console.log(`Combinations with 0 matched routes: ${zeroRouteCount}`);
  console.log(`Runtime/safety errors thrown: ${errorCount}`);
  console.log("");

  console.log("Route hit counts (how many combinations matched each route):");
  for (const route of mockRoutes) {
    console.log(`  ${route.id.padEnd(35)} ${routeHitCounts.get(route.id) ?? 0}`);
  }
  const neverMatched = mockRoutes.filter((r) => !routeHitCounts.has(r.id));
  console.log("");
  console.log(
    neverMatched.length === 0
      ? "Every route is reachable by at least one combination: OK"
      : `WARNING: ${neverMatched.length} route(s) never matched by any combination: ${neverMatched.map((r) => r.id).join(", ")}`
  );

  if (errorCount > 0) {
    console.log("\n=== ERRORS ===");
    for (const r of results) {
      if (r.error) {
        console.log(JSON.stringify(r.input), "->", r.error);
      }
    }
  }

  console.log("\n=== SUMMARY ===");
  const ok = safetyIssues.length === 0 && duplicateIds.length === 0 && fieldIssueCount === 0 && errorCount === 0;
  console.log(ok ? "ALL CHECKS PASSED" : "CHECKS FAILED — see details above");
  process.exit(ok ? 0 : 1);
}

main();
