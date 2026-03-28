import axios, { AxiosInstance } from "axios";
import { loadConfig } from "./config.js";

const GITHUB_API_BASE = "https://api.github.com";

export type RepoLanguageMap = Record<string, number>;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function asNonEmptyString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function getGithubToken(overrideToken?: string): string | null {
  const direct = asNonEmptyString(overrideToken);
  if (direct) {
    return direct;
  }

  try {
    const cfg = (loadConfig() ?? {}) as Record<string, any>;
    const githubCfg = cfg.github as Record<string, any> | undefined;
    const configToken = asNonEmptyString(githubCfg?.token);
    if (configToken) {
      return configToken;
    }
  } catch {
    // Ignore config read errors and fall back to env
  }

  const envToken = asNonEmptyString(
    process.env.GITHUB_TOKEN || process.env.GH_TOKEN,
  );
  if (envToken) {
    return envToken;
  }

  return null;
}

function createGithubClient(token?: string): AxiosInstance {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "explainthisrepo/1.0",
  };

  const resolvedToken = getGithubToken(token);
  if (resolvedToken) {
    headers.Authorization = `Bearer ${resolvedToken}`;
  }

  return axios.create({
    baseURL: GITHUB_API_BASE,
    headers,
    timeout: 10_000,
  });
}

function isRateLimitText(text: unknown): boolean {
  const lower = typeof text === "string" ? text.toLowerCase() : "";
  return (
    lower.includes("secondary rate limit") ||
    lower.includes("rate limit")
  );
}

function rateLimitMessage(response?: { headers?: Record<string, unknown> }): string {
  const reset = response?.headers?.["x-ratelimit-reset"];

  if (typeof reset === "string" || typeof reset === "number") {
    const resetTs = Number(reset);
    if (!Number.isNaN(resetTs)) {
      const waitSeconds = Math.max(0, resetTs * 1000 - Date.now()) / 1000;
      const mins = Math.max(1, Math.ceil(waitSeconds / 60));

      return (
        "GitHub API rate limit exceeded.\n" +
        `Try again in ~${mins} minute(s).\n` +
        "Fix:\n" +
        "- Set GITHUB_TOKEN in config or environment\n" +
        "- Or run `explainthisrepo init`\n"
      );
    }
  }

  return (
    "GitHub API rate limit exceeded.\n" +
    "Fix:\n" +
    "- Set GITHUB_TOKEN in config or environment\n" +
    "- Or run `explainthisrepo init`\n"
  );
}

function privateRepoMessage(): string {
  return (
    "Repository not found.\n" +
    "If this is a private repository, configure GitHub access:\n" +
    "- Run `explainthisrepo init`\n" +
    "- Or set GITHUB_TOKEN (see docs/GITHUB_TOKEN.md)\n"
  );
}

function formatJsonError(err: unknown): string {
  if (!axios.isAxiosError(err)) {
    return `GitHub request failed: ${String(err)}`;
  }

  const status = err.response?.status;
  const data = err.response?.data as any;
  const message = typeof data?.message === "string" ? data.message : err.message;

  if (status === 404) {
    return privateRepoMessage();
  }

  if (status === 401) {
    return "GitHub auth failed (401). Invalid GitHub token.";
  }

  if (status === 403) {
    if (
      err.response?.headers?.["x-ratelimit-remaining"] === "0" ||
      isRateLimitText(message)
    ) {
      return rateLimitMessage(err.response);
    }
    return "GitHub API access forbidden (403).";
  }

  if (status === 429) {
    return rateLimitMessage(err.response);
  }

  if (status && status >= 500) {
    return `GitHub API server error (${status}). Try again later.`;
  }

  if (status !== undefined) {
    return `GitHub API request failed (${status}): ${message}`;
  }

  return `Network error while calling GitHub: ${message}`;
}

async function requestJson<T>(
  client: AxiosInstance,
  url: string,
  opts?: { params?: Record<string, unknown>; maxRetries?: number; baseDelayMs?: number },
): Promise<T> {
  const maxRetries = opts?.maxRetries ?? 4;
  const baseDelayMs = opts?.baseDelayMs ?? 700;

  let attempt = 0;
  let backoff = baseDelayMs;

  while (attempt <= maxRetries) {
    try {
      const response = await client.get<T>(url, {
        params: opts?.params,
      });
      return response.data;
    } catch (err: unknown) {
      if (!axios.isAxiosError(err)) {
        if (attempt >= maxRetries) {
          throw new Error(`Network error while calling GitHub: ${String(err)}`);
        }
        await sleep(backoff);
        backoff *= 2;
        attempt += 1;
        continue;
      }

      const status = err.response?.status;
      const data = err.response?.data as any;
      const message = typeof data?.message === "string" ? data.message : err.message;
      const remaining = err.response?.headers?.["x-ratelimit-remaining"];

      if (status === 404) {
        throw new Error(privateRepoMessage());
      }

      if (status === 403 || status === 429) {
        const rateLimited = remaining === "0" || isRateLimitText(message);

        if (rateLimited) {
          if (attempt >= maxRetries) {
            throw new Error(rateLimitMessage(err.response));
          }
          await sleep(backoff);
          backoff *= 2;
          attempt += 1;
          continue;
        }

        if (status === 429) {
          if (attempt >= maxRetries) {
            throw new Error(rateLimitMessage(err.response));
          }
          await sleep(backoff);
          backoff *= 2;
          attempt += 1;
          continue;
        }

        throw new Error("GitHub API access forbidden (403).");
      }

      if (status && status >= 500) {
        if (attempt >= maxRetries) {
          throw new Error(
            `GitHub API server error (${status}). Try again later.`,
          );
        }
        await sleep(backoff);
        backoff *= 2;
        attempt += 1;
        continue;
      }

      if (status === undefined) {
        if (attempt >= maxRetries) {
          throw new Error(`Network error while calling GitHub: ${message}`);
        }
        await sleep(backoff);
        backoff *= 2;
        attempt += 1;
        continue;
      }

      throw new Error(formatJsonError(err));
    }
  }

  throw new Error("GitHub request failed unexpectedly.");
}

