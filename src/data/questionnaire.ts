import type {
  HouseholdBand,
  SupportCheckInput,
  SupportNeed,
  TreatmentFacility,
  YesNoNotSure,
} from "@/lib/engine";

export type QuestionOption = {
  value: string;
  label: string;
};

export type QuestionId =
  | "supportNeed"
  | "householdBand"
  | "treatmentFacility"
  | "kwspMember"
  | "hasInsurance"
  | "includeNgoZakat"
  | "locationState";

export type Question = {
  id: QuestionId;
  title: string;
  helperText?: string;
  options: QuestionOption[];
  optional?: boolean;
};

export const questionnaire: Question[] = [
  {
    id: "supportNeed",
    title: "What kind of support are you looking into?",
    helperText: "Choose the option closest to your situation.",
    options: [
      { value: "treatment-cost", label: "Help with treatment costs" },
      { value: "transport", label: "Help with transport to treatment" },
      { value: "medicine-equipment", label: "Help with medicine or equipment" },
      { value: "general", label: "Not sure yet / general support" },
    ],
  },
  {
    id: "householdBand",
    title: "Which household income band are you in?",
    helperText: "This helps narrow down which routes may be relevant.",
    options: [
      { value: "b40", label: "B40" },
      { value: "m40", label: "M40" },
      { value: "unknown", label: "Not sure" },
    ],
  },
  {
    id: "treatmentFacility",
    title: "Where is treatment mainly happening?",
    options: [
      { value: "government", label: "Government hospital" },
      { value: "private", label: "Private hospital" },
      { value: "both", label: "Both" },
      { value: "not-sure", label: "Not sure" },
    ],
  },
  {
    id: "kwspMember",
    title: "Are you a KWSP (EPF) member?",
    helperText: "Optional. This helps us show KWSP withdrawal routes more accurately.",
    optional: true,
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "not-sure", label: "Not sure" },
    ],
  },
  {
    id: "hasInsurance",
    title: "Do you have insurance or takaful coverage?",
    helperText: "Optional. This helps us show the insurance/takaful claim checklist only if it applies to you.",
    optional: true,
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "not-sure", label: "Not sure" },
    ],
  },
  {
    id: "includeNgoZakat",
    title: "Would you like to include NGO or zakat/baitulmal options?",
    helperText: "Optional. These routes may involve religious or charitable assistance criteria.",
    optional: true,
    options: [
      { value: "yes", label: "Yes, include them" },
      { value: "no", label: "No, skip these" },
      { value: "not-sure", label: "Not sure yet" },
    ],
  },
  {
    id: "locationState",
    title: "Which state are you in?",
    helperText: "Optional. Some routes may vary by state.",
    optional: true,
    options: [
      { value: "johor", label: "Johor" },
      { value: "kedah", label: "Kedah" },
      { value: "kelantan", label: "Kelantan" },
      { value: "melaka", label: "Melaka" },
      { value: "negeri-sembilan", label: "Negeri Sembilan" },
      { value: "pahang", label: "Pahang" },
      { value: "penang", label: "Penang" },
      { value: "perak", label: "Perak" },
      { value: "perlis", label: "Perlis" },
      { value: "sabah", label: "Sabah" },
      { value: "sarawak", label: "Sarawak" },
      { value: "selangor", label: "Selangor" },
      { value: "terengganu", label: "Terengganu" },
      { value: "kuala-lumpur", label: "Kuala Lumpur" },
      { value: "labuan", label: "Labuan" },
      { value: "putrajaya", label: "Putrajaya" },
    ],
  },
];

export type QuestionnaireAnswers = Partial<{
  supportNeed: SupportNeed;
  householdBand: HouseholdBand;
  treatmentFacility: TreatmentFacility;
  kwspMember: YesNoNotSure;
  hasInsurance: YesNoNotSure;
  includeNgoZakat: YesNoNotSure;
  locationState: string;
}>;

export function toSupportCheckInput(
  answers: QuestionnaireAnswers
): SupportCheckInput | null {
  if (!answers.supportNeed || !answers.householdBand || !answers.treatmentFacility) {
    return null;
  }

  return {
    supportNeed: answers.supportNeed,
    householdBand: answers.householdBand,
    treatmentFacility: answers.treatmentFacility,
    kwspMember: answers.kwspMember,
    hasInsurance: answers.hasInsurance,
    includeNgoZakat: answers.includeNgoZakat,
    locationState: answers.locationState,
  };
}
