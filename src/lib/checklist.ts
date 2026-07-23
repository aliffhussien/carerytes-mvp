import type { RouteMatch } from "@/lib/engine";
import { DISCLAIMER_TEXT } from "@/lib/safety";

/**
 * Plain-text checklist a patient can save or bring to a hospital/agency
 * counter — every matched route with its documents and missing information,
 * in the same order shown on the results screen.
 */
export function buildChecklistText(matches: RouteMatch[], generatedAt: Date): string {
  const lines: string[] = [];

  lines.push("CareRytes — Your Possible Routes Checklist");
  lines.push(`Generated: ${generatedAt.toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" })}`);
  lines.push("");
  lines.push(DISCLAIMER_TEXT);
  lines.push("");

  matches.forEach((match, index) => {
    const { route, matchLabel, reason } = match;
    lines.push("----------------------------------------");
    lines.push(`${index + 1}. ${route.title} — ${matchLabel}`);
    lines.push(`Provider: ${route.provider}`);
    lines.push(reason);
    lines.push("");
    lines.push(route.verificationNote);
    lines.push("");

    if (route.missingInformation.length > 0) {
      lines.push("Missing information:");
      route.missingInformation.forEach((item) => lines.push(`  - ${item}`));
      lines.push("");
    }

    lines.push("Documents to prepare:");
    route.documentsToPrepare.forEach((item) => lines.push(`  - ${item}`));
    lines.push("");

    lines.push(`Final decision by: ${route.finalDecisionBy}`);
    lines.push(`Official source: ${route.officialSourceUrl}`);
    lines.push("");
  });

  lines.push("----------------------------------------");

  return lines.join("\n");
}

export function downloadChecklist(matches: RouteMatch[]): void {
  const text = buildChecklistText(matches, new Date());
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `carerytes-checklist-${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