async function requestText(
  client: AxiosInstance,
  url: string,
  opts?: { accept?: string; maxRetries?: number; baseDelayMs?: number; params?: Record<string, unknown> },
): Promise<string | null> {
  const accept = opts?.accept ?? "application/vnd.github.v3.raw";
  const maxRetries = opts?.maxRetries ?? 4;
  const baseDelayMs = opts?.baseDelayMs ?? 700;

  let attempt = 0;
  let backoff = baseDelayMs;

  while (attempt <= maxRetries) {
    try {
      const response = await client.get<string>(url, {
        params: opts?.params,
        headers: { Accept: accept },
        responseType: "text",
        transformResponse: [(data) => data],
      });

      return typeof response.data === "string" ? response.data : String(response.data ?? "");
    } catch (err: unknown) {
      if (!axios.isAxiosError(err)) {
        if (attempt >= maxRetries) {
          return null;
        }
        await sleep(backoff);
        backoff *= 2;
        attempt += 1;
        continue;
      }

      const status = err.response?.status;
      const data = err.response?.data as any;
      const message = typeof data?.message === "string" ? data.message : err.message;
      const remaining = err.response?.headers?.["x-ratelimit-remaining"];

      if (status === 404) {
        return null;
      }

      if (status === 403 || status === 429) {
        const rateLimited = remaining === "0" || isRateLimitText(message);

        if (rateLimited) {
          if (attempt >= maxRetries) {
            return null;
          }
          await sleep(backoff);
          backoff *= 2;
          attempt += 1;
          continue;
        }

        return null;
      }

      if (status && status >= 500) {
        if (attempt >= maxRetries) {
          return null;
        }
        await sleep(backoff);
        backoff *= 2;
        attempt += 1;
        continue;
      }

      return null;
    }
  }

  return null;
}

export async function fetchRepo(owner: string, repo: string, token?: string): Promise<any> {
  const client = createGithubClient(token);
  return requestJson<any>(client, `/repos/${owner}/${repo}`);
}

export async function fetchReadme(
  owner: string,
  repo: string,
  token?: string,
): Promise<string | null> {
  const client = createGithubClient(token);

  const apiUrl = `/repos/${owner}/${repo}/readme`;
  const text = await requestText(client, apiUrl, {
    accept: "application/vnd.github.v3.raw",
    maxRetries: 4,
  });

  if (text) {
    return text;
  }

  const branches = ["main", "master"];
  const filenames = ["README.md", "readme.md", "README.MD"];

  for (const branch of branches) {
    for (const name of filenames) {
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${name}`;
      const raw = await requestText(client, rawUrl, {
        accept: "text/plain",
        maxRetries: 2,
      });

      if (raw) {
        return raw;
      }
    }
  }

  return null;
}

export async function fetchTree(
  owner: string,
  repo: string,
  token?: string,
): Promise<any[]> {
  const client = createGithubClient(token);

  const repoMeta = await fetchRepo(owner, repo, token);
  const defaultBranch = repoMeta?.default_branch || "main";

  const data = await requestJson<any>(
    client,
    `/repos/${owner}/${repo}/git/trees/${defaultBranch}`,
    { params: { recursive: 1 } },
  );

  const tree = data?.tree || [];
  if (!Array.isArray(tree)) {
    return [];
  }

  // Kept in the current shape to avoid breaking downstream callers.
  return tree.map((item: any) => ({
    path: item.path,
    type: item.type,
    size: item.size,
  }));
}

export async function fetchFile(
  owner: string,
  repo: string,
  filePath: string,
  token?: string,
): Promise<string | null> {
  const client = createGithubClient(token);

  return requestText(client, `/repos/${owner}/${repo}/contents/${filePath}`, {
    accept: "application/vnd.github.v3.raw",
    maxRetries: 2,
  });
}

export async function fetchLanguages(
  owner: string,
  repo: string,
  token?: string,
): Promise<RepoLanguageMap> {
  const client = createGithubClient(token);
  return requestJson<RepoLanguageMap>(client, `/repos/${owner}/${repo}/languages`);
}