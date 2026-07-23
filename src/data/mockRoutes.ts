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
  {
    id: "kwsp-health-withdrawal",
    title: "KWSP Health Withdrawal — Critical Illness",
    provider: "KWSP (EPF)",
    routeSummary:
      "A possible route for KWSP members needing funds for cancer treatment, covering medical costs and healthcare equipment under KWSP's critical illness category, based on your answers.",
    verificationNote:
      "Official source reviewed. This route needs official verification of your KWSP membership and account balance via i-Akaun.",
    finalDecisionBy: "KWSP (EPF)",
    sourceLabel: "Official source",
    officialSourceUrl: "https://www.kwsp.gov.my/en/member/healthcare/critical-illness",
    missingInformation: [
      "KWSP membership status",
      "i-Akaun balance and access",
      "Medical report matching KWSP's document requirements",
    ],
    documentsToPrepare: [
      "IC",
      "KWSP member details",
      "Form KWSP 9D (AHL)",
      "Medical report / diagnosis letter",
      "Treatment plan or quotation",
      "Bank account details",
    ],
  },
  {
    id: "kwsp-incapacitation-withdrawal",
    title: "KWSP Incapacitation Withdrawal",
    provider: "KWSP (EPF)",
    routeSummary:
      "A possible route for KWSP members under 60 who have fully stopped working due to illness, allowing withdrawal of savings and a one-off incapacitation payment, based on your answers.",
    verificationNote:
      "Official source reviewed. This route needs official verification through KWSP's Medical Board assessment, and must be applied for within 12 months of stopping work.",
    finalDecisionBy: "KWSP (EPF) Medical Board",
    sourceLabel: "Official source",
    officialSourceUrl: "https://www.kwsp.gov.my/en/member/healthcare/incapacitation",
    missingInformation: [
      "KWSP membership status",
      "Date you stopped working",
      "Medical Board assessment outcome",
    ],
    documentsToPrepare: [
      "IC",
      "Original medical report (within 1 year)",
      "Employer letter verifying resignation due to health",
      "KWSP member details",
    ],
  },
  {
    id: "tbp-kkm",
    title: "Tabung Bantuan Perubatan KKM (TBP)",
    provider: "Ministry of Health Malaysia (KKM)",
    routeSummary:
      "A possible route for patients receiving treatment at a government or university hospital who need help with medical costs, arranged through the hospital's Medical Social Work Officer, based on your answers.",
    verificationNote:
      "Official source reviewed. This route normally needs a referral from your specialist and an assessment by the hospital's Medical Social Work Officer (PKSP) — it is not a direct self-application.",
    finalDecisionBy: "KKM, via the hospital Medical Social Work Officer",
    sourceLabel: "Official source",
    officialSourceUrl:
      "https://www.moh.gov.my/warga/muat-turun-borang/maklumat-dan-borang-permohonan-tabung-bantuan-perubatan",
    missingInformation: [
      "Specialist referral to the Medical Social Work Officer",
      "Treatment cost quotation",
      "Income supporting documents",
    ],
    documentsToPrepare: [
      "IC",
      "Specialist / medical officer referral",
      "Medical Social Work Officer assessment",
      "Treatment quotation or bill",
      "Income proof",
      "Borang B TBP",
    ],
  },
  {
    id: "breast-cancer-foundation",
    title: "Breast Cancer Foundation — Patient Fund",
    provider: "Breast Cancer Foundation Malaysia",
    routeSummary:
      "This fund is specifically for breast cancer patients with monthly household income of RM5,000 or below. It does not cover other cancer types.",
    verificationNote:
      "Official source reviewed. Please check that your diagnosis is specifically breast cancer and your household income meets the threshold before applying — this route needs official verification for your specific case.",
    finalDecisionBy: "Breast Cancer Foundation Malaysia",
    sourceLabel: "Official source",
    officialSourceUrl: "https://www.breastcancerfoundation.org.my/patient-fund",
    missingInformation: [
      "Check your diagnosis is specifically breast cancer — this fund does not cover other cancer types",
      "Household income at or below RM5,000/month",
      "At least 3 of the fund's listed criteria (e.g. exhausted financial resources, no other coverage)",
    ],
    documentsToPrepare: [
      "IC",
      "Breast cancer diagnosis / medical report",
      "Income proof",
      "Treatment bills",
      "Oncologist verification on application form",
    ],
  },
  {
    id: "jkm-bpt",
    title: "Bantuan Penjagaan OKU Terlantar / Pesakit Kronik (BPT)",
    provider: "Jabatan Kebajikan Masyarakat (JKM)",
    routeSummary:
      "A possible route for caregivers of bedridden patients, or for chronic (non-bedridden) patients needing continuous treatment of at least 3 months who may apply in their own name, based on your answers.",
    verificationNote:
      "Official source reviewed (JKM, updated 1 Aug 2025). This route needs official verification of household income and a treatment verification letter from a hospital or clinic.",
    finalDecisionBy: "Jabatan Kebajikan Masyarakat (JKM)",
    sourceLabel: "Official source",
    officialSourceUrl: "https://www.jkm.gov.my/",
    missingInformation: [
      "Household income at or below RM5,000/month",
      "Treatment verification letter from hospital/clinic",
      "Whether you are applying as a caregiver or as the patient yourself",
    ],
    documentsToPrepare: [
      "Borang JKM 18",
      "IC of applicant",
      "IC/MyKid of family members living together",
      "Income statement or employer letter",
      "Treatment verification from hospital/clinic",
      "Utility bill for address",
      "Bank account statement",
    ],
  },
  {
    id: "assunta-assiss",
    title: "Assunta Integrated Social Services (ASSISS)",
    provider: "Assunta Hospital",
    routeSummary:
      "A possible route for lower-income patients receiving treatment specifically at Assunta Hospital, Petaling Jaya, offering subsidised or free care through the hospital's social welfare programme.",
    verificationNote:
      "Official source reviewed. This route is limited to treatment at Assunta Hospital and needs official verification of household income through their social and financial assessment.",
    finalDecisionBy: "Assunta Hospital — Integrated Social Services",
    sourceLabel: "Official source",
    officialSourceUrl: "https://www.assunta.com.my/",
    missingInformation: [
      "Treatment specifically at Assunta Hospital, Petaling Jaya",
      "Household income supporting documents",
      "Social and financial assessment outcome",
    ],
    documentsToPrepare: ["IC", "Income proof", "Family financial profile documents"],
  },
  {
    id: "zakat-selangor",
    title: "Zakat Selangor — Bantuan Perubatan",
    provider: "Lembaga Zakat Selangor (LZS)",
    routeSummary:
      "A possible route for Muslim residents of Selangor needing help with medical treatment, surgery, or equipment costs, based on Asnaf assessment.",
    verificationNote:
      "Official source reviewed. This route needs official verification of your Asnaf status (Fakir/Miskin) by LZS.",
    finalDecisionBy: "Lembaga Zakat Selangor (LZS)",
    sourceLabel: "Official source",
    officialSourceUrl: "https://www.zakatselangor.com.my/",
    missingInformation: [
      "Muslim, residing in Selangor",
      "Asnaf status assessment",
      "Government hospital referral / medical report",
    ],
    documentsToPrepare: [
      "IC",
      "Medical report or referral letter from government hospital",
      "Income proof",
      "Cost quotation for medical treatment",
    ],
  },
  {
    id: "zakat-johor",
    title: "Zakat Johor — Skim Bantuan Perubatan",
    provider: "Majlis Agama Islam Negeri Johor (MAIJ)",
    routeSummary:
      "A possible route for Muslim residents of Johor needing help with medical treatment or haemodialysis costs, based on Asnaf assessment.",
    verificationNote:
      "Official source reviewed. This route needs official verification of your Asnaf status (Fakir/Miskin) by MAIJ.",
    finalDecisionBy: "Majlis Agama Islam Negeri Johor (MAIJ)",
    sourceLabel: "Official source",
    officialSourceUrl: "https://www.maij.gov.my/",
    missingInformation: ["Muslim, residing in Johor", "Asnaf status assessment", "Government hospital medical report"],
    documentsToPrepare: [
      "IC",
      "Medical report from government hospital",
      "Income proof",
      "MAIJ application form",
    ],
  },
  {
    id: "zakat-perak",
    title: "Zakat Perak — Bantuan Perubatan",
    provider: "Majlis Agama Islam dan 'Adat Melayu Perak (MAIPk)",
    routeSummary:
      "A possible route for Muslim residents of Perak needing help with medical treatment costs, based on Asnaf assessment.",
    verificationNote:
      "Official source reviewed. This route needs official verification of your Asnaf status through MAIPk's e-Zakat portal.",
    finalDecisionBy: "Majlis Agama Islam dan 'Adat Melayu Perak (MAIPk)",
    sourceLabel: "Official source",
    officialSourceUrl: "https://www.maiamp.gov.my/",
    missingInformation: ["Muslim, residing in Perak", "Asnaf status assessment"],
    documentsToPrepare: ["IC", "Medical report", "Income proof"],
  },
  {
    id: "zakat-melaka",
    title: "Zakat Melaka — Bantuan Perubatan / Sakit Kronik",
    provider: "Majlis Agama Islam Melaka (MAIM)",
    routeSummary:
      "A possible route for Muslim residents of Melaka needing help with medical or chronic illness costs, based on Asnaf assessment.",
    verificationNote:
      "Official source reviewed. This route needs official verification of your Asnaf status by MAIM's Unit Agihan Kebajikan.",
    finalDecisionBy: "Majlis Agama Islam Melaka (MAIM)",
    sourceLabel: "Official source",
    officialSourceUrl: "https://www.maim.gov.my/",
    missingInformation: ["Muslim, residing in Melaka", "Asnaf status assessment"],
    documentsToPrepare: ["IC", "Medical report from authorised hospital", "Income proof"],
  },
  {
    id: "zakat-kedah",
    title: "Zakat Kedah — Bantuan Perubatan",
    provider: "Lembaga Zakat Negeri Kedah (LZNK)",
    routeSummary:
      "A possible route for Muslim residents of Kedah needing monthly or one-off medical treatment support, medical equipment, or haemodialysis costs, based on Asnaf assessment.",
    verificationNote:
      "Official source reviewed. This route needs official verification of your Asnaf status through LZNK's online application system.",
    finalDecisionBy: "Lembaga Zakat Negeri Kedah (LZNK)",
    sourceLabel: "Official source",
    officialSourceUrl: "https://www.zakatkedah.com.my/",
    missingInformation: [
      "Muslim, residing in Kedah",
      "Asnaf status assessment",
      "Government hospital medical report",
    ],
    documentsToPrepare: [
      "IC",
      "Medical report from government hospital",
      "Income proof",
      "Bank statement",
      "Utility bill",
    ],
  },
  {
    id: "zakat-negeri-sembilan",
    title: "Zakat Negeri Sembilan — Bantuan Perubatan",
    provider: "Majlis Agama Islam Negeri Sembilan (MAINS)",
    routeSummary:
      "A possible route for Muslim residents of Negeri Sembilan needing help with medical treatment or haemodialysis costs, based on Asnaf assessment.",
    verificationNote:
      "Official source reviewed. This route needs official verification of your Asnaf status by MAINS.",
    finalDecisionBy: "Majlis Agama Islam Negeri Sembilan (MAINS)",
    sourceLabel: "Official source",
    officialSourceUrl: "https://www.mains.gov.my/",
    missingInformation: ["Muslim, residing in Negeri Sembilan", "Asnaf status assessment"],
    documentsToPrepare: ["IC", "Medical and financial documents (per MAINS application form)"],
  },
  {
    id: "zakat-pahang",
    title: "Zakat Pahang — Bantuan Peralatan Perubatan",
    provider: "Majlis Ugama Islam Pahang (MUIP)",
    routeSummary:
      "A possible route for Muslim residents of Pahang needing help with treatment costs or medical equipment, based on Asnaf assessment.",
    verificationNote:
      "Official source reviewed. This route needs official verification of your Asnaf status by MUIP's Bahagian Agihan Zakat.",
    finalDecisionBy: "Majlis Ugama Islam Pahang (MUIP)",
    sourceLabel: "Official source",
    officialSourceUrl: "https://muip.gov.my/",
    missingInformation: ["Muslim, residing in Pahang", "Asnaf status assessment"],
    documentsToPrepare: ["IC", "Medical documents", "Income proof"],
  },
  {
    id: "zakat-perlis",
    title: "Zakat Perlis — Bantuan Perubatan",
    provider: "Majlis Agama Islam dan Adat Istiadat Melayu Perlis (MAIPs)",
    routeSummary:
      "A possible route for Muslim residents of Perlis needing help with medical treatment costs, arranged through the hospital's Social Work Unit.",
    verificationNote:
      "Official source reviewed. This route must go through the hospital's Unit Kerja Sosial — it is not a direct online application.",
    finalDecisionBy: "Majlis Agama Islam dan Adat Istiadat Melayu Perlis (MAIPs)",
    sourceLabel: "Official source",
    officialSourceUrl: "https://www.maips.gov.my/",
    missingInformation: [
      "Muslim, residing in Perlis",
      "Referral through hospital Unit Kerja Sosial",
      "Asnaf status assessment",
    ],
    documentsToPrepare: ["IC", "Medical report", "Income supporting documents"],
  },
  {
    id: "zakat-sarawak",
    title: "Zakat Sarawak — Bantuan Perubatan",
    provider: "Tabung Baitulmal Sarawak (TBS)",
    routeSummary:
      "A possible route for Muslim residents of Sarawak needing help with chronic illness or cancer treatment costs, medical equipment, or transport and accommodation for treatment, based on Asnaf assessment.",
    verificationNote:
      "Official source reviewed. This route needs official verification of your Asnaf status and a hospital or clinic referral.",
    finalDecisionBy: "Tabung Baitulmal Sarawak (TBS)",
    sourceLabel: "Official source",
    officialSourceUrl: "https://www.tbs.org.my/",
    missingInformation: ["Muslim, residing in Sarawak", "Hospital/clinic referral", "Asnaf status assessment"],
    documentsToPrepare: ["IC", "Hospital referral letter", "Income proof"],
  },
  {
    id: "zakat-terengganu",
    title: "Zakat Terengganu — Bantuan Perubatan",
    provider: "Majlis Agama Islam dan Adat Melayu Terengganu (MAIDAM)",
    routeSummary:
      "A possible route for Muslim residents of Terengganu needing help with medical or chronic illness costs, based on Had Kifayah (basic needs) calculation.",
    verificationNote:
      "Official source reviewed. This route needs official verification of your Had Kifayah calculation through MAIDAM's eZakat portal.",
    finalDecisionBy: "Majlis Agama Islam dan Adat Melayu Terengganu (MAIDAM)",
    sourceLabel: "Official source",
    officialSourceUrl: "https://maidam.gov.my/",
    missingInformation: ["Muslim, residing in Terengganu", "Had Kifayah calculation", "Doctor's letter"],
    documentsToPrepare: ["IC", "Doctor's letter", "Income/financial documents"],
  },
  {
    id: "zakat-wilayah-persekutuan",
    title: "Zakat Wilayah Persekutuan — Bantuan Perubatan Am",
    provider: "Majlis Agama Islam Wilayah Persekutuan (MAIWP)",
    routeSummary:
      "A possible route for Muslim residents of Kuala Lumpur, Labuan, or Putrajaya needing help with medical treatment, services, or supplies, based on Asnaf assessment.",
    verificationNote:
      "Official source reviewed. This route needs official verification of your Asnaf category and residency by MAIWP.",
    finalDecisionBy: "Majlis Agama Islam Wilayah Persekutuan (MAIWP)",
    sourceLabel: "Official source",
    officialSourceUrl: "https://www.maiwp.gov.my/perkhidmatan/baitulmal",
    missingInformation: [
      "Muslim, residing in Wilayah Persekutuan (KL/Labuan/Putrajaya)",
      "Asnaf category assessment",
      "Treatment verification letter",
    ],
    documentsToPrepare: [
      "IC",
      "Photo",
      "Income proof / payslip",
      "Treatment verification / need letter",
      "Supporting medical documents",
    ],
  },
  {
    id: "nkf-dialysis",
    title: "NKF Malaysia — Dialysis Welfare / Subsidy Route",
    provider: "National Kidney Foundation of Malaysia (NKF)",
    routeSummary:
      "A possible route for dialysis or kidney patients seeking centre-based support, subject to a financial need/welfare assessment and NKF centre capacity, based on your answers.",
    verificationNote:
      "Official source reviewed. This route needs official verification of your dialysis/kidney diagnosis and NKF centre capacity.",
    finalDecisionBy: "NKF Malaysia, with MOH subsidy route where applicable",
    sourceLabel: "Official source",
    officialSourceUrl: "https://nkf.org.my/patient-welfare/",
    missingInformation: [
      "Dialysis/kidney diagnosis and medical documents",
      "Income and financial status documents",
      "NKF centre capacity in your area",
    ],
    documentsToPrepare: [
      "IC",
      "Dialysis/medical documents",
      "Bills and salary slips / income proof",
      "NKF centre application forms",
    ],
  },
  {
    id: "insurance-takaful-checklist",
    title: "Insurance / Takaful Generic Claim Checklist",
    provider: "Your insurer / takaful operator",
    routeSummary:
      "A general checklist for insurance or takaful claims that may match hospitalisation, critical illness, or personal accident coverage, based on your answers.",
    verificationNote:
      "This is a checklist only, not financial or insurance advice. This route needs official verification of your specific policy terms, waiting period, and exclusions with your insurer or takaful operator.",
    finalDecisionBy: "Your insurer / takaful operator",
    sourceLabel: "Claim guide reference",
    officialSourceUrl: "https://www.takaful-malaysia.com.my/en/claim-guide/",
    missingInformation: [
      "Whether you hold an insurance/takaful policy",
      "Policy/certificate number and coverage type",
      "Whether your situation matches a covered claim type",
    ],
    documentsToPrepare: [
      "IC",
      "Claim form",
      "Policy/certificate number",
      "Medical report / doctor statement",
      "Diagnosis report and investigation results",
      "Original receipts and itemised bills",
      "Discharge summary / referral letter (if applicable)",
      "Bank account details",
    ],
  },
  {
    id: "zakat-referral-no-online-scheme",
    title: "State Zakat / Baitulmal — Direct Referral",
    provider: "State Zakat / Baitulmal Office",
    routeSummary:
      "No public online medical aid scheme was found for your state. Muslim residents may still check directly with their state Baitulmal counter or their hospital's Medical Social Work Officer, based on your answers.",
    verificationNote:
      "This route needs official verification directly with your state Baitulmal office or hospital Medical Social Work Officer, as no structured online scheme was found for this state.",
    finalDecisionBy: "State Zakat / Baitulmal Office",
    sourceLabel: "JAWHAR — state zakat directory",
    officialSourceUrl: "https://www.jawhar.gov.my/",
    missingInformation: [
      "Whether your state has an active medical aid scheme",
      "Contact details for your state Baitulmal office",
    ],
    documentsToPrepare: ["IC", "Medical report (bring when you visit in person)"],
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
