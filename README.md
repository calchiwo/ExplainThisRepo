# ExplainThisRepo

ExplainThisRepo is a CLI tool that takes a GitHub repository and generates a plain-English explanation into an `EXPLAIN.md` file.


---
![demo](https://github.com/user-attachments/assets/3de01574-a52f-43d3-abce-410e4e1d7a2b)




## Install ExplainThisRepo once and explain any GitHub repo

### Requirements
- Python 3.9+

### Option 1: Install with pipx (recommended)
```python
pipx install explainthisrepo
```
If you don’t have pipx:

```python
python -m pip install --user pipx
python -m pipx ensurepath
```

Restart your terminal after running ensurepath.


---

## Option 2: Install with pip
```python
pip install explainthisrepo
```
or

```python
python -m pip install explainthisrepo
```

> Note: If the command is not found after installing with pip, ensure your Python Scripts directory is on your PATH.

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
