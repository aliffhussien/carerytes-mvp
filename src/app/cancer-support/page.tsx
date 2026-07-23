"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  questionnaire,
  toSupportCheckInput,
  type QuestionId,
  type QuestionnaireAnswers,
} from "@/data/questionnaire";
import { getPossibleRoutes } from "@/lib/engine";
import { DISCLAIMER_TEXT } from "@/lib/safety";
import type { SupportRoute } from "@/data/mockRoutes";

export default function CancerSupportPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({});

  const isReviewStep = stepIndex === questionnaire.length;
  const currentQuestion = isReviewStep ? null : questionnaire[stepIndex];

  const supportCheckInput = useMemo(
    () => toSupportCheckInput(answers),
    [answers]
  );
  const possibleRoutes = useMemo(
    () => (supportCheckInput ? getPossibleRoutes(supportCheckInput) : []),
    [supportCheckInput]
  );

  function handleSelect(questionId: QuestionId, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }) as QuestionnaireAnswers);
  }

  function handleBack() {
    setStepIndex((prev) => Math.max(0, prev - 1));
  }

  function handleNext() {
    setStepIndex((prev) => Math.min(questionnaire.length, prev + 1));
  }

  function handleRestart() {
    setAnswers({});
    setStepIndex(0);
  }

  const canContinue = Boolean(
    currentQuestion &&
      (currentQuestion.optional || answers[currentQuestion.id])
  );

  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-teal-deep"
        >
          CareRytes
        </Link>
        {!isReviewStep && (
          <span className="text-sm text-text-muted">
            Question {stepIndex + 1} of {questionnaire.length}
          </span>
        )}
      </header>

      {!isReviewStep && (
        <div
          className="h-1 w-full bg-border-soft"
          role="progressbar"
          aria-valuenow={stepIndex + 1}
          aria-valuemin={1}
          aria-valuemax={questionnaire.length + 1}
          aria-label={`Question ${stepIndex + 1} of ${questionnaire.length}`}
        >
          <div
            className="h-1 bg-teal transition-all"
            style={{
              width: `${((stepIndex + 1) / (questionnaire.length + 1)) * 100}%`,
            }}
          />
        </div>
      )}

      <main className="flex flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto flex w-full max-w-md flex-col gap-6 sm:max-w-lg">
          {currentQuestion ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h2
                  id="question-title"
                  className="text-xl font-bold text-foreground sm:text-2xl"
                >
                  {currentQuestion.title}
                </h2>
                {currentQuestion.helperText && (
                  <p className="text-sm text-text-muted">
                    {currentQuestion.helperText}
                  </p>
                )}
              </div>

              <fieldset className="flex flex-col gap-4">
                <legend className="sr-only">{currentQuestion.title}</legend>
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    onClick={() =>
                      handleSelect(currentQuestion.id, option.value)
                    }
                    aria-checked={answers[currentQuestion.id] === option.value}
                    className={`flex min-h-12 items-center rounded-xl border px-4 py-3 text-base font-medium text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-deep ${
                      answers[currentQuestion.id] === option.value
                        ? "border-teal bg-teal-soft text-foreground"
                        : "border-border bg-surface text-foreground hover:bg-surface-subtle"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </fieldset>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                Possible routes for your situation
              </h1>

              <div className="rounded-2xl border border-info-border bg-info-bg p-4">
                <p className="text-sm leading-6 text-info-text">
                  {DISCLAIMER_TEXT}
                </p>
              </div>

              {possibleRoutes.length > 0 ? (
                <div className="flex flex-col gap-4" role="region" aria-label="Possible routes">
                  {possibleRoutes.map((route) => (
                    <RouteCard key={route.id} route={route} />
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
                    Try adjusting your answers or check official sources
                    directly.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleRestart}
                className="flex h-12 w-full items-center justify-center rounded-xl border border-border bg-surface px-5 text-base font-semibold text-foreground transition-colors hover:bg-surface-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-deep"
              >
                Start another check
              </button>
            </div>
          )}
        </div>
      </main>

      {!isReviewStep && (
        <div className="sticky bottom-0 border-t border-border bg-surface px-4 py-4 sm:px-6">
          <div className="mx-auto flex w-full max-w-md gap-3 sm:max-w-lg">
            {stepIndex > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex h-12 flex-1 items-center justify-center rounded-xl border border-border bg-surface px-5 text-base font-semibold text-foreground transition-colors hover:bg-surface-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-deep"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={!canContinue}
              className="flex h-12 flex-1 items-center justify-center rounded-xl bg-teal px-5 text-base font-semibold text-white transition-colors hover:bg-teal-deep disabled:cursor-not-allowed disabled:bg-border disabled:text-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-deep"
            >
              {stepIndex === questionnaire.length - 1
                ? "Find possible routes"
                : "Continue"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function RouteCard({ route }: { route: SupportRoute }) {
  return (
    <article
      className="rounded-2xl border border-border bg-surface p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
      aria-label={`${route.title} from ${route.provider}`}
    >
      <h2 className="text-lg font-bold text-foreground">{route.title}</h2>
      <p className="mt-1 text-sm text-text-muted">{route.provider}</p>
      <p className="mt-4 text-sm leading-6 text-text-secondary">
        {route.routeSummary}
      </p>

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
