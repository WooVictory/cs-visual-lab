const STORAGE_KEY = "cs-visual-lab/progress";

export type TopicProgress = {
  viewed: boolean;
  completed: boolean;
  lastVisitedAt: string;
};

type ProgressState = {
  topics: Record<string, TopicProgress>;
};

const DEFAULT_PROGRESS: TopicProgress = {
  viewed: false,
  completed: false,
  lastVisitedAt: "",
};

function read(): ProgressState {
  if (typeof window === "undefined") return { topics: {} };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { topics: {} };
    const parsed = JSON.parse(raw) as ProgressState;
    return parsed?.topics ? parsed : { topics: {} };
  } catch {
    return { topics: {} };
  }
}

function write(state: ProgressState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("cs-progress-updated"));
  } catch {
    // localStorage quota exceeded / disabled — silently ignore for MVP
  }
}

export function getTopicProgress(slug: string): TopicProgress {
  const state = read();
  return state.topics[slug] ?? DEFAULT_PROGRESS;
}

export function getAllProgress(): Record<string, TopicProgress> {
  return read().topics;
}

export function markViewed(slug: string) {
  const state = read();
  const current = state.topics[slug] ?? DEFAULT_PROGRESS;
  state.topics[slug] = {
    ...current,
    viewed: true,
    lastVisitedAt: new Date().toISOString(),
  };
  write(state);
}

export function markCompleted(slug: string) {
  const state = read();
  const current = state.topics[slug] ?? DEFAULT_PROGRESS;
  state.topics[slug] = {
    ...current,
    viewed: true,
    completed: true,
    lastVisitedAt: new Date().toISOString(),
  };
  write(state);
}

export function resetProgress() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("cs-progress-updated"));
}
