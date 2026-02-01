# ExplainThisRepo

ExplainThisRepo is a CLI (Command Line Interface) tool that generates plain-English explanations of public GitHub repositories by analyzing repository structure, README content, and selected high-signal files. It's designed to help developers quickly understand what any public GitHub repository does by analyzing its contents and creating an `EXPLAIN.md` file.

[![PyPI Version](https://img.shields.io/pypi/v/explainthisrepo?color=blue)](https://pypi.org/project/explainthisrepo/)
[![PyPI Downloads](https://static.pepy.tech/personalized-badge/explainthisrepo?period=total&units=INTERNATIONAL_SYSTEM&left_color=BLACK&right_color=GREEN&left_text=downloads)](https://pepy.tech/projects/explainthisrepo)
[![Python](https://img.shields.io/pypi/pyversions/explainthisrepo?logo=python&logoColor=white)](https://pypi.org/project/explainthisrepo/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/explainthisrepo)](https://www.npmjs.com/package/explainthisrepo)
[![Node](https://img.shields.io/node/v/explainthisrepo)](https://www.npmjs.com/package/explainthisrepo)
[![Docs](https://img.shields.io/badge/docs-explainthisrepo.com-black)](https://explainthisrepo.com)

---

![demo](https://github.com/user-attachments/assets/837e0593-db64-4657-8855-bb1915011eb6)

## 🎯 Purpose

This tool solves the problem of understanding unfamiliar codebases. It speeds up onboarding by turning repository structure and code signals into a clear, readable explanation of any public GitHub repository.

---

## ⚡ Key Features

- Fetches public GitHub repositories automatically
- Analyzes repository structure and high-signal source files, not just README
- Uses real repository data (file tree, configs, entrypoints) to ground explanations
- Extracts repo signals from key files (package.json, pyproject.toml, config files, entrypoints)
- Builds a file tree summary to understand project architecture
- Detects programming languages via the GitHub API
- Accepts repositories via owner/repo, GitHub URLs (with or without https), including issue/PR links and query strings, and SSH clone links
- Generates clear explanations in plain English
- Outputs an EXPLAIN.md file in your current directory (default mode)
- Multi-mode command-line interface

---

## 🧭 Modes

- (no flag) → Full repository explanation written to EXPLAIN.md

- --quick → One-sentence summary

- --simple → Short, easy explanation

- --detailed → Deeper explanation including structure and architecture

- --stack → Tech stack breakdown from repo signals

- --version → Show CLI version

- --help → Show usage guide

---

## 📦 Installation

## Option 1: install via pip (recommended):

Requirements: Python 3.9+

```bash
pip install explainthisrepo
explainthisrepo owner/repo
```

Alternatively,

```bash
pipx install explainthisrepo
explainthisrepo owner/repo
```

## Option 2: Install with npm

Install globally and use forever:
```bash
npm install -g explainthisrepo
explainthisrepo owner/repo
# or: npx explainthisrepo owner/repo
```

---

## 🔗 Flexible Repository Input

You don’t need to reformat links anymore.

ExplainThisRepo accepts GitHub repositories the way you actually copy them.
```bash
explainthisrepo https://github.com/owner/repo
explainthisrepo github.com/owner/repo
explainthisrepo https://github.com/owner/repo/issues/123
explainthisrepo https://github.com/owner/repo?tab=readme
explainthisrepo git@github.com:owner/repo.git
```

All inputs are normalized internally to owner/repo.
No change to engine behavior. Just less friction.

---

## 🧪 Usage

### Basic
Generate a full explanation and saves it to `EXPLAIN.md`:

```bash
explainthisrepo owner/repo
```
Example:
```bash
explainthisrepo facebook/react
```
---

### Quick mode

Get a one-sentence definition (prints only, no file created):
```bash
explainthisrepo owner/repo --quick
```
Example:
```bash
explainthisrepo facebook/react --quick
```
![Quick Mode Output](assets/quick-command-output.png)

---

### Detailed mode

Generate a more detailed explanation (includes architecture / folder structure):
```bash
explainthisrepo owner/repo --detailed
```

![Detailed Mode Output](assets/detailed-command-output.png)

---

### Simple mode

Prints only the simple output (no EXPLAIN.md)
```bash
explainthisrepo owner/repo --simple
```

![Simple Mode Output](assets/simple-command-output.png)

---

### Stack detector

Get a tech stack breakdown detected from repo signals. No AI explanation. Prints only.
```bash
explainthisrepo owner/repo --stack
```
![Stack detector Output](assets/stack-command-output.png)

### Version

Print the installed version:
```bash
explainthisrepo --version
```

---

### Doctor

Check environment + connectivity (useful for debugging):
```bash
explainthisrepo --doctor
```

## 🔑 Configuration

ExplainThisRepo uses Gemini models for code analysis.

Set your API key as an environment variable.

macOS / Linux

```linux
export GEMINI_API_KEY="your_api_key_here"
```

Windows (PowerShell)

```powershell
setx GEMINI_API_KEY "your_api_key_here"
```

Restart your terminal after setting the key.

## Termux (Android) install notes

Termux has some environment limitations that can make `pip install explainthisrepo` fail to create the `explainthisrepo` command in `$PREFIX/bin`.

### Recommended install (Termux)

```bash
pip install --user -U explainthisrepo
```

Make sure your user bin directory is on your PATH:
```bash
export PATH="$HOME/.local/bin:$PATH"
```
> Tip: Add the PATH export to your ~/.bashrc or ~/.zshrc so it persists.

Alternative (No PATH changes)

If you do not want to modify PATH, you can run ExplainThisRepo as a module:

```bash
python -m explain_this_repo owner/repo
```

Gemini support on Termux (Optional)

Installing Gemini support may require building Rust-based dependencies on Android, which can take time on first install:

```bash
pip install --user -U "explainthisrepo[gemini]"
```

## Contributions

Contributions are welcome!

If you find a bug, have an idea, or want to improve the tool:
- See [CONTRIBUTING](CONTRIBUTING.md) for setup and guidelines
- Open an issue for bugs/feature requests
- Or submit a pull request for fixes/improvements

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Author

Caleb Wodi

- [Twitter](https://x.com/calchiwo)
- [LinkedIn](https://linkedin.com/in/calchiwo)
- [Portfolio](https://calebwodi.vercel.app)
