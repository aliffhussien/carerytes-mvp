"use client";

import { useState, useRef, useEffect } from "react";
import { ChatCircleDots, Microphone, PaperPlaneTilt } from "@phosphor-icons/react";

type RYTSAssistantBarProps = {
  currentStep: number;
  isReviewStep: boolean;
  onCommand: (command: string) => void;
  onHeightChange?: (height: number) => void;
};

export function RYTSAssistantBar({
  currentStep,
  isReviewStep,
  onCommand,
  onHeightChange,
}: RYTSAssistantBarProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { type: "user" | "assistant"; text: string }[]
  >([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const getContextMessage = (): string => {
    if (isReviewStep) {
      return "Based on your answers, these possible routes may be relevant and need official verification from the official agency or provider.";
    }
    if (currentStep === 0) {
      return "Welcome to CareRytes. I can help you explore possible support routes based on your situation. The final decision is always made by the official agency or provider.";
    }
    return "Continue answering the questions to find possible routes. You can type 'start' to restart, 'home' to go back to the main page, or ask me about the current step.";
  };

  function handleSend() {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setInput("");

    const command = userMessage.toLowerCase();
    if (
      command === "start" ||
      command === "home" ||
      command === "restart"
    ) {
      onCommand(command);
      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          text:
            command === "home"
              ? "Navigating to home page."
              : "Restarting the support check.",
        },
      ]);
      return;
    }

    const assistantResponse = getContextMessage();
    setMessages((prev) => [...prev, { type: "assistant", text: assistantResponse }]);
  }

  function handleMicClick() {
    setMessages((prev) => [
      ...prev,
      {
        type: "assistant",
        text: "Voice input will help you speak your answers in a later version. For now, please type your response or use the questionnaire options.",
      },
    ]);
  }

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Report height directly whenever something that changes it happens
  // (expand/collapse, or the message list growing) — measuring after React
  // has committed the new layout is more reliable here than ResizeObserver.
  useEffect(() => {
    if (!onHeightChange || !barRef.current) return;
    onHeightChange(barRef.current.getBoundingClientRect().height);
  }, [isExpanded, messages.length, onHeightChange]);

  return (
    <div
      ref={barRef}
      className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg"
    >
      {/* Expanded chat area */}
      {isExpanded && (
        <div className="max-h-64 overflow-y-auto px-4 py-3 flex flex-col gap-2">
          {messages.length === 0 ? (
            <p className="text-sm text-text-muted italic">
              {getContextMessage()}
            </p>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs rounded-lg px-3 py-2 text-sm leading-5 ${
                    msg.type === "user"
                      ? "bg-teal text-white"
                      : "bg-surface-subtle text-foreground"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Input bar */}
      <div className="px-4 py-3 flex items-center gap-2 bg-background">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-shrink-0 h-10 w-10 rounded-lg border border-border bg-surface flex items-center justify-center text-teal hover:bg-surface-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-deep"
          aria-label="Toggle RYTS Assistant"
          title="Ask RYTS Assistant"
        >
          <ChatCircleDots size={20} weight="regular" />
        </button>

        {isExpanded && (
          <>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              placeholder="Ask about this step…"
              className="flex-1 h-10 rounded-lg border border-border bg-surface px-3 text-sm placeholder:text-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-deep"
            />

            <button
              type="button"
              onClick={handleMicClick}
              className="flex-shrink-0 h-10 w-10 rounded-lg border border-border bg-surface flex items-center justify-center text-teal hover:bg-surface-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-deep"
              aria-label="Voice input (coming soon)"
              title="Voice input coming soon"
            >
              <Microphone size={20} weight="regular" />
            </button>

            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim()}
              className="flex-shrink-0 h-10 w-10 rounded-lg border border-teal bg-teal flex items-center justify-center text-white hover:bg-teal-deep disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-deep"
              aria-label="Send message"
            >
              <PaperPlaneTilt size={20} weight="regular" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
