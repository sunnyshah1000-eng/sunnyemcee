import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type ChatRole = "user" | "assistant";

export interface StoredMessage {
  role: ChatRole;
  content: string;
  at: string;
}

export interface StoredSession {
  id: string;
  startedAt: string;
  endedAt: string | null;
  messages: StoredMessage[];
  /**
   * Reserved for a future summarization pass so old sessions can be
   * condensed without changing this shape. Unused for now.
   */
  summary: string | null;
}

interface MemoryStore {
  sessions: StoredSession[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "memory.json");

// Serializes reads/writes so concurrent requests in the same process can't
// interleave and corrupt the JSON file.
let queue: Promise<unknown> = Promise.resolve();

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const result = queue.then(task);
  queue = result.catch(() => undefined);
  return result;
}

// Kept in memory so the store still works on hosts with a read-only or
// ephemeral filesystem (e.g. serverless functions) — disk is a best-effort
// backup for local dev, not the source of truth.
let cachedStore: MemoryStore | null = null;

async function loadStore(): Promise<MemoryStore> {
  if (cachedStore) return cachedStore;
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as MemoryStore;
    cachedStore = Array.isArray(parsed.sessions) ? parsed : { sessions: [] };
  } catch {
    cachedStore = { sessions: [] };
  }
  return cachedStore;
}

async function saveStore(store: MemoryStore): Promise<void> {
  cachedStore = store;
  try {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch {
    // Filesystem isn't writable here — memory still lives in cachedStore
    // for the lifetime of this process, just not persisted to disk.
  }
}

export function createSession(): Promise<StoredSession> {
  return enqueue(async () => {
    const store = await loadStore();
    const session: StoredSession = {
      id: randomUUID(),
      startedAt: new Date().toISOString(),
      endedAt: null,
      messages: [],
      summary: null,
    };
    store.sessions.push(session);
    await saveStore(store);
    return session;
  });
}

export function appendMessage(
  sessionId: string,
  role: ChatRole,
  content: string,
): Promise<void> {
  return enqueue(async () => {
    const store = await loadStore();
    const session = store.sessions.find((s) => s.id === sessionId);
    if (!session) return;
    session.messages.push({ role, content, at: new Date().toISOString() });
    await saveStore(store);
  });
}

export function endSession(sessionId: string): Promise<void> {
  return enqueue(async () => {
    const store = await loadStore();
    const session = store.sessions.find((s) => s.id === sessionId);
    if (!session || session.endedAt) return;
    session.endedAt = new Date().toISOString();
    await saveStore(store);
  });
}

/** Past sessions (most recent first), excluding the current one. */
export function getPastSessions(
  currentSessionId: string,
): Promise<StoredSession[]> {
  return enqueue(async () => {
    const store = await loadStore();
    return store.sessions
      .filter((s) => s.id !== currentSessionId && s.messages.length > 0)
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  });
}

export function getSession(sessionId: string): Promise<StoredSession | null> {
  return enqueue(async () => {
    const store = await loadStore();
    return store.sessions.find((s) => s.id === sessionId) ?? null;
  });
}
