def build_prompt(repo_name: str, description: str | None, readme: str | None) -> str:
    return f"""
You are a senior software engineer.

Your task is to explain a GitHub repository clearly and concisely for a human reader.

Repository:
- Name: {repo_name}
- Description: {description or "No description provided"}

README content:
{readme or "No README provided"}

Instructions:
- Explain what this project does.
- Say who it is for.
- Explain how to run or use it.
- Do not assume missing details.
- If something is unclear, say so.
- Avoid hype or marketing language.
- Be concise and practical.
- Use clear markdown headings.

Output format:
# Overview
# What this project does
# Who it is for
# How to run or use it
# Notes or limitations
""".strip()
