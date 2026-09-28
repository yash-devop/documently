const PREFIX = "documently:pending-prompt";

const key = (chatId: string) => `${PREFIX}:${chatId}`;

/**
 * Hands the welcome screen's first prompt to the chat view.
 *
 * The chat cannot exist until the welcome screen has created it, uploaded the
 * staged documents and waited for the worker to index them. Sending the prompt
 * from there meant one blocking request covering the whole Gemini generation,
 * which outlasts the default 60s proxy read timeout and comes back as a 504.
 * Instead the prompt is parked here and the chat view sends it over the same
 * streaming path as every other message.
 *
 * sessionStorage rather than the URL: this is a same-tab handoff, and it keeps
 * the prompt out of history entries and any copied link.
 */
export const stashPendingPrompt = (chatId: string, prompt: string) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(key(chatId), prompt);
};

/**
 * Reads and clears the parked prompt. Clearing on read is what makes the
 * handoff fire exactly once, including under StrictMode's double effect pass.
 */
export const takePendingPrompt = (chatId: string): string | null => {
  if (typeof window === "undefined") return null;
  const storageKey = key(chatId);
  const prompt = window.sessionStorage.getItem(storageKey);
  if (prompt) window.sessionStorage.removeItem(storageKey);
  return prompt;
};
