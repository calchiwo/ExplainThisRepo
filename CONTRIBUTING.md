# Contributing to ExplainThisRepo

Thanks for wanting to contribute.

This project is a CLI tool that explains GitHub repositories in plain English by analyzing repo structure, README content, and selected code files.

## Ways to contribute

- Fix bug
- Improve CLI UX (flags, output clarity, error messages)
- Add support for more repo layouts (monorepos, unusual entrypoints)
- Improve documentation
- Add tests

## Before you start

1. Check existing issues (or open one)
2. Keep pull request small and focused
3. Prefer fixes that reduce edge cases and improve reliability

## Development setup

### Requirements
- Python 3.9+
- Node.js 18+
- pip
- npm

### Clone
```bash
git clone https://github.com/calchiwo/ExplainThisRepo.git
cd ExplainThisRepo
```
## Python version (PyPI package)

### Install dependencies

```bash
pip install -r requirements.txt
```
### Install in editable mode
```bash
pip install -e .
```
### Run
```bash
python -m explain_this_repo facebook/react
```

## Node version (npm package)

```bash
cd node_version
npm install
npm run build
node dist/cli.js facebook/react
```

### Test flags
```bash
node dist/cli.js --doctor
node dist/cli.js --version
node dist/cli.js facebook/react --detailed
```

## Code style

* Keep code readable and direct
* Avoid over-engineering
* Prefer small pure functions
* Handle errors clearly with actionable messages


## Pull Requests

PR checklist

* [ ] Describe what you changed and why
* [ ] Explain how you tested it
* [ ] Keep changes focused
* [ ] Update documentation if behavior changed

### Commit messages

Use conventional commits when possible:

* fix: ...
* feat: ...
* docs: ...
* chore: ...

## Reporting bugs

When opening an issue, include:

* OS + terminal (Windows/macOS/Linux/Termux)
* Node/Python version
* Command run
* Full error output
* Repo used to reproduce (owner/repo)


Thanks again for helping improve ExplainThisRepo
