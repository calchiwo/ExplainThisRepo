# Contributing to ExplainThisRepo

Thanks for contributing.

ExplainThisRepo is a CLI that explains codebases using real project signals, not blind AI guessing.

## System Reality (Read This First)

The architecture is not symmetric.

- **Python** → core system (source of truth)
- **PyInstaller** → builds native binaries
- **Node** → thin launcher only (npm distribution)

> If you misunderstand this, you will break the system.

### Hard rule

All logic lives in Python.
Node must remain a launcher.

## Architecture Overview

### Python Core (`explain_this_repo/`)

This is the product.

It handles:

- Repository analysis (GitHub + local)
- Signal extraction (entrypoints, configs, manifests, structure)
- Dependency graph understanding
- Prompt construction
- LLM provider routing
- Output generation (`EXPLAIN.md`, stdout, custom formats)
- CLI flags and behavior
- Config and initialization (`init`)
- Diagnostics (`--doctor`)

If behavior changes, it happens here.

### Native Binaries (PyInstaller)

Python is compiled into platform-specific executables:

- macOS
- Linux
- Windows

These binaries are what users actually run via npm.

### Node Layer (`node_version/`)

This is distribution only.

**Node does:**

- Detect platform
- Select correct binary
- Execute it with user args

**Node does NOT:**

- Analyze repositories
- Read files
- Call LLMs
- Build prompts
- Detect stacks
- Handle config

> If you add logic here, you are doing it wrong.

## Ways to Contribute

Focus on the actual system, not the wrapper.

### High value contributions

- Improve signal extraction accuracy
- Better entrypoint detection
- Better handling of monorepos
- Reduce hallucination via stronger grounding
- Improve prompt construction
- Improve output clarity and structure
- Add or improve LLM providers
- Performance improvements (IO, parsing, API usage)
- Error handling and diagnostics
- Test coverage

### Low value contributions

- Adding logic to Node launcher
- Cosmetic abstractions that increase complexity
- Features that rely on guessing instead of signals

## Before You Start

1. Check existing issues or open one
2. Keep PRs small and surgical
3. Prefer correctness over cleverness
4. Reduce edge cases, don't multiply them
5. Don't introduce unnecessary dependencies

## Development Setup

### Requirements

- Python 3.9+
- Node.js 18+
- pip
- npm
- make

### Clone the Repository

```bash
git clone https://github.com/calchiwo/ExplainThisRepo.git
cd ExplainThisRepo
```

## Python Development (Core)

This is where you work.

### Install dependencies

```bash
make install
```

### Install developement dependencies

```bash
make dev
```

### Install editable package

This allows running the CLI directly from the local sourc

```bash
pip install -e .
```

### Run CLI (Python)

```bash
python -m explain_this_repo facebook/react
```

### Diagnostics

```bash
make doctor
```

Equivalent:

```bash
python -m explain_this_repo --doctor
```

### Tests

```bash
make test
```

### Linting

```bash
make lint
```

### Formatting

```bash
make format
```

Runs:

- `black`
- `isort`

### Build Python Package

```bash
make build
```

### Build Native Binaries

Maintainers only:

Any change to core logic requires rebuilding binaries.

> If you don't do this, npm users are running stale logic.

Use PyInstaller via project scripts:

```bash
make build-binaries
```

## Node Launcher Development

Location: `node_version/`

This layer must stay minimal.

### Allowed changes

- Platform detection fixes
- Binary resolution fixes
- Packaging improvements

### Not allowed

- Business logic
- Feature additions
- CLI behavior changes

If you need any of those:

→ change Python  
→ rebuild binaries

### Build Node package

```bash
make build-node
```

### Run Node locally

```bash
node node_version/dist/cli.js facebook/react
```

## LLM Provider Architecture

Providers are pluggable.

Each provider:

- Implements a common interface
- Is resolved via provider registry
- Must be deterministic in structure, not prompt guessing

Current providers include:

- Gemini
- OpenAI
- Ollama
- Anthropic
- Groq
- OpenRouter

### Contribution rules

- No provider-specific hacks leaking into core logic
- Keep interface clean and consistent
- Fail loudly and clearly

## Code Style Guidelines

- Small, focused functions
- Explicit logic over cleverness
- Deterministic behavior > heuristic guessing
- Clear error messages
- Stable CLI output

## Pull Requests

Before submitting a PR, ensure::

- [ ] Change is necessary and scoped
- [ ] Tested locally (Python CLI)
- [ ] Binaries rebuilt if core changed
- [ ] No logic added to Node layer
- [ ] Docs updated if behavior changed

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add feature
fix: resolve bug
docs: update docs
refactor: internal change
chore: maintenance
```

## Reporting Bugs

Include:

- OS (Windows / macOS / Linux / Termux)
- Python version (if using pip)
- Node version (if using npm)
- Command executed
- Full error output
- Target repo (`owner/repo`)

## What Will Get Your PR Rejected

- Logic added to Node launcher
- Features that bypass signal extraction
- Prompt hacks instead of system fixes
- Over-engineering simple paths
- Breaking CLI output consistency