# ExplainThisRepo

ExplainThisRepo is a CLI (Command Line Interface) tool that automatically generates plain-English explanations of GitHub repositories. It's designed to help developers quickly understand what any public GitHub repository does by analyzing its contents and creating an `EXPLAIN.md` file.

[![PyPI Version](https://img.shields.io/pypi/v/explainthisrepo?color=blue)](https://pypi.org/project/explainthisrepo/)
[![PyPI Downloads](https://static.pepy.tech/personalized-badge/explainthisrepo?period=total&units=INTERNATIONAL_SYSTEM&left_color=BLACK&right_color=GREEN&left_text=downloads)](https://pepy.tech/projects/explainthisrepo)
[![Python](https://img.shields.io/pypi/pyversions/explainthisrepo)](https://pypi.org/project/explainthisrepo/)
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

Requirements: Python 3.9+

## Option 1: You can install via pip (recommended):

```bash
pip install explainthisrepo
```

## Option 2: Install with pipx
```bash
pipx install explainthisrepo
```

---

## 🧪 Usage

```bash
explainthisrepo owner/repo
```

## 🧾 Example
```bash
explainthisrepo facebook/react
```
This generates:

`EXPLAIN.md`

Open the file in your editor to read the explanation

---

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
