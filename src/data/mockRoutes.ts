import { scanUnsafeTerms } from "@/lib/safety";

export type SupportRoute = {
  id: string;
  title: string;
  provider: string;
  routeSummary: string;
  verificationNote: string;
  finalDecisionBy: string;
  sourceLabel: string;
  officialSourceUrl: string;
  missingInformation: string[];
  documentsToPrepare: string[];
};

export const mockRoutes: SupportRoute[] = [
  {
    id: "makna-bursary",
    title: "MAKNA Bursary — Patient Assistance",
    provider: "Majlis Kanser Nasional (MAKNA)",
    routeSummary:
      "A possible route for cancer patients facing financial difficulty, offering monthly allowance and support for medical needs, based on assessment.",
    verificationNote:
      "Official source reviewed. This route needs official verification for your specific case.",
    finalDecisionBy: "MAKNA, via the hospital Medical Social Work Department",
    sourceLabel: "Official source",
    officialSourceUrl: "https://makna.org.my/bursary-patient-assistance/",
    missingInformation: [
      "Hospital medical social work assessment",
      "Income supporting documents",
    ],
    documentsToPrepare: [
      "IC",
      "Cancer diagnosis / medical report",
      "Income proof",
      "Hospital social worker assessment",
    ],
  },
  {
    id: "mysalam",
    title: "mySalam",
    provider: "mySalam",
    routeSummary:
      "A possible route for B40 households facing critical illness or government hospital admission, based on your answers.",
    verificationNote:
      "Official source reviewed. This route needs official verification of your current mySalam status on the official portal, as this may change each year.",
    finalDecisionBy: "mySalam",
    sourceLabel: "Official source",
    officialSourceUrl: "https://www.mysalam.com.my/",
    missingInformation: [
      "Current mySalam status for this year",
      "Hospitalisation or diagnosis documents",
    ],
    documentsToPrepare: [
      "IC",
      "Bank account details",
      "Diagnosis or hospitalisation documents",
    ],
  },
  {
    id: "peka-b40",
    title: "PeKa B40",
    provider: "ProtectHealth / KKM",
    routeSummary:
      "A possible route for B40 households, covering health screening and support for non-communicable diseases, based on your answers.",
    verificationNote:
      "Official source reviewed. This route needs official verification of your current STR / B40 status.",
    finalDecisionBy: "ProtectHealth / KKM",
    sourceLabel: "Official source",
    officialSourceUrl: "https://protecthealth.com.my/peka-b40-eng/",
    missingInformation: ["Current STR / B40 status details"],
    documentsToPrepare: ["IC", "STR / B40 status check"],
  },
];

export function validateMockRoutes(): string[] {
  const issues: string[] = [];

  for (const route of mockRoutes) {
    const text = [
      route.title,
      route.routeSummary,
      route.verificationNote,
      route.finalDecisionBy,
      route.sourceLabel,
      ...route.missingInformation,
      ...route.documentsToPrepare,
    ].join(" ");

    const found = scanUnsafeTerms(text);
    if (found.length > 0) {
      issues.push(`${route.id}: contains forbidden terms — ${found.join(", ")}`);
    }
  }

  return issues;
}
