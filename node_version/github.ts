import axios, { AxiosError, AxiosInstance } from "axios";

const GITHUB_API_BASE = "https://api.github.com";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getGithubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "ExplainThisRepo",
  };

  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_API_KEY;
  if (token && token.trim()) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }

  return headers;
}

const github: AxiosInstance = axios.create({
  baseURL: GITHUB_API_BASE,
  headers: getGithubHeaders(),
  timeout: 12000,
});

function formatAxiosError(err: unknown): string {
  if (!axios.isAxiosError(err)) return "Unknown error";

  const status = err.response?.status;
  const data = err.response?.data as any;
  const msg = data?.message || err.message;

  if (status === 404) return "Repository not found (404). Check owner/repo.";
  if (status === 401) return "GitHub auth failed (401). Invalid GITHUB_TOKEN.";
  if (status === 403 && typeof msg === "string" && msg.toLowerCase().includes("rate limit")) {
    return "GitHub rate limit hit (403). Set GITHUB_TOKEN to increase limits.";
  }
  if (status === 429) return "GitHub rate limit hit (429). Try again in a minute.";
  if (status && status >= 500) return `GitHub server error (${status}). Try again later.`;

  return `GitHub request failed (${status ?? "no status"}): ${msg}`;
}

async function requestWithRetry<T>(
  fn: () => Promise<T>,
  opts?: { maxRetries?: number; baseDelayMs?: number },
): Promise<T> {
  const maxRetries = opts?.maxRetries ?? 3;
  const baseDelayMs = opts?.baseDelayMs ?? 700;

  let attempt = 0;

  while (true) {
    try {
      return await fn();
    } catch (err: unknown) {
      attempt += 1;

      const isAxios = axios.isAxiosError(err);
      const status = isAxios ? err.response?.status : undefined;

      const retryable =
        status === 403 || status === 429 || (status !== undefined && status >= 500);

      if (!retryable || attempt > maxRetries) {
        throw new Error(formatAxiosError(err));
      }

      // If rate-limited and GitHub tells us reset time, wait until reset.
      const resetHeader = isAxios ? err.response?.headers?.["x-ratelimit-reset"] : undefined;
      if ((status === 403 || status === 429) && resetHeader) {
        const resetSeconds = Number(resetHeader);
        if (!Number.isNaN(resetSeconds)) {
          const waitMs = Math.max(resetSeconds * 1000 - Date.now(), 1000);
          await sleep(Math.min(waitMs, 30_000)); // cap waiting to 30s
          continue;
        }
      }

      // Exponential backoff
      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      await sleep(Math.min(delay, 8000));
    }
  }
}

export async function fetchRepo(owner: string, repo: string): Promise<any> {
  return requestWithRetry(async () => {
    const res = await github.get(`/repos/${owner}/${repo}`);
    return res.data;
  });
}

export async function fetchReadme(
  owner: string,
  repo: string,
): Promise<string | null> {
  try {
    return await requestWithRetry(async () => {
      const res = await github.get(`/repos/${owner}/${repo}/readme`, {
        headers: {
          ...getGithubHeaders(),
          Accept: "application/vnd.github.v3.raw",
        },
      });
      return res.data as string;
    });
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = (err as AxiosError).response?.status;
      if (status === 404) return null;
    }
    throw err;
  }
}
export async function fetchTree(owner: string, repo: string): Promise<any[]> {
  return requestWithRetry(async () => {
    const repoRes = await github.get(`/repos/${owner}/${repo}`);
    const defaultBranch = repoRes.data?.default_branch;

    const res = await github.get(`/repos/${owner}/${repo}/git/trees/${defaultBranch}`, {
      params: { recursive: 1 },
    });

    return (res.data?.tree || []).map((item: any) => ({
      path: item.path,
      type: item.type,
      size: item.size,
    }));
  });
}

export async function fetchFile(
  owner: string,
  repo: string,
  filePath: string
): Promise<string> {
  return requestWithRetry(async () => {
    const res = await github.get(`/repos/${owner}/${repo}/contents/${filePath}`, {
      headers: {
        ...getGithubHeaders(),
        Accept: "application/vnd.github.v3.raw",
      },
    });
    return res.data as string;
  });
}