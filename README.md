# ExplainThisRepo

_The fastest way to understand any codebase in plain English using real project signals. Not blind AI summarization._

ExplainThisRepo analyzes real project signals; configs, entrypoints, manifests, dependencies graph, file structure and high-signal files producing a clear, structured `EXPLAIN.md` that explains what the codebase does and how it is organized in plain English.

[![PyPI Version](https://img.shields.io/pypi/v/explainthisrepo?color=blue)](https://pypi.org/project/explainthisrepo/)
[![PyPI Downloads](https://static.pepy.tech/personalized-badge/explainthisrepo?period=total&units=INTERNATIONAL_SYSTEM&left_color=BLACK&right_color=GREEN&left_text=downloads)](https://pepy.tech/projects/explainthisrepo)
[![Python](https://img.shields.io/pypi/pyversions/explainthisrepo?logo=python&logoColor=white)](https://pypi.org/project/explainthisrepo/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/explainthisrepo)](https://www.npmjs.com/package/explainthisrepo)
[![Node](https://img.shields.io/node/v/explainthisrepo)](https://www.npmjs.com/package/explainthisrepo)
[![Docs](https://img.shields.io/badge/docs-explainthisrepo.com-black)](https://explainthisrepo.com)

![demo](https://github.com/user-attachments/assets/837e0593-db64-4657-8855-bb1915011eb6)

## Key Features

- Understand any GitHub repository in seconds
- Derives architectural summaries from repository structure and code signals.
Not blind AI summarization.
- Translates complex code structures into plain English
- Extract architecture signals from configs, entrypoints, and manifests
- Works with GitHub repositories, local directories, private repositories, and monorepos
- Outputs the explanation to an `EXPLAIN.md` file in your current directory or prints it directly in the terminal
- Multiple explanation modes (quick, simple, detailed)

## Installation

### Option 1: install with pip (recommended):

Requirements: Python 3.9+

```bash
pip install explainthisrepo
explainthisrepo owner/repo

# pip install explainthisrepo
# explainthisrepo .
```

Alternatively,

```bash
pipx install explainthisrepo
explainthisrepo owner/repo
```

To install support for specific models:

```bash
pip install explainthisrepo[gemini]
pip install explainthisrepo[openai]
pip install explainthisrepo[anthropic]
pip install explainthisrepo[groq]
```

### Option 2: Install with npm

Install globally and use forever:

```bash
npm install -g explainthisrepo
explainthisrepo owner/repo

# npm install -g explainthisrepo
# explainthisrepo .
```

Or without install:

```bash
npx explainthisrepo owner/repo
```

Replace `owner/repo` with the GitHub repository identifier (e.g., `facebook/react`).

### Option 3: Download standalone binary

Prebuilt standalone binaries are available for macOS, Linux, and Windows.

> Standalone binaries require no Python or Node installation and run as a single executable.

Download the latest release:

[github.com/calchiwo/ExplainThisRepo/releases/latest](https://github.com/calchiwo/ExplainThisRepo/releases/latest)

Or install directly:

macOS

```bash
curl -L https://github.com/calchiwo/ExplainThisRepo/releases/latest/download/explainthisrepo-darwin-arm64 -o explainthisrepo
chmod +x explainthisrepo
```

Linux
```bash
curl -L https://github.com/calchiwo/ExplainThisRepo/releases/latest/download/explainthisrepo-linux-x64 -o explainthisrepo
chmod +x explainthisrepo
```

Windows (PowerShell)

```powershell
curl -L https://github.com/calchiwo/ExplainThisRepo/releases/latest/download/explainthisrepo-win-x64.exe -o explainthisrepo.exe
```

## Configuration

ExplainThisRepo supports multiple LLM models:

- Gemini
- OpenAI
- Ollama (local or cloud-routed)
- Anthropic
- Groq
- OpenRouter

Use the built-in `init` command to configure your preferred model:

```bash
explainthisrepo init
# or npx explainthisrepo init
```

> For details about how initialization works, see [INIT.md](INIT.md).


## Flag options

- (no flag) → Full repository explanation written to `EXPLAIN.md`

- `--quick` → One-sentence summary

- `--simple` → Short, simplified explanation

- `--detailed` → Deeper explanation including structure and architecture

- `--stack` → Tech stack breakdown from repo signals

- `--version` → Check installed CLI version

- `--help` → Show usage guide

- `--doctor` → Check system health and active model diagnostics

- `--llm` → Override provider selection

- `--token/-t` → Set GitHub token for private repositories and to avoid rate limits

## Flexible Repository and Local Directory Input

Accepts various formats for repository input, full GitHub URLs (with or without https), `owner/repo` format, issue links, query strings, and SSH clone links

```bash
explainthisrepo https://github.com/owner/repo
explainthisrepo github.com/owner/repo
explainthisrepo https://github.com/owner/repo/issues/123
explainthisrepo https://github.com/owner/repo?tab=readme
explainthisrepo git@github.com:owner/repo.git
explainthisrepo .
explainthisrepo ./path/to/directory
```

All inputs are normalized internally to `owner/repo`.

## Model selection

The `--llm` flag selects which configured model backend to use for the current command.

```bash
explainthisrepo owner/repo --llm gemini
explainthisrepo owner/repo --llm openai
explainthisrepo owner/repo --llm ollama
explainthisrepo owner/repo --llm anthropic
explainthisrepo owner/repo --llm openrouter
explainthisrepo owner/repo --llm groq
```

`--llm` works with all modes (``--quick``, ``--simple``, ``--detailed``).

## Command line usage

### Default
Writes a full explanation to `EXPLAIN.md`:

```bash
explainthisrepo owner/repo
#e.g. explainthisrepo vercel/next.js
```

### Quick mode

Prints a one-sentence summary to stdout:
```bash
explainthisrepo owner/repo --quick
# explainthisrepo facebook/react --quick
```

```bash
$ explainthisrepo vercel/next.js --quick

Next.js is a React framework that provides server-side rendering,
file-based routing, API routes, and build tooling for fullstack
web applications.
```

![Quick Mode Output](assets/quick-command-output.png)

---

### Detailed mode

Writes a more detailed explanation of repository structure and architecture:

```bash
explainthisrepo owner/repo --detailed
```

![Detailed Mode Output](assets/detailed-command-output.png)

---

### Simple mode

Prints a short, simplified explanation to stdout. No files are written.

```bash
explainthisrepo owner/repo --simple
```

![Simple Mode Output](assets/simple-command-output.png)

---

### Stack detector

Tech stack breakdown detected from repo signals. No LLM calls are made.

```bash
explainthisrepo owner/repo --stack
```
![Stack detector Output](assets/stack-command-output.png)

## Local Directory Analysis

ExplainThisRepo can analyze local directories directly in the terminal, using the same modes and output formats as GitHub repositories

```bash
explainthisrepo .
explainthisrepo ./path/to/directory
```

This works with all existing modes:

```bash
explainthisrepo . --quick
explainthisrepo . --simple
explainthisrepo . --detailed
explainthisrepo . --stack
```

When analyzing a local directory:
- Repository structure is derived from the filesystem
- High signal files (configs, entrypoints, manifests) are extracted locally
- No GitHub APIs calls are made
- All prompts and outputs remain identical

This allows analysis of projects directly from the local filesystem, without requiring a GitHub repository.

### For private repositories, use the --token/-t option.

Setting a `GITHUB_TOKEN` environment variable is recommended to avoid rate limits when analyzing public repositories.

```bash
export GITHUB_TOKEN=yourActualTokenHere
```

### Version

Check the installed CLI version:

```bash
explainthisrepo --version
```

### Diagnostics

Use the `--doctor` flag to verify the environment, network connectivity, and API key configuration:

```bash
explainthisrepo --doctor
```

## Termux (Android) install notes

Termux has some environment limitations that can make `pip install explainthisrepo` fail to create the `explainthisrepo` command in `$PREFIX/bin`.

However, it's recommended you install using:

```bash
pip install --user -U explainthisrepo
```

Make sure your user bin directory is on your PATH:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

> Tip: Add the PATH export to your `~/.bashrc` or `~/.zshrc` so it persists.

### Alternative (No PATH changes)

If you do not want to modify PATH, you can run ExplainThisRepo as a module:

```bash
python -m explain_this_repo owner/repo
```

### Gemini support on Termux

Installing Gemini support may require building Rust-based dependencies on Android, which can take time on first install:

```bash
pip install --user -U "explainthisrepo[gemini]"
```

For mobile environments like Termux where compiling Python dependencies can be slow,
you can also run ExplainThisRepo using the Node.js version:

```bash
npx explainthisrepo owner/repo
```

## Special Thanks

- @Spectra010s for implementing the Node.js version of ExplainThisRepo and improving installation support for mobile environments like Termux
- @HalxDocs for implementing the `--detailed` mode for deeper architectural explanations

## Contributions

Contributions are welcome!

If you find a bug, have an idea, or want to improve the tool:
- See [CONTRIBUTING](CONTRIBUTING.md) for setup and guidelines
- Open an issue for bugs/feature requests
- Or submit a pull request for fixes/improvements

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

Caleb Wodi

- Email: caleb@explainthisrepo.com
- LinkedIn: [@calchiwo](https://linkedin.com/in/calchiwo)
- Twitter: [@calchiwo](https://x.com/calchiwo)