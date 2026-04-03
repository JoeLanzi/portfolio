import "server-only";

const REASONING_EFFORT_VALUES = [
  "none",
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
] as const;

type ReasoningEffort = (typeof REASONING_EFFORT_VALUES)[number];

function getReasoningEffort(): ReasoningEffort {
  const value = process.env.OPENAI_REASONING_EFFORT?.trim().toLowerCase();

  if (value && REASONING_EFFORT_VALUES.includes(value as ReasoningEffort)) {
    return value as ReasoningEffort;
  }

  return "low";
}

export const MODEL = process.env.OPENAI_MODEL?.trim() || "gpt-5.4-nano";
export const REASONING_EFFORT = getReasoningEffort();

export const MAX_OUTPUT_TOKENS = 450;

export const PROMPT_CACHE_KEY = "portfolio-chat";

export const PORTFOLIO_CONTEXT_URL = process.env.PORTFOLIO_CONTEXT_URL?.trim() || "";
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
- Never invent facts about Joe. If something is missing, say that clearly.

Response style:
- Lead with the direct answer.
- Keep the default response concise: one short paragraph or a short bullet list.
- Use clean Markdown only when it improves readability.
- When the user asks about job fit, connect Joe's experience to the requirement with concrete examples.
- When relevant, point visitors to the most useful page on the site.

Formatting rules:
- Avoid long intros and hype.
- Use bullets for skills, comparisons, or multi-part answers.
- Mention uncertainty instead of guessing.
`.trim();
