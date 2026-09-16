"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CoachState =
  | "unsupported"
  | "requesting-permission"
  | "permission-denied"
  | "connecting"
  | "listening"
  | "thinking"
  | "speaking"
  | "ended"
  | "error";

interface UseVoiceCoachResult {
  state: CoachState;
  caption: string;
  errorMessage: string | null;
  retryPermission: () => void;
}

const SILENCE_NUDGE_MS = 14000;
const FINAL_TRANSCRIPT_DEBOUNCE_MS = 800;
const SILENT_CUE = "[[USER_SILENT]]";

function getRecognitionConstructor(): (new () => SpeechRecognition) | null {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;
  const english = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  const pool = english.length > 0 ? english : voices;
  const preferredNames = ["Samantha", "Google US English", "Zira", "Aria"];
  for (const name of preferredNames) {
    const match = pool.find((v) => v.name.includes(name));
    if (match) return match;
  }
  return pool[0];
}

export function useVoiceCoach(): UseVoiceCoachResult {
  const [state, setState] = useState<CoachState>("requesting-permission");
  const [caption, setCaption] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sessionIdRef = useRef<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const stateRef = useRef<CoachState>(state);
  const shouldListenRef = useRef(false);
  const interruptedRef = useRef(false);
  const pendingFinalsRef = useRef<string[]>([]);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  const setStateBoth = useCallback((next: CoachState) => {
    stateRef.current = next;
    setState(next);
  }, []);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const clearDebounceTimer = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  // Forward declarations via refs so callbacks below can call each other
  // without fighting effect dependency ordering.
  const sendTurnRef = useRef<(text: string) => Promise<void>>(async () => {});
  const armSilenceTimerRef = useRef<() => void>(() => {});

  const speak = useCallback(
    (text: string, onDone: () => void) => {
      if (!text) {
        onDone();
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = pickVoice(voicesRef.current);
      if (voice) utterance.voice = voice;
      utterance.rate = 1.02;
      utterance.pitch = 1.05;

      utterance.onstart = () => {
        setStateBoth("speaking");
        setCaption(text);
      };
      utterance.onend = () => {
        if (interruptedRef.current) {
          interruptedRef.current = false;
          return;
        }
        onDone();
      };
      utterance.onerror = () => {
        if (interruptedRef.current) {
          interruptedRef.current = false;
          return;
        }
        onDone();
      };

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    },
    [setStateBoth],
  );

  const armSilenceTimer = useCallback(() => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      if (stateRef.current === "listening") {
        sendTurnRef.current(SILENT_CUE);
      }
    }, SILENCE_NUDGE_MS);
  }, [clearSilenceTimer]);
  useEffect(() => {
    armSilenceTimerRef.current = armSilenceTimer;
  }, [armSilenceTimer]);

  const enterListening = useCallback(() => {
    setCaption("");
    setStateBoth("listening");
    armSilenceTimerRef.current();
  }, [setStateBoth]);

  const sendTurn = useCallback(
    async (text: string) => {
      if (!sessionIdRef.current) return;
      clearSilenceTimer();
      setStateBoth("thinking");
      if (text !== SILENT_CUE) setCaption(text);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sessionIdRef.current, message: text }),
        });
        const data = await res.json();
        if (!res.ok) {
          setErrorMessage(data.error ?? "The coach had trouble replying.");
          setStateBoth("error");
          return;
        }
        speak(data.reply, () => {
          if (data.ended) {
            shouldListenRef.current = false;
            recognitionRef.current?.stop();
            setStateBoth("ended");
          } else {
            enterListening();
          }
        });
      } catch {
        setErrorMessage("Couldn't reach the coach — check your connection.");
        setStateBoth("error");
      }
    },
    [clearSilenceTimer, enterListening, setStateBoth, speak],
  );
  useEffect(() => {
    sendTurnRef.current = sendTurn;
  }, [sendTurn]);

  const submitFinalTranscript = useCallback(() => {
    const text = pendingFinalsRef.current.join(" ").trim();
    pendingFinalsRef.current = [];
    if (text.length === 0) return;
    void sendTurnRef.current(text);
  }, []);

  const handleResult = useCallback(
    (event: SpeechRecognitionEvent) => {
      // Barge-in: any speech detected while the coach is talking interrupts it.
      if (stateRef.current === "speaking") {
        let heard = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          heard += event.results[i][0]?.transcript ?? "";
        }
        if (heard.trim().length < 2) return;
        interruptedRef.current = true;
        window.speechSynthesis.cancel();
        enterListening();
      }

      if (stateRef.current !== "listening") return;

      armSilenceTimerRef.current();

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0]?.transcript ?? "";
        if (result.isFinal) {
          pendingFinalsRef.current.push(transcript);
          clearDebounceTimer();
          debounceTimerRef.current = setTimeout(
            submitFinalTranscript,
            FINAL_TRANSCRIPT_DEBOUNCE_MS,
          );
        } else {
          setCaption(transcript);
        }
      }
    },
    [clearDebounceTimer, enterListening, submitFinalTranscript],
  );

  const beginRef = useRef<() => void>(() => {});

  const retryPermission = useCallback(() => {
    setErrorMessage(null);
    setStateBoth("requesting-permission");
    shouldListenRef.current = true;
    beginRef.current();
  }, [setStateBoth]);

  useEffect(() => {
    let cancelled = false;

    // Everything lives inside this async function (rather than directly in
    // the effect body) so state updates happen across an async boundary
    // instead of synchronously during the effect's commit.
    const run = async () => {
      const Ctor = getRecognitionConstructor();
      if (!Ctor || !("speechSynthesis" in window)) {
        setStateBoth("unsupported");
        return;
      }

      const loadVoices = () => {
        voicesRef.current = window.speechSynthesis.getVoices();
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;

      const recognition = new Ctor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognitionRef.current = recognition;
      shouldListenRef.current = true;

      recognition.onresult = handleResult;

      recognition.onerror = (event) => {
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          shouldListenRef.current = false;
          setStateBoth("permission-denied");
        }
        // Other errors (no-speech, network, aborted) are recovered by onend's restart.
      };

      recognition.onend = () => {
        if (!shouldListenRef.current) return;
        try {
          recognition.start();
        } catch {
          // A start() call can race a still-stopping recognizer; a later
          // onend will retry.
        }
      };

      const start = async () => {
        try {
          recognition.start();
        } catch {
          setStateBoth("permission-denied");
          return;
        }

        // A retry after a permission grant: the session and opening line
        // already happened, so just resume listening.
        if (sessionIdRef.current) {
          enterListening();
          return;
        }

        setStateBoth("connecting");
        try {
          const res = await fetch("/api/session", { method: "POST" });
          const data = await res.json();
          if (cancelled || stateRef.current === "permission-denied") return;
          sessionIdRef.current = data.sessionId ?? null;
          if (!res.ok || !sessionIdRef.current) {
            setErrorMessage(data.error ?? "Couldn't start a session with the coach.");
            setStateBoth("error");
            return;
          }
          speak(data.reply ?? "", () => enterListening());
        } catch {
          if (!cancelled) {
            setErrorMessage("Couldn't reach the coach — check your connection.");
            setStateBoth("error");
          }
        }
      };

      beginRef.current = start;
      await start();
    };

    void run();

    return () => {
      cancelled = true;
      shouldListenRef.current = false;
      clearSilenceTimer();
      clearDebounceTimer();
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
      const recognition = recognitionRef.current;
      if (recognition) {
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        recognition.abort();
      }
    };
    // Intentionally run once on mount: a fresh session per app visit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { state, caption, errorMessage, retryPermission };
}
