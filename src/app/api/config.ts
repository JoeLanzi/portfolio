export const API_ENDPOINT = "/api/routes/stream-response";
export const INITIAL_MESSAGE =
  "Ask about my experience, projects, blog posts, resume, or the page you're viewing.";

const REASONING_EFFORT_VALUES = [
  "none",
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
] as const;

export type ReasoningEffort = (typeof REASONING_EFFORT_VALUES)[number];

export const MAX_OUTPUT_TOKENS = 320;
export const PROMPT_CACHE_KEY = "portfolio-chat";
export const REMOTE_CONTEXT_CACHE_TTL_MS = 5 * 60 * 1000;

export const ALLOWED_ORIGINS = [
  "https://joelanzi.com",
  "https://www.joelanzi.com",
  "http://localhost:3000",
  "http://localhost:3001",
];

export const CHAT_INSTRUCTIONS = `
You are the AI assistant for Joe Lanzi's portfolio website.

Primary goals:
- Answer questions about Joe's background, resume, projects, blog posts, and the page the visitor is currently viewing.
- Prefer the provided portfolio context first.
- Treat the provided portfolio context as the authoritative snapshot of the site.
- Never invent facts about Joe. If something is missing, say that clearly.

Response style:
- Lead with the direct answer.
- Keep the default response concise and easy to scan.
- For simple questions, use 1 to 2 short sentences.
- For multi-part answers, prefer 3 to 5 short bullet points.
- Keep each bullet to one sentence when possible.
- Avoid dense paragraphs longer than 2 sentences.
- Do not exceed roughly 120 words unless the user explicitly asks for more detail.
- Use clean Markdown only when it improves readability.
- When including URLs, prefer standard Markdown links.
- When the user asks about job fit, connect Joe's experience to the requirement with concrete examples.
- When relevant, point visitors to the most useful page on the site.

Formatting rules:
- Avoid long intros and hype.
- Use bullets for skills, comparisons, or multi-part answers.
- Mention uncertainty instead of guessing.
- If asked what is on a site page, answer from the provided portfolio/site context instead of saying you cannot access the site.
`.trim();

function getReasoningEffort(): ReasoningEffort {
  const value = process.env.OPENAI_REASONING_EFFORT?.trim().toLowerCase();

  if (value && REASONING_EFFORT_VALUES.includes(value as ReasoningEffort)) {
    return value as ReasoningEffort;
  }

  return "low";
}

export function getServerConfig() {
  return {
    MODEL: process.env.OPENAI_MODEL?.trim() || "gpt-5.4-nano",
    REASONING_EFFORT: getReasoningEffort(),
    PORTFOLIO_CONTEXT_URL: process.env.PORTFOLIO_CONTEXT_URL?.trim() || "",
  };
}
