# ExplainThisRepo 🕵️‍♂️

**Code Analysis so deep, it feels like an interrogation.**
[![PyPI Version](https://img.shields.io/pypi/v/explainthisrepo?color=blue)](https://pypi.org/project/explainthisrepo/)
[![PyPI Downloads](https://static.pepy.tech/personalized-badge/explainthisrepo?period=total&units=INTERNATIONAL_SYSTEM&left_color=BLACK&right_color=GREEN&left_text=downloads)](https://pepy.tech/projects/explainthisrepo)
[![Python](https://img.shields.io/pypi/pyversions/explainthisrepo)](https://pypi.org/project/explainthisrepo/)
[![Docs](https://img.shields.io/badge/docs-explainthisrepo.com-black)](https://explainthisrepo.com)

ExplainThisRepo is an agentic CLI tool that turns any GitHub repository into a clear, plain-English explanation. Powered by [OmniCoreAgent](https://github.com/omnirexflora-labs/omnicoreagent), it doesn't just read the README—it reads the code, maps the architecture, and judges the quality.

---

## ⚡ Key Features

- **Automated Analysis**: Fetches and explains public GitHub repositories automatically.
- **Deep Understanding**: Analyzes README, metadata, and source code.
- **Plain English Output**: Generates clear `EXPLAIN.md` documentation.
- **The Repository Council**: Spawns specialized agents (Security, Performance, Style) for detailed audits (`--audit`).
- **Interactive Chat**: Allows you to ask questions and "talk" to the repository after analysis.
- **Architecture Visualization**: Automatically generates Mermaid.js structure diagrams.
- **Simple CLI**: Easy-to-use command line interface.

---

## 🚀 Quick Start

### Install
```bash
pip install explainthisrepo
```

## Option 2: Install with pipx
```bash
pipx install explainthisrepo
```

*Requires Python 3.10+*

### Setup API Key
Set your unified API key (OmniCoreAgent maps this to OpenAI, Anthropic, Gemini, etc.):
```bash
# macOS / Linux
export LLM_API_KEY="your_api_key_here"

# Windows (PowerShell)
setx LLM_API_KEY="your_api_key_here"
```
Restart your terminal after setting the key.
### 1. The Standard Explanation
Generates `EXPLAIN.md` with Overview, Architecture, and Usage.
```bash
explainthisrepo facebook/react
```

### 2. Summon The Council (Audit Mode) 🏛️
Get a graded security and performance review.
```bash
explainthisrepo facebook/react --audit
```
*Writes to `AUDIT.md`*

### 3. Deep Analysis with Specific Models
Want Claude 3.5 Sonnet to analyze a complex repo deeply?
```bash
explainthisrepo pandas-dev/pandas \
  --provider anthropic \
  --model claude-3-5-sonnet-20240620 \
  --depth deep
```

---

## 🧠 Interact with your Repo: Conversation Workflows

The real power is in the **follow-up**. Try these conversation chains:

### 🆕 The "New Hire" Flow
Use this when you join a new project and are lost.
1. "What is the entry point of this application?"
2. "Which file handles the database connection?"
3. "Walk me through the data flow when a user logs in."

### 🐛 The "Bug Hunter" Flow
Use this when debugging a specific issue.
1. "Where is the `process_payment` function defined?"
2. "What exceptions can this function raise?"
3. "Write a unit test that forces this function to fail."

### 🏗️ The "Architect" Flow
Use this to understand the big picture.
1. "Generate a mermaid diagram for the `core` module."
2. "Are there any circular dependencies between these files?"
3. "How would you refactor `utils.py` to be more modular?"

### 👮 The "Security Audit" Flow
1. "Are there any hardcoded API keys in the code?"
2. "Does the `/login` route have rate limiting?"
3. "Analyze `auth.py` for potential SQL injection vulnerabilities."

---

## Command Line Options

| Flag | Description | Default |
|------|-------------|---------|
| `--provider` | LLM Provider (`openai`, `anthropic`, `gemini`, `groq`) | `gemini` |
| `--model` | Specific model name | `gemini-2.0-flash` |
| `--depth` | `quick` (metadata), `standard` (key files), `deep` (full logic) | `standard` |
| `--audit` | **Run The Repository Council** instead of standard explanation | `False` |
| `--verbose`, `-v` | Show the agent's "thinking" process | `False` |
| `--debug` | Enable debug mode | `False` |

---

## Powered By OmniCoreAgent
This project showcases the power of the **OmniCoreAgent** framework:
*   **Sub-Agent Orchestration**: Coordinating the Council members.
*   **Local Tools**: File system and GitHub API integration without MCP complexity.
*   **Context Management**: Handling massive codebases without blowing up the context window.

## Contributions

Contributions are welcome.

If you find a bug, have an idea, or want to improve the tool:
- Open an issue
- Or submit a pull request

--- 
## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Author

Caleb Wodi

- [Twitter](https://x.com/calchiwo)
- [LinkedIn](https://linkedin.com/in/calchiwo)
- [Portfolio](https://calebwodi.vercel.app)
