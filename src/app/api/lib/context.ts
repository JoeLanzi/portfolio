import "server-only";

import { readFile } from "fs/promises";
import path from "path";
import { isValidElement, type ReactNode } from "react";
import {
  about,
  baseURL,
  blog,
  home,
  person,
  social,
  work,
} from "@/app/resources";
import { REMOTE_CONTEXT_CACHE_TTL_MS, getServerConfig } from "@/app/api/config";
import type { PageContext } from "@/app/api/types";
import { getPostsSafe, type Post as ContentPost } from "@/app/utils/utils";

const MAX_PROJECT_EXCERPT_LENGTH = 600;
const MAX_BLOG_EXCERPT_LENGTH = 500;
const MAX_REMOTE_CONTEXT_LENGTH = 12_000;

const TEXT_REPLACEMENTS: Record<string, string> = {
  "\u00c2\u00b7": "·",
  "\u00e2\u20ac\u201d": "-",
  "\u00e2\u20ac\u201c": "-",
  "\u00e2\u20ac\u2122": "'",
  "\u00e2\u20ac\u0153": "\"",
  "\u00e2\u20ac\ufffd": "\"",
  "\u00e2\u20ac\u00a6": "...",
};

let remoteContextCache:
  | {
      expiresAt: number;
      url: string;
      value: string;
    }
  | null = null;

const { PORTFOLIO_CONTEXT_URL } = getServerConfig();

