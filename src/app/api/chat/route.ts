import { NextResponse } from "next/server";
import { generateCoachReply } from "@/lib/coach";
import { describeCoachError } from "@/lib/apiError";

const MAX_MESSAGE_LENGTH = 4000;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { sessionId, message } = (body ?? {}) as {
    sessionId?: unknown;
    message?: unknown;
  };

  if (typeof sessionId !== "string" || sessionId.length === 0) {
    return NextResponse.json({ error: "Missing sessionId." }, { status: 400 });
  }
  if (typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json({ error: "Missing message." }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: "Message is too long." }, { status: 400 });
  }

  try {
    const { reply, ended } = await generateCoachReply(sessionId, message);
    return NextResponse.json({ reply, ended });
  } catch (error) {
    const { status, message: errorMessage } = describeCoachError(error);
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
