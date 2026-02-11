def build_prompt(
    repo_name: str,
    description: str | None,
    readme: str | None,
    detailed: bool = False,
    tree_text: str | None = None,
    files_text: str | None = None,
) -> str:
    prompt = f"""
You are a senior software engineer.

Your task is to explain a GitHub repository clearly and concisely for a human reader.

Repository:
- Name: {repo_name}
- Description: {description or "No description provided"}

README content:
{readme or "No README provided"}

Repo structure:
{tree_text or "No file tree provided"}

Key code files:
{files_text or "No code files provided"}

Instructions:
- Explain what this project does.
- Say who it is for.
- Explain how to run or use it.
- Do not assume missing details.
- If something is unclear, say so.
- Avoid hype or marketing language.
- Be concise and practical.
- Use clear markdown headings.
""".strip()

    if detailed:
        prompt += """

Additional instructions:
- Explain the high-level architecture.
- Describe the folder structure.
- Mention important files and their roles.
""".rstrip()

    prompt += """

Output format:
# Overview
# What this project does
# Who it is for
# How to run or use it
# Notes or limitations
""".rstrip()

    return prompt.strip()


def build_quick_prompt(
    repo_name: str,
    description: str | None,
    readme: str | None,
) -> str:
    readme_snippet = (readme or "No README provided")[:2000]

    prompt = f"""
You are a senior software engineer.

Write a ONE-SENTENCE plain-English definition of what this GitHub repository is.

Repository:
- Name: {repo_name}
- Description: {description or "No description provided"}

README snippet:
{readme_snippet}

Rules:
- Output MUST be exactly 1 sentence.
- Plain English.
- No markdown.
- No quotes.
- No bullet points.
- No extra text.
- Do not add features not stated in the description/README.
"""
    return prompt.strip()


def build_simple_prompt(
    repo_name: str,
    description: str | None,
    readme: str | None,
    tree_text: str | None = None,
) -> str:
    readme_content = (readme or "No README provided")[:4000]
    tree_content = (tree_text or "No file tree provided")[:1500]

    prompt = f"""
You are a senior software engineer.

Summarize this GitHub repository in a concise bullet-point format.

Repository:
- Name: {repo_name}
- Description: {description or "No description provided"}

README content:
{readme_content}

Repo structure:
{tree_content}

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
- Base bullets strictly on the provided README and structure.
- Do NOT invent features, architecture, or details not present in the input.
- Optional: end with one extra line starting with:
Also interesting:
- No quotes.

Make it feel like a human developer explaining to another developer in simple terms.
""".strip()

    return prompt