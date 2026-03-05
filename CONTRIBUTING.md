# Contributing to ExplainThisRepo

Thanks for contributing to ExplainThisRepo.

ExplainThisRepo is a CLI tool that generates plain-English explanations of codebases by analyzing repository structure, README content, and high-signal files.

The project consists of:

- A Python CLI (published on PyPI)

- A Node CLI with feature parity (published on npm)

Both share the same architecture and behavior.

## Ways to Contribute

Contributions are welcome in several areas:

- Bug fixes

- CLI UX improvements (flags, output clarity, error messages)

- Support for additional repository layouts (monorepos, unconventional entrypoints)

- New CLI features or flags

- Documentation improvements

- Test coverage

- Improvements to the LLM provider architecture

## Before You Start

Before opening a pull request:

1. Check existing issues or open a new one describing the problem.

2. Keep pull requests small and focused.

3. Prefer fixes that reduce edge cases and improve reliability.

4. Avoid introducing unnecessary dependencies or complexity.


## Development Setup

Requirements

- Python 3.9+

- Node.js 18+

- pip

- npm

- make

## Clone the Repository

```bash
git clone https://github.com/calchiwo/ExplainThisRepo.git
cd ExplainThisRepo
```

## Python Development

The Python implementation is the reference CLI distributed on PyPI.

### Install dependencies

```bash
make install
```

### Install development dependencies

```bash
make dev
```

### Install editable package

This allows running the CLI directly from the local source:

```bash
pip install -e .
```

## Running the Python CLI

```bash
python -m explain_this_repo facebook/react
```

## Running Diagnostics

```bash
make doctor
```

Equivalent command:

```bash
python -m explain_this_repo --doctor
```

## Running Tests

```bash
make test
```

## Linting

```bash
make lint
```

## Code Formatting

```bash
make format
```

This runs:

- black

- isort


## Build the Python Package

```bash
make build
```

## Publish to PyPI

Maintainers only:

```bash
make publish
```

## Node CLI Development

ExplainThisRepo also ships a Node.js CLI with feature parity published to npm.

The Node implementation mirrors the Python CLI architecture and behavior while using the Node ecosystem (TypeScript, npm distribution).

Both CLIs support:

- Repository analysis (GitHub or local directories)

- Multiple explanation modes (`--quick`, `--simple`, `--detailed`)

- Stack detection

- Diagnostics (`--doctor`)

- Pluggable LLM providers (`gemini`, `openai`, `ollama`)


The Python and Node implementations evolve together to maintain consistent CLI behavior across ecosystems.

### Build Node CLI

```bash
make build-node
```

### Run Node CLI

```bash
make run-node
```
### Run Node diagnostics

```bash
make doctor-node
```

## Code Style Guidelines

When contributing code:

- Keep functions small and focused

- Prefer explicit logic over clever abstractions

- Avoid unnecessary dependencies

- Handle errors with clear, actionable messages

- Preserve CLI output stability when possible

## Pull Requests

Before submitting a PR, ensure:

- [ ] The change is clearly described
- [ ] The change is tested locally
- [ ] Documentation is updated if behavior changed
- [ ] The PR is small and focused

## Commit Messages

Prefer Conventional Commits:

```bash
feat: add new feature
fix: resolve bug
docs: update documentation
refactor: internal code change
chore: maintenance change
```

## Reporting Bugs

When opening an issue, include:

- Operating system (Windows / macOS / Linux / Termux)

- Python version

- Node version

- Command executed

- Full error output

- Repository used for reproduction (`owner/repo`)


## Architecture Notes

ExplainThisRepo uses a pluggable LLM provider architecture.

Providers implement the ``LLMProvider`` interface and are resolved through the provider registry.

Current supported providers:

- Gemini

- OpenAI

- Ollama

---

Thanks for helping improve ExplainThisRepo.