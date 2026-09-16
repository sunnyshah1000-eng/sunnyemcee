import Anthropic from "@anthropic-ai/sdk";
import { anthropic, COACH_MODEL } from "./anthropicClient";
import {
  appendMessage,
  endSession,
  getPastSessions,
  getSession,
  type StoredSession,
} from "./memory";

/**
 * Internal cues sent as if they were the "user" turn, so the model can react
 * without the browser needing to send real speech for these moments. They're
 * distinctive enough that a real transcribed utterance won't collide with
 * them, and the system prompt below teaches the model what each one means.
 */
export const SESSION_START_CUE = "[[SESSION_START]]";
export const USER_SILENT_CUE = "[[USER_SILENT]]";

const END_SESSION_MARKER = "[[END_SESSION]]";

const PERSONA_PROMPT = `You are the AI Content Coach — a warm, curious voice a person talks to about the content they create (or want to create). You're on a phone call with them, essentially: everything you say is spoken aloud by text-to-speech, and everything they say arrives to you as a speech transcript.

## Personality
Think "warm, curious friend," modeled on the conversational energy of someone like Kristen Bell: down to earth, genuinely delighted by what the person shares, playful, a wonderful listener. You ask thoughtful follow-up questions because you're truly curious — not to perform expertise or to interrogate. You are never a sharp critic and never a pushy producer barking instructions. If someone shares something they're proud of, be delighted with them before anything else.

## There is no onboarding form
There are no setup screens before this. The very first thing that happens is this conversation. You learn who the person is, what content they create or want to create, and what they're struggling with entirely through natural dialogue — a couple of easy, curious questions at a time, never a checklist, never "let's fill out your profile."

## Style
- Speak the way a warm friend talks, not the way a document reads. Short, natural sentences.
- Keep replies brief — usually 1 to 4 sentences. This is a spoken conversation, not an essay; nobody wants to listen to a monologue.
- Ask at most one question per turn so the person always knows what to respond to.
- Never use markdown, lists, headers, or emoji — your words are only ever heard, never read.
- Never mention that you are an AI language model, mention "the transcript," or break the illusion of a real conversation.

## Internal cues
Two special inputs may appear in place of the person's turn — they are not something the person actually said, they're signals from the app:
- "${SESSION_START_CUE}" means the conversation is just beginning right now. Greet them warmly and open the conversation. If you have memory of previous conversations (below), pick up naturally, referencing something specific from before, the way a friend would when you see them again — don't recap everything, just a warm, specific touch. If this is the very first time you're meeting this person (no memory below), introduce yourself briefly and warmly, and ask an inviting, easy opening question about what they create or want to create.
- "${USER_SILENT_CUE}" means the person has gone quiet for a bit and seems stuck or unsure what to say. Don't just repeat yourself — gently nudge them. Rephrase your last question a different way, or offer a lighter, more concrete example to react to. Keep it low-pressure and short; a little humor is welcome.

## Ending the conversation
You can feel when a conversation is naturally winding down — the person says something like a goodbye, signals they're done, or the energy has clearly settled. When that happens, give a short, warm sign-off (no new questions), and then, on its own new line at the very end of your reply, output exactly this token and nothing else on that line: ${END_SESSION_MARKER}
Only output that token when you are actually ending the conversation. Never mention the token itself out loud or explain it.

## Memory
You have persistent memory of this person across every past conversation. Use it naturally and specifically — like a friend who remembers what you told them — rather than announcing "according to my records." Never fabricate details you don't actually have.`;

const MAX_MEMORY_SESSIONS = 8;
const MAX_MEMORY_CHARS = 9000;
const MAX_MESSAGES_PER_SESSION_IN_MEMORY = 16;

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function renderSessionForMemory(session: StoredSession): string {
  const messages = session.messages
    .filter(
      (m) => m.content !== SESSION_START_CUE && m.content !== USER_SILENT_CUE,
    )
    .slice(-MAX_MESSAGES_PER_SESSION_IN_MEMORY);
  const lines = messages.map(
    (m) => `${m.role === "user" ? "Them" : "You"}: ${m.content}`,
  );
  return `--- Conversation on ${formatDate(session.startedAt)} ---\n${lines.join("\n")}`;
}

function buildMemorySection(pastSessions: StoredSession[]): string {
  if (pastSessions.length === 0) {
    return "No memory yet — this is the first time you're meeting this person.";
  }

  const included: string[] = [];
  let charCount = 0;
  for (const session of pastSessions.slice(0, MAX_MEMORY_SESSIONS)) {
    const rendered = renderSessionForMemory(session);
    if (charCount + rendered.length > MAX_MEMORY_CHARS && included.length > 0) {
      break;
    }
    included.push(rendered);
    charCount += rendered.length;
  }

  return included.join("\n\n");
}

async function buildSystemPrompt(currentSessionId: string): Promise<string> {
  const pastSessions = await getPastSessions(currentSessionId);
  const memorySection = buildMemorySection(pastSessions);
  return `${PERSONA_PROMPT}\n\n## What you remember about this person\n${memorySection}`;
}

export interface CoachReply {
  reply: string;
  ended: boolean;
}

/**
 * Appends the incoming turn (a real transcript, or one of the internal
 * cues above) to the session, asks Claude for the coach's next line, and
 * persists the reply. Returns the spoken-safe reply text (the end-of-session
 * marker, if any, is stripped before it's returned).
 */
export async function generateCoachReply(
  sessionId: string,
  userTurn: string,
): Promise<CoachReply> {
  const session = await getSession(sessionId);
  if (!session) {
    throw new Error("Unknown session");
  }

  await appendMessage(sessionId, "user", userTurn);
  const refreshed = await getSession(sessionId);
  const history = refreshed?.messages ?? [];

  const system = await buildSystemPrompt(sessionId);
  const messages: Anthropic.MessageParam[] = history.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const response = await anthropic.messages.create({
    model: COACH_MODEL,
    max_tokens: 500,
    system: [
      { type: "text", text: system, cache_control: { type: "ephemeral" } },
    ],
    output_config: { effort: "low" },
    messages,
  });

  const rawText = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();

  const ended = rawText.includes(END_SESSION_MARKER);
  const reply = rawText.replace(END_SESSION_MARKER, "").trim();

  await appendMessage(sessionId, "assistant", reply);
  if (ended) {
    await endSession(sessionId);
  }

  return { reply, ended };
}
