"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  questionnaire,
  toSupportCheckInput,
  type QuestionnaireAnswers,
} from "@/data/questionnaire";
import { getRouteMatches, type MatchLabel, type RouteMatch } from "@/lib/engine";
import { DISCLAIMER_TEXT } from "@/lib/safety";
import { RYTSAssistantBar } from "@/components/RYTSAssistantBar";

export default function CancerSupportPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({});
  const [assistantBarHeight, setAssistantBarHeight] = useState(96);

  const isReviewStep = stepIndex === questionnaire.length;
  const currentQuestion = isReviewStep ? null : questionnaire[stepIndex];
  const selectedAnswerValue = currentQuestion
    ? answers[currentQuestion.id]
    : undefined;

  const supportCheckInput = useMemo(
    () => toSupportCheckInput(answers),
    [answers]
  );
  const routeMatches = useMemo(
    () => (supportCheckInput ? getRouteMatches(supportCheckInput) : []),
    [supportCheckInput]
  );

  function handleSelect(value: string) {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }) as QuestionnaireAnswers);
  }

  function handleNext() {
    setStepIndex((prev) => Math.min(questionnaire.length, prev + 1));
  }

  function handleBack() {
    setStepIndex((prev) => Math.max(0, prev - 1));
  }

  function handleRestart() {
    setAnswers({});
    setStepIndex(0);
  }

  function handleAssistantCommand(command: string) {
    const cmd = command.toLowerCase().trim();
    if (cmd === "start") {
      setAnswers({});
      setStepIndex(0);
    } else if (cmd === "home") {
      router.push("/");
    } else if (cmd === "restart") {
      setAnswers({});
      setStepIndex(0);
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="border-b border-border px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-teal-deep"
        >
          CareRytes
        </Link>
        <p className="mt-1 text-sm text-text-muted">RYTS Assistant</p>
        <p className="text-xs text-text-muted">Guided support check</p>
      </header>

      {!isReviewStep && (
        <div
          className="h-1 w-full bg-border-soft"
          role="progressbar"
          aria-valuenow={stepIndex + 1}
          aria-valuemin={1}
          aria-valuemax={questionnaire.length}
          aria-label={`Question ${stepIndex + 1} of ${questionnaire.length}`}
        >
          <div
            className="h-1 bg-teal transition-all"
            style={{
              width: `${((stepIndex + 1) / questionnaire.length) * 100}%`,
            }}
          />
        </div>
      )}

      <main
        className="flex flex-1 flex-col overflow-y-auto px-4 py-6 sm:px-6 sm:py-8"
        style={{ paddingBottom: assistantBarHeight + 16 }}
      >
        <div className="mx-auto flex w-full max-w-md flex-col gap-6 sm:max-w-lg">
          {/* Questionnaire Question */}
          {!isReviewStep && currentQuestion && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {currentQuestion.title}
                </h2>
                {currentQuestion.helperText && (
                  <p className="mt-2 text-sm text-text-muted">
                    {currentQuestion.helperText}
                  </p>
                )}
              </div>

              {/* Answer Options */}
              <fieldset className="flex flex-col gap-2">
                <legend className="sr-only">{currentQuestion.title}</legend>
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedAnswerValue === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => handleSelect(option.value)}
                      className={`flex min-h-12 items-center rounded-lg border-2 px-4 py-3 text-sm font-medium text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-deep cursor-pointer ${
                        isSelected
                          ? "border-teal bg-teal-soft text-foreground"
                          : "border-border bg-surface text-foreground hover:bg-surface-subtle"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </fieldset>

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={stepIndex === 0}
                  className="flex-1 h-12 rounded-lg border border-border bg-surface px-4 font-semibold text-foreground transition-colors hover:bg-surface-subtle disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-deep"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    selectedAnswerValue === undefined && !currentQuestion.optional
                  }
                  className="flex-1 h-12 rounded-lg border border-teal bg-teal px-4 font-semibold text-white transition-colors hover:bg-teal-deep disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-deep"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Results Screen */}
          {isReviewStep && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Your possible routes
                </h2>
                <p className="mt-2 text-sm text-text-muted">
                  Based on your answers, here are the possible routes that may be relevant. All routes need official verification from the agency or provider.
                </p>
              </div>

              {/* Disclaimer */}
              <div className="rounded-2xl border border-info-border bg-info-bg p-4">
                <p className="text-sm leading-6 text-info-text">
                  {DISCLAIMER_TEXT}
                </p>
              </div>

              {/* Routes or empty state */}
              {routeMatches.length > 0 ? (
                <div
                  className="flex flex-col gap-4"
                  role="region"
                  aria-label="Possible routes"
                >
                  {routeMatches.map((match) => (
                    <RouteCard key={match.route.id} match={match} />
                  ))}
                </div>
              ) : (
                <div
                  className="rounded-2xl border border-border bg-surface-subtle p-5 text-center"
                  role="status"
                  aria-live="polite"
                >
                  <p className="text-base font-semibold text-foreground">
                    Not enough information to show a clear possible route yet.
                  </p>
                  <p className="mt-2 text-sm text-text-muted">
                    Try adjusting your answers or check official sources directly.
                  </p>
                </div>
              )}

              {/* Restart button */}
              <button
                type="button"
                onClick={handleRestart}
                className="flex h-12 w-full items-center justify-center rounded-xl border border-teal bg-teal px-5 text-base font-semibold text-white transition-colors hover:bg-teal-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-deep"
              >
                Start another check
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Floating RYTS Assistant Bar */}
      <RYTSAssistantBar
        currentStep={stepIndex}
        isReviewStep={isReviewStep}
        onCommand={handleAssistantCommand}
        onHeightChange={setAssistantBarHeight}
      />
    </div>
  );
}

const MATCH_LABEL_STYLES: Record<MatchLabel, string> = {
  "Likely relevant": "border-success-border bg-success-bg text-success-text",
  "Maybe relevant": "border-info-border bg-info-bg text-info-text",
  "Not enough information": "border-border bg-surface-subtle text-text-muted",
  "Needs official verification": "border-warning-border bg-warning-bg text-warning-text",
};

function RouteCard({ match }: { match: RouteMatch }) {
  const { route, matchLabel, reason } = match;
  return (
    <article
      className="rounded-2xl border border-border bg-surface p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
      aria-label={`${route.title} from ${route.provider} — ${matchLabel}`}
    >
      <span
        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${MATCH_LABEL_STYLES[matchLabel]}`}
      >
        {matchLabel}
      </span>

      <h2 className="mt-3 text-lg font-bold text-foreground">{route.title}</h2>
      <p className="mt-1 text-sm text-text-muted">{route.provider}</p>
      <p className="mt-4 text-sm leading-6 text-text-secondary">
        {route.routeSummary}
      </p>

      <p className="mt-4 text-sm leading-6 text-text-secondary">{reason}</p>

      <p className="mt-4 text-sm leading-6 text-warning-text">
        {route.verificationNote}
      </p>

      {route.missingInformation.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-foreground">
            Missing information
          </h3>
          <ul className="mt-2 list-disc pl-5 text-sm text-text-secondary">
            {route.missingInformation.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-foreground">
          Documents to prepare
        </h3>
        <ul className="mt-2 list-disc pl-5 text-sm text-text-secondary">
          {route.documentsToPrepare.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-5 flex flex-col gap-2 border-t border-border-soft pt-4 text-sm text-text-muted">
        <span>Final decision by: {route.finalDecisionBy}</span>
        <a
          href={route.officialSourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-teal underline underline-offset-2 hover:text-teal-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-deep rounded"
          aria-label={`${route.sourceLabel} (opens in new window)`}
        >
          {route.sourceLabel}
        </a>
      </div>
    </article>
  );
}
