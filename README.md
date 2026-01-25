# ExplainThisRepo

ExplainThisRepo is a CLI (Command Line Interface) tool that automatically generates plain-English explanations of GitHub repositories. It's designed to help developers quickly understand what any public GitHub repository does by analyzing its contents and creating an `EXPLAIN.md` file.

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

This tool solves the problem of understanding unfamiliar codebases. Instead of manually reading through code and documentation, developers can use this CLI to generate a clear, readable explanation of any GitHub repository.

---

## ⚡ Key Features

- Fetches public GitHub repositories automatically

- Analyzes README and repository metadata to understand the project

- Generates clear explanations in plain English

- Outputs a EXPLAIN.md file in your current directory

- Simple command-line interface for ease of use

---

## 📦 Installation


## Option 1: Run with npm (recommended for most devs)

No Python setup required. Runs anywhere Node runs.

```bash
npx explainthisrepo owner/repo
```

If you want it installed globally:
```bash
npm install -g explainthisrepo
explainthisrepo owner/repo
```

Requirements: Python 3.9+

## Option 2: You can install via pip (recommended):

```bash
pip install explainthisrepo
```

## Option 3: Install with pipx
```bash
pipx install explainthisrepo
```

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

---

### Detailed mode

Generate a more detailed explanation (includes architecture / folder structure):
```bash
explainthisrepo owner/repo --detailed
```

---

### Simple mode

Prints only the simple output (no EXPLAIN.md)
```bash
explainthisrepo owner/repo --simple
```

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
## ⚙️ Quickstart

```bash
pip install explainthisrepo
explainthisrepo owner/repo
```

## 🔑 Configuration

ExplainThisRepo uses Gemini.

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
