# Installation

### Option 1: install with pip (Python source version):

Requirements: Python 3.9+

```bash
pip install explainthisrepo
explainthisrepo owner/repo

# explainthisrepo .
# explainthisrepo ./path/to/directory
# explainthisrepo ./path/to/file.py
# explainthisrepo owner/repo/path/to/file.py
# explainthisrepo owner/repo/path/to/directory
```

Alternatively,

```bash
pipx install explainthisrepo
explainthisrepo owner/repo
```

After installation, use any of the available commands:

```bash
explainthisrepo owner/repo
explain-this-repo owner/repo
etr owner/repo
```

To install support for specific models:

```bash
pip install explainthisrepo[gemini]
pip install explainthisrepo[openai]
pip install explainthisrepo[anthropic]
pip install explainthisrepo[groq]
```

Replace `owner/repo` with the GitHub repository identifier (e.g., `facebook/react`, `torvalds/linux`).

### Option 2: Install with npm (prebuilt binary, no Python install required)

Install globally and use forever:

```bash
npm install -g explainthisrepo
explainthisrepo owner/repo
```

<details>
<pre>
<code>
explainthisrepo .
explainthisrepo ./path/to/directory
explainthisrepo ./path/to/file.py
explainthisrepo owner/repo/path/to/file.py
explainthisrepo owner/repo/path/to/directory
</code>
</pre>
</details>

Or without install:

```bash
npx explainthisrepo owner/repo
```

<details>
<pre>
<code>
npx explainthisrepo .
npx explainthisrepo ./path/to/directory
npx explainthisrepo ./path/to/file.py
npx explainthisrepo owner/repo/path/to/file.py
npx explainthisrepo owner/repo/path/to/directory
</code>
</pre>
</details>

### Option 3: Install with .NET (C# Global Tool)

Requirements: .NET 8, 9, or 10:

```bash
dotnet tool install -g ExplainThisRepo
explainthisrepo owner/repo

# dotnet tool install -g ExplainThisRepo
# explainthisrepo .
```

## How it works

ExplainThisRepo has one core engine and multiple distribution layers.

- Python is the source of truth for analysis, prompts, providers, and output
- npm ships the Node launcher plus prebuilt native binaries
- .NET ships the same native binary as a global tool and publishes to NuGet
- GitHub Releases publish the standalone binaries

The Node and .NET layers are launchers only. They detect the current platform, locate the matching bundled binary, and execute it with the user’s arguments.

The same native binary is what actually performs the work.

## Distribution model

ExplainThisRepo can be installed in multiple ways:

- `pip` for Python users
- `npm` for Node users
- `dotnet tool` for .NET users
- standalone binaries for direct download

All of them run the same core Python engine compiled into native binaries.

### Option 4: Download standalone binary

Prebuilt standalone binaries are available for macOS, Linux, and Windows.

> Standalone binaries require no Python or Node installation and run as a single executable.

Download the latest release: [ExplainThisRepo latest releases](https://github.com/calchiwo/ExplainThisRepo/releases/latest)

Or install directly:

macOS

```bash
curl -L https://github.com/calchiwo/ExplainThisRepo/releases/latest/download/explainthisrepo-darwin-arm64 -o explainthisrepo
chmod +x explainthisrepo
```

Linux

```bash
curl -L https://github.com/calchiwo/ExplainThisRepo/releases/latest/download/explainthisrepo-linux-x64 -o explainthisrepo
chmod +x explainthisrepo
```

Windows (PowerShell)

```powershell
curl -L https://github.com/calchiwo/ExplainThisRepo/releases/latest/download/explainthisrepo-win-x64.exe -o explainthisrepo.exe
```
