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
- standalone install CLI

All of them run the same core Python engine compiled into native binaries.

### Option 4: Download standalone binary

Prebuilt standalone binaries are available for macOS, Linux, and Windows.

> Standalone binaries require no Python or Node installation and run as a single executable.

Download the latest release: [ExplainThisRepo latest releases](https://github.com/calchiwo/ExplainThisRepo/releases/latest)


## Option 5: Install as a standalone native CLI.

You do not need Python, pip, Node.js, npm, or any other runtime to use the standalone installation.

### One-command installation

ExplainThisRepo provides native CLI binaries for Linux, macOS and Windows across x64 and ARM64 targets.

The one-command shell installer works on linux, macOS, and Windows through Git Bash or WSL.

#### Linux, macOS and Windows (with Git Bash/WSL)

The recommended installation method is:

```bash
curl -fsSL https://cli.explainthisrepo.com/install.sh | sh
```

or without the `https://` scheme:

```bash
curl -fsSL cli.explainthisrepo.com/install.sh | sh
```

The installer automatically:

1. Detects the operating system.
2. Detects the CPU architecture.
3. Maps the machine to a supported target.
4. Resolves the latest stable ExplainThisRepo release.
5. Downloads the matching CLI installer archive.
6. Downloads the archive SHA256 checksum.
7. Verifies the archive before extracting it.
8. Extracts the executable.
9. Installs it to `/usr/local/bin`.
10. Makes the executable available as `explainthisrepo`.

After installation:

```bash
explainthisrepo
```

#### Windows with Powershell or Commnd Prompt

The current `install.sh` is a Unix shell installer and therefore handles Linux, Windows (with Git Bash/WSL) and macOS.

Powershell/CMD doesn't use the `install.sh` installer, it uses the published [Windows executable or ZIP archive](https://github.com/calchiwo/ExplainThisRepo/releases/latest).

Windows users can download the appropriate Windows installer archive, for:

- Windows x64
- Windows ARM64

from the GitHub Release for the version you want, extract `explainthisrepo.exe`, and place it somewhere on your `PATH`.

### Where the binary is installed

The default installation directory is:

`/usr/local/bin`

The resulting executable is:

`/usr/local/bin/explainthisrepo`

If `/usr/local/bin` requires administrator access, the installer uses `sudo`.

The installer does not ask for sudo before it is necessary.

### Custom installation directory

The installer supports an environment variable for controlled installations and testing:

```bash
EXPLAINTHISREPO_INSTALL_DIR="$HOME/.local/bin" \
curl -fsSL https://cli.explainthisrepo.com/install.sh | sh
```

Make sure the selected directory is in your `PATH`.

For example:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

The installer cannot modify the parent shell's environment, so a `PATH` change may need to be made separately.

### What the installer downloads

Each release contains a platform-specific CLI installer archive.

`explainthisrepo-v<version>-cli-installer-<target>.<format>`

For example:

`explainthisrepo-v0.29.0-cli-installer-linux-x64.tar.gz`

The archive contains exactly one executable:

`explainthisrepo`

There are no nested directories, README files, version files, or other installer files inside the archive.

The checksum is distributed separately:

`explainthisrepo-v0.29.0-cli-installer-linux-x64.tar.gz.sha256`

The installer verifies the archive before extracting it.

### Manual installation

If you do not want to use the installer, download the appropriate binary from the GitHub release.

The release provides human-readable native binaries such as:

```
ExplainThisRepo-Linux-x64
ExplainThisRepo-Linux-ARM64
ExplainThisRepo-macOS-Apple-Silicon-arm64
ExplainThisRepo-macOS-Intel-x64
ExplainThisRepo-Windows-ARM64.exe
ExplainThisRepo-Windows-x64.exe
```

For Linux and macOS, make the downloaded binary executable:

```bash
chmod +x explainthisrepo
```

Then place it somewhere in your `PATH`, for example:

```bash
sudo mv explainthisrepo /usr/local/bin/explainthisrepo
```

Verify:

```bash
explainthisrepo
```

### Updating

The one-command installer always resolves the latest stable GitHub release.

To update an existing installation, use:

```bash
curl -fsSL https://cli.explainthisrepo.com/install.sh | sh
```

It replaces the existing executable with the binary from the latest stable release.

### Troubleshooting

`Unsupported operating system`

The current shell installer supports:

- Linux
- macOS
- Windows (with Git Bash/WSL)

Windows (with Powershell/CMD) is not handled by `install.sh`.

`Unsupported architecture`

The current shell installer supports:

- x64
- ARM64

Other architectures are rejected rather than receiving an incorrect binary.

`Could not determine the latest ExplainThisRepo release`

The installer could not retrieve the latest release information from GitHub.

Check that the machine has network access and try again.

`Could not download ...`

The requested installer archive does not appear to be available at the expected release URL.

This normally indicates a release packaging problem rather than a local installation problem.

The release must contain an archive matching the installer's naming convention.

`SHA256 verification failed`

Do not continue the installation.

The installer stops before extracting the archive when its SHA256 checksum does not match.

"sudo is not available"

The default installation directory requires administrator access and "sudo" is not available.

Use a user-owned installation directory instead:

```bash
EXPLAINTHISREPO_INSTALL_DIR="$HOME/.local/bin" \
curl -fsSL https://cli.explainthisrepo.com/install.sh | sh
```

Then ensure that directory is in your "PATH".

`explainthisrepo: command not found`

First check whether the binary exists:

```bash
ls -l /usr/local/bin/explainthisrepo
```

Then check whether `/usr/local/bin` is in your `PATH`:

```bash
echo "$PATH"
```

If it is missing, add it to your shell's `PATH`.

### Installation architecture

The installation system is intentionally split into two layers.

The release pipeline creates the native binaries:

```
PyInstaller
    ↓
six native binaries
```

The release pipeline then creates the installer archives:

```
native binary
    ↓
CLI installer archive
    ↓
GitHub Release
```

The installer consumes those archives:

```
curl | sh
    ↓
detect OS
    ↓
detect architecture
    ↓
target
    ↓
latest release
    ↓
download archive
    ↓
verify SHA256
    ↓
extract
    ↓
install
```

The installer does not build anything.

It only selects and installs an already-built native executable.

### Installation endpoint

The public installation command is:

`https://cli.explainthisrepo.com/install.sh`

This URL is a stable distribution interface.

The implementation behind the URL may change, but the public installation command should remain stable.