import { NextResponse } from "next/server";
import { createSession } from "@/lib/memory";
import { generateCoachReply, SESSION_START_CUE } from "@/lib/coach";
import { describeCoachError } from "@/lib/apiError";

// Starts a new memory session (each app visit is its own session) and asks
// the coach for its opening line.
export async function POST() {
  try {
    const session = await createSession();
    try {
      const { reply } = await generateCoachReply(session.id, SESSION_START_CUE);
      return NextResponse.json({ sessionId: session.id, reply });
    } catch (error) {
      const { status, message } = describeCoachError(error);
      return NextResponse.json(
        { sessionId: session.id, error: message },
        { status },
      );
    }
  } catch (error) {
    const { status, message } = describeCoachError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
