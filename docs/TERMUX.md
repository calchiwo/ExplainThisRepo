# Termux (Android) setup notes

ExplainThisRepo supports running inside the Termux environments on Android devices

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