export const FORBIDDEN_TERMS = [
  "eligible",
  "eligibility",
  "approved",
  "approval",
  "guaranteed",
  "guarantee",
  "confirmed",
  "confirm",
  "claim now",
  "automatic approval",
  "we will get you aid",
  "qualify",
  "qualified",
  "you can get",
  "you will receive",
] as const;

export const SAFE_PHRASES = [
  "possible route",
  "may be relevant",
  "likely relevant",
  "not enough information",
  "needs official verification",
  "final decision by agency/provider",
  "based on your answers",
  "prepare these documents",
  "official source",
] as const;

export const DISCLAIMER_TEXT =
  "CareRytes shows possible routes based on your answers. The final decision always belongs to the official agency or provider.";

export function scanUnsafeTerms(text: string): string[] {
  const lower = text.toLowerCase();
  return FORBIDDEN_TERMS.filter((term) => lower.includes(term));
}
