# ExplainThisRepo

ExplainThisRepo is a CLI tool that takes a GitHub repository and generates a plain-English explanation into an `EXPLAIN.md` file.

---

## What it does

- Fetches a public GitHub repository
- Reads the README and key repo metadata
- Generates a clear explanation of what the repo does
- Writes the result to `EXPLAIN.md` in your current directory

Useful when:
- You open a repo and don’t know where to start
- You’re reviewing unfamiliar code
- You want quick context without digging through files

---

## Install

### Requirements
- Python 3.9+
- pipx (recommended)

### Install with pipx
```python
pipx install explainthisrepo
```

If you don’t have pipx:

```
python -m pip install --user pipx
python -m pipx ensurepath
```

Restart your terminal after running ensurepath.


---

Usage
```
explainthisrepo owner/repo
```

Example:

```
explainthisrepo octocat/Hello-World
```

This will generate:

EXPLAIN.md


---

Output

The generated EXPLAIN.md contains:

What the repository does

Its main purpose

How it’s typically used

High-level structure (based on available info)


If a README is missing or weak, ExplainThisRepo still attempts a best-effort explanation.


---

Configuration

ExplainThisRepo uses Gemini.

Set your API key as an environment variable:

macOS / Linux

export GEMINI_API_KEY="your_api_key_here"

Windows (PowerShell)

setx GEMINI_API_KEY "your_api_key_here"

Restart your terminal after setting the key.


---

Limitations

Public repositories only

Quality depends on available repo information

Not a code walkthrough or documentation generator


This tool explains intent, not implementation details.


---

Roadmap

Smarter fallback when README is missing

Optional provider switching

Better file selection logic

Shorter explanations mode



---

Why this exists

Most repositories don’t explain themselves well.

ExplainThisRepo exists to answer one question fast:

> “What does this repo actually do?”




---

License

MIT


---

Author

Built by Caleb Wodi
https://x.com/calchiwo
