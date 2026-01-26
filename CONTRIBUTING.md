# Contributing to ExplainThisRepo

Thanks for wanting to contribute.

This project is a CLI tool that explains GitHub repositories in plain English by analyzing repo structure, README content, and selected code files.

## Ways to contribute

- Fix bugs
- Improve CLI UX (flags, output, error messages)
- Add support for more repo layouts (monorepos, unusual entrypoints)
- Improve documentation
- Add tests

## Before you start

1. Check existing issues (or open one)
2. Keep PRs small and focused
3. Prefer fixes that reduce edge cases and improve reliability

## Development setup

### Requirements
- Node.js 18+
- npm
- Python 3.9+ (only if working on PyPI version)

### Clone
```bash
git clone https://github.com/calchiwo/ExplainThisRepo.git
cd ExplainThisRepo
```
## Node version (npm)

### Install
```bash
cd node_version
npm install
```
### Run
```bash
npm run build
node dist/cli.js facebook/react
```

### Test flags
```bash
node dist/cli.js --doctor
node dist/cli.js --version
node dist/cli.js facebook/react --detailed
```

## Python version (PyPI)

### Install dependencies

```bash
pip install -r requirements.txt
```
### Install (editable)
```bash
pip install -e .
```
### Run
```bash
python -m explain_this_repo facebook/react
```
## Code style

* Keep code readable and direct
* Avoid over-engineering
* Prefer small pure functions
* Handle errors clearly with actionable messages


## Pull Requests

PR checklist

* [ ] Explain what you changed and why
* [ ] Include how you tested it
* [ ] Keep changes small and focused
* [ ] Update docs if behavior changed

### Commit messages

Use conventional commits when possible:

* fix: ...
* feat: ...
* docs: ...
* chore: ...

## Reporting bugs

When opening an issue, include:

* OS + terminal (Windows/macOS/Linux/Termux)

### Node/Python version

* Command run
* Full error output
* Repo used to reproduce (owner/repo)


Thanks again for helping improve ExplainThisRepo.
