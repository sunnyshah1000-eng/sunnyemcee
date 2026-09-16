import Anthropic from "@anthropic-ai/sdk";

/** Maps an error from a coach reply attempt to a status + friendly message. */
export function describeCoachError(error: unknown): {
  status: number;
  message: string;
} {
  if (
    error instanceof Anthropic.AuthenticationError ||
    (error instanceof Error && /authentication|api.?key/i.test(error.message))
  ) {
    return {
      status: 500,
      message:
        "The coach can't reach Claude right now (server isn't configured with a valid API key).",
    };
  }
  if (error instanceof Anthropic.RateLimitError) {
    return {
      status: 429,
      message: "The coach is a little overwhelmed right now — give it a moment and try again.",
    };
  }
  if (error instanceof Anthropic.APIError) {
    return {
      status: 502,
      message: "The coach had trouble thinking of a reply just now.",
    };
  }
  if (error instanceof Error && error.message === "Unknown session") {
    return { status: 404, message: "That conversation session wasn't found." };
  }
  return { status: 500, message: "Something went wrong on the coach's end." };
}