function toAbsoluteUrl(path: string): string {
  if (!path) {
    return "";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `https://${baseURL}${path.startsWith("/") ? path : `/${path}`}`;
}

function cleanText(value: string): string {
  let text = value;

  for (const [from, to] of Object.entries(TEXT_REPLACEMENTS)) {
    text = text.replaceAll(from, to);
  }

  return text
    .replace(/<figcaption[^>]*>[\s\S]*?<\/figcaption>/gi, " ")
    .replace(/<img[^>]*>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_{1,2}([^_]+)_{1,2}/g, "$1")
    .replace(/^\s*[-+*]\s+/gm, "- ")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function toPlainText(value: ReactNode | unknown): string {
  if (typeof value === "string") {
    return cleanText(value);
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return cleanText(value.map((entry) => toPlainText(entry)).filter(Boolean).join(" "));
  }

  if (value == null) {
    return "";
  }

  if (isValidElement<{ children?: ReactNode }>(value)) {
    return toPlainText(value.props?.children);
  }

  return "";
}

function createExcerpt(content: string, maxLength: number): string {
  const text = cleanText(content);

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trim()}...`;
}

function sortPosts(posts: ContentPost[]): ContentPost[] {
  return [...posts].sort((left, right) => {
    return new Date(right.metadata.publishedAt).getTime() - new Date(left.metadata.publishedAt).getTime();
  });
}

function buildExperienceSection(): string {
  const experiences = about.work.experiences
    .map((experience) => {
      const achievements = experience.achievements
        .map((achievement) => toPlainText(achievement))
        .filter(Boolean)
        .join(" ");

      const tags = experience.tags?.length ? ` Skills: ${experience.tags.join(", ")}.` : "";
      const link = experience.link ? ` Link: ${experience.link}.` : "";

      return `- ${experience.company} | ${experience.role} | ${experience.timeframe}. ${achievements}${tags}${link}`;
    })
    .join("\n");

  return `## Experience\n${experiences}`;
}

function buildEducationSection(): string {
  const education = about.studies.institutions
    .map((institution) => {
      return `- ${institution.name}: ${toPlainText(institution.description)}`;
    })
    .join("\n");

  return `## Education\n${education}`;
}

function buildProjectsSection(projects: ContentPost[]): string {
  const items = projects
    .map((project) => {
      const lines = [
        `- ${project.metadata.title} (${project.metadata.publishedAt})`,
        `  Summary: ${project.metadata.summary}`,
        `  Link: ${toAbsoluteUrl(`/projects/${project.slug}`)}`,
      ];

      if (project.metadata.tag) {
        lines.push(`  Category: ${project.metadata.tag}`);
      }

      if (project.metadata.link) {
        lines.push(`  External link: ${project.metadata.link}`);
      }

      const excerpt = createExcerpt(project.content, MAX_PROJECT_EXCERPT_LENGTH);
      if (excerpt) {
        lines.push(`  Excerpt: ${excerpt}`);
      }

      return lines.join("\n");
    })
    .join("\n");

  return `## Projects\n${items}`;
}

function buildBlogSection(posts: ContentPost[]): string {
  const items = posts
    .map((post) => {
      const lines = [
        `- ${post.metadata.title} (${post.metadata.publishedAt})`,
        `  Summary: ${post.metadata.summary}`,
        `  Link: ${toAbsoluteUrl(`/blog/${post.slug}`)}`,
      ];

      if (post.metadata.tag) {
        lines.push(`  Category: ${post.metadata.tag}`);
      }

      const excerpt = createExcerpt(post.content, MAX_BLOG_EXCERPT_LENGTH);
      if (excerpt) {
        lines.push(`  Excerpt: ${excerpt}`);
      }

      return lines.join("\n");
    })
    .join("\n");

  return `## Blog Posts\n${items}`;
}

function buildLinksSection(): string {
  const links = [
    `- Home: ${toAbsoluteUrl("/")}`,
    `- About: ${toAbsoluteUrl("/about")}`,
    `- Projects: ${toAbsoluteUrl("/projects")}`,
    `- Blog: ${toAbsoluteUrl("/blog")}`,
    `- Resume: ${toAbsoluteUrl("/resume.pdf")}`,
    ...social
      .filter((entry) => entry.link)
      .map((entry) => `- ${entry.name}: ${entry.link}`),
  ].join("\n");

  return `## Links\n${links}`;
}

function buildSiteSection(projects: ContentPost[], posts: ContentPost[]): string {
  const projectTitles = projects.map((project) => project.metadata.title).join(", ");
  const postTitles = posts.map((post) => post.metadata.title).join(", ");

  return `## Site Structure
- The site has these primary pages: Home, About, Projects, Blog, and Resume.
- Projects page URL: ${toAbsoluteUrl("/projects")}
- Projects page summary: ${work.description}
- Projects currently listed: ${projectTitles || "None listed"}
- Blog page URL: ${toAbsoluteUrl("/blog")}
- Blog page summary: ${blog.description}
- Blog posts currently listed: ${postTitles || "None listed"}
- About page URL: ${toAbsoluteUrl("/about")}
- Resume URL: ${toAbsoluteUrl("/resume.pdf")}`;
}

function buildLiveSiteSnapshot(projects: ContentPost[], posts: ContentPost[], pageContext?: PageContext): string {
  const projectList = projects.length
    ? projects.map((project) => `- ${project.metadata.title}: ${toAbsoluteUrl(`/projects/${project.slug}`)}`).join("\n")
    : "- None";
  const postList = posts.length
    ? posts.map((post) => `- ${post.metadata.title}: ${toAbsoluteUrl(`/blog/${post.slug}`)}`).join("\n")
    : "- None";

  const lines = [
    "## Live Site Snapshot",
    `- Projects page: ${toAbsoluteUrl("/projects")}`,
    `- Blog page: ${toAbsoluteUrl("/blog")}`,
    `- Resume: ${toAbsoluteUrl("/resume.pdf")}`,
    `- Current path: ${pageContext?.pathname || "unknown"}`,
    "### Current Projects",
    projectList,
    "### Current Blog Posts",
    postList,
  ];

  return lines.join("\n");
}

function buildCurrentPageSection(
  pageContext: PageContext | undefined,
  projects: ContentPost[],
  posts: ContentPost[],
): string {
  const pathname = pageContext?.pathname;

  if (!pathname) {
    return "";
  }

  const lines = ["## Current Page", `- Path: ${pathname}`];

  if (pageContext?.title) {
    lines.push(`- Title: ${pageContext.title}`);
  }

  if (pathname === "/") {
    lines.push("- Section: Home");
    lines.push(`- Headline: ${toPlainText(home.headline)}`);
    lines.push(`- Summary: ${toPlainText(home.subline)}`);
    return lines.join("\n");
  }

  if (pathname === "/about") {
    lines.push("- Section: About");
    lines.push(`- Summary: ${toPlainText(about.intro.description)}`);
    return lines.join("\n");
  }

  if (pathname === "/blog") {
    lines.push("- Section: Blog index");
    lines.push(`- Summary: ${blog.description}`);
    return lines.join("\n");
  }

  if (pathname === "/projects") {
    lines.push("- Section: Projects index");
    lines.push(`- Summary: ${work.description}`);
    return lines.join("\n");
  }

  if (pathname.startsWith("/blog/")) {
    const slug = pathname.replace("/blog/", "");
    const post = posts.find((entry) => entry.slug === slug);

    if (post) {
      lines.push("- Section: Blog post");
      lines.push(`- Post title: ${post.metadata.title}`);
      lines.push(`- Post summary: ${post.metadata.summary}`);
      lines.push(`- Post excerpt: ${createExcerpt(post.content, MAX_BLOG_EXCERPT_LENGTH)}`);
    }

    return lines.join("\n");
  }

  if (pathname.startsWith("/projects/")) {
    const slug = pathname.replace("/projects/", "");
    const project = projects.find((entry) => entry.slug === slug);

    if (project) {
      lines.push("- Section: Project detail");
      lines.push(`- Project title: ${project.metadata.title}`);
      lines.push(`- Project summary: ${project.metadata.summary}`);
      lines.push(`- Project excerpt: ${createExcerpt(project.content, MAX_PROJECT_EXCERPT_LENGTH)}`);
    }

    return lines.join("\n");
  }

  return lines.join("\n");
}

async function getRemoteContext(): Promise<string> {
  if (!PORTFOLIO_CONTEXT_URL) {
    return "";
  }

  if (
    remoteContextCache &&
    remoteContextCache.url === PORTFOLIO_CONTEXT_URL &&
    remoteContextCache.expiresAt > Date.now()
  ) {
    return remoteContextCache.value;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2_500);

  try {
    if (PORTFOLIO_CONTEXT_URL.startsWith("/")) {
      const normalizedPath = path.posix.normalize(PORTFOLIO_CONTEXT_URL);

      if (!normalizedPath.startsWith("/") || normalizedPath.includes("..")) {
        throw new Error("Local portfolio context path must stay within /public.");
      }

      const publicFilePath = path.join(
        process.cwd(),
        "public",
        normalizedPath.slice(1).replace(/\//g, path.sep),
      );

      const rawText = await readFile(publicFilePath, "utf8");
      const value = createExcerpt(rawText, MAX_REMOTE_CONTEXT_LENGTH);

      remoteContextCache = {
        url: PORTFOLIO_CONTEXT_URL,
        value,
        expiresAt: Date.now() + REMOTE_CONTEXT_CACHE_TTL_MS,
      };

      return value;
    }

    const response = await fetch(PORTFOLIO_CONTEXT_URL, {
      headers: {
        Accept: "text/plain, text/markdown, application/json",
      },
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Remote context request failed with status ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";
    const rawText = contentType.includes("application/json")
      ? JSON.stringify(await response.json(), null, 2)
      : await response.text();

    const value = createExcerpt(rawText, MAX_REMOTE_CONTEXT_LENGTH);

    remoteContextCache = {
      url: PORTFOLIO_CONTEXT_URL,
      value,
      expiresAt: Date.now() + REMOTE_CONTEXT_CACHE_TTL_MS,
    };

    return value;
  } catch (error) {
    console.error("Unable to load remote portfolio context:", error);
    return "";
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function buildPortfolioContext(pageContext?: PageContext): Promise<string> {
  const blogPosts = sortPosts(getPostsSafe(["src", "app", "blog", "posts"]));
  const projects = sortPosts(getPostsSafe(["src", "app", "projects", "content"]));
  const remoteContext = await getRemoteContext();

  const sections = [
    "# Portfolio Context",
    `## Profile
- Name: ${person.name}
- Role: ${person.role}
- Timezone: ${person.location}
- Home page title: ${home.title}
- Home summary: ${toPlainText(home.subline)}
- About summary: ${toPlainText(about.intro.description)}`,
    buildCurrentPageSection(pageContext, projects, blogPosts),
    buildSiteSection(projects, blogPosts),
    buildExperienceSection(),
    buildEducationSection(),
    buildProjectsSection(projects),
    buildBlogSection(blogPosts),
    buildLinksSection(),
    remoteContext ? `## Remote Context\n${remoteContext}` : "",
  ].filter(Boolean);

  return sections.join("\n\n");
}

export function buildLiveSiteContext(pageContext?: PageContext): string {
  const blogPosts = sortPosts(getPostsSafe(["src", "app", "blog", "posts"]));
  const projects = sortPosts(getPostsSafe(["src", "app", "projects", "content"]));

  return buildLiveSiteSnapshot(projects, blogPosts, pageContext);
}

export function buildPageContextNote(pageContext?: PageContext): string {
  if (!pageContext?.pathname && !pageContext?.title) {
    return "";
  }

  const lines = ["Current page context:"];

  if (pageContext.pathname) {
    lines.push(`- Path: ${pageContext.pathname}`);
  }

  if (pageContext.title) {
    lines.push(`- Title: ${pageContext.title}`);
  }

  lines.push("- Treat this as the current page the visitor is viewing right now.");

  return lines.join("\n");
}
