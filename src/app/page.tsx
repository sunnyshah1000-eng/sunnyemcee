"use client";

import { useVoiceCoach, type CoachState } from "@/lib/useVoiceCoach";

const STATE_LABEL: Record<CoachState, string> = {
  unsupported: "Unsupported browser",
  "requesting-permission": "Waking up your mic…",
  "permission-denied": "Microphone access needed",
  connecting: "Connecting to your coach…",
  listening: "Listening",
  thinking: "Thinking",
  speaking: "Coach is speaking",
  ended: "See you next time",
  error: "Something went wrong",
};

function CoachOrb({ state }: { state: CoachState }) {
  const base =
    "h-40 w-40 rounded-full bg-accent flex items-center justify-center transition-all duration-500";

  if (state === "speaking") {
    return (
      <div className={base}>
        <div className="flex items-end gap-1.5 h-14">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="orb-speaking-bar w-2 rounded-full bg-accent-foreground"
              style={{
                height: "100%",
                animationDelay: `${i * 0.09}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (state === "thinking") {
    return <div className={`${base} orb-thinking opacity-80`} />;
  }

  if (state === "listening") {
    return <div className={`${base} orb-listening`} />;
  }

  return <div className={`${base} opacity-40 scale-90`} />;
}

export default function Home() {
  const { state, caption, errorMessage, retryPermission } = useVoiceCoach();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
      <CoachOrb state={state} />

      <div className="flex flex-col items-center gap-3">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-muted">
          {STATE_LABEL[state]}
        </p>

        {(state === "listening" || state === "speaking" || state === "thinking") &&
          caption && (
            <p className="max-w-md text-lg text-foreground/90">{caption}</p>
          )}

        {state === "ended" && (
          <div className="flex flex-col items-center gap-4">
            <p className="max-w-sm text-foreground/80">
              That was lovely — talk again whenever you&apos;re ready.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-full border border-line px-5 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
            >
              Start a new conversation
            </button>
          </div>
        )}

        {state === "permission-denied" && (
          <div className="flex flex-col items-center gap-4 max-w-sm">
            <p className="text-foreground/80">
              This coach talks with you out loud, so it needs microphone
              access. Click the lock icon in your address bar, allow the
              microphone, then try again.
            </p>
            <button
              type="button"
              onClick={retryPermission}
              className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 transition-opacity"
            >
              Try again
            </button>
          </div>
        )}

        {state === "unsupported" && (
          <p className="max-w-sm text-foreground/80">
            This prototype uses your browser&apos;s built-in speech features,
            which currently work best in Google Chrome on desktop. Please
            open this page in Chrome.
          </p>
        )}

        {state === "error" && (
          <div className="flex flex-col items-center gap-4 max-w-sm">
            <p className="text-foreground/80">{errorMessage}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-full border border-line px-5 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
            >
              Reload
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
