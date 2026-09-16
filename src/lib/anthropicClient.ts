import Anthropic from "@anthropic-ai/sdk";

// Resolves credentials from ANTHROPIC_API_KEY (or another supported env var).
// Never expose this client or the key to the browser — it must only be
// imported from server-side code (API routes).
export const anthropic = new Anthropic();

export const COACH_MODEL = "claude-opus-5";
