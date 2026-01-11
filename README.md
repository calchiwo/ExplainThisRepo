# ExplainThisRepo

ExplainThisRepo is a CLI tool that takes a GitHub repository and generates a plain-English explanation into an `EXPLAIN.md` file.

PyPi: https://pypi.org/project/explainthisrepo

Website: explainthisrepo.com

---

![demo](https://github.com/user-attachments/assets/4fe02b94-0f7a-4fc4-bdc8-2f4d259a1f0b)

## Install ExplainThisRepo once and explain any GitHub repo

### Requirements
- Python 3.9+

### Option 1: Install with pip (recommended)
```python
pip install explainthisrepo
```

---

## Option 2: Install with pipx
```python
pipx install explainthisrepo
```

---

## What it does

- Fetches a public GitHub repository
- Reads the README and key repo metadata
- Generates a clear explanation of what the repo does
- Writes the result to `EXPLAIN.md` in your current directory

---

## Usage

```bash
explainthisrepo owner/repo
```

## Example
```bash
explainthisrepo octocat/Hello-World
```
This generates:

EXPLAIN.md

Open the file in your editor to read the explanation

---

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
