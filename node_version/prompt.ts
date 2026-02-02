export function buildPrompt(
  repoName: string,
  description: string | null,
  readme: string | null,
  detailed: boolean = false,
  quick: boolean = false,
  treeText: string | null = null,
  filesText: string | null = null
): string {
  // QUICK MODE: one sentence definition only
  if (quick) {
    const readmeSnippet = (readme || "").slice(0, 2000);

    return `
You are a senior software engineer.

Write a ONE-SENTENCE plain-English definition of what this GitHub repository is.

Repository:
- Name: ${repoName}
- Description: ${description || "No description provided"}

README snippet:
${readmeSnippet || "No README provided"}

Rules:
- Output MUST be exactly 1 sentence.
- Plain English.
- No markdown.
- No quotes.
- No bullet points.
- No extra text.
- Do not add features not stated in the description/README.
`.trim();
  }

  // NORMAL / DETAILED MODE
  let prompt = `You are a senior software engineer.

Your task is to explain a GitHub repository clearly and concisely for a human reader.

Repository:
- Name: ${repoName}
- Description: ${description || "No description provided"}

README content:
${readme || "No README provided"}

Repository structure:
${treeText || "No tree provided"}

Key files (snippets):
${filesText || "No code files provided"}

Instructions:
- Explain what this project does.
- Say who it is for.
- Explain how to run or use it.
- Do not assume missing details.
- If something is unclear, say so.
- Avoid hype or marketing language.
- Be concise and practical.
- Use clear markdown headings.
`.trim();

  if (detailed) {
    prompt += `

Additional instructions:
- Explain the high-level architecture.
- Describe the folder structure.
- Mention important files and their roles.
`;
  }
  
  prompt += `

Output format:
# Overview
# What this project does
# Who it is for
# How to run or use it
# Notes or limitations
`;

  return prompt.trim();
}

export function buildSimplePrompt(longExplanation: string): string {
  return `
You are a senior software engineer.

Rewrite the long repository explanation below into a SIMPLE version in the exact style specified.

Input explanation:
${longExplanation}

Output style rules:
- Plain English.
- No markdown.
- Do NOT use headings like "Overview", "What this project does", etc.
- Start with exactly this line:
Key points from the repo:
- Then output 4 to 7 bullets only.
- Each bullet MUST start with: ⬤
- Each bullet title should be 1–3 words only (example: "Purpose", "Stack", "Entrypoints", "How it works", "Usage", "Structure").
- Each bullet body should be 1–2 lines max.
- If the input contains architecture/pipeline steps, capture them naturally.
- If the input does NOT contain architecture/pipeline steps, do NOT invent them.
- Optional: end with one extra line starting with:
Also interesting:
- Do NOT add features not present in the input.
- No quotes.

Make it feel like a human developer explaining to another developer in simple terms.
`.trim();
}