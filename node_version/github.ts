import axios from "axios";

const GITHUB_API_BASE = "https://api.github.com";

// We create an 'instance' so all calls have the correct headers automatically
const github = axios.create({
  baseURL: GITHUB_API_BASE,
  headers: {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "ExplainThisRepo-Node-Version", // REQUIRED by GitHub
  },
  timeout: 10000, // Prevents the 'socket hang up' seen in your screenshot
});

export async function fetchRepo(owner: string, repo: string): Promise<any> {
  const response = await github.get(`/repos/${owner}/${repo}`);

  if (response.status !== 200) {
    throw new Error("Failed to fetch repository metadata"); //
  }
  return response.data;
}

export async function fetchReadme(
  owner: string,
  repo: string,
): Promise<string | null> {
  try {
    const response = await github.get(`/repos/${owner}/${repo}/readme`, {
      headers: { Accept: "application/vnd.github.v3.raw" }, //
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null; //
    }
    throw new Error("Failed to fetch README"); //
  }
}
