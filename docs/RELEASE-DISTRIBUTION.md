# ExplainThisRepo Release Distribution

This document describes how ExplainThisRepo moves from a version tag to installable native binaries.

The distribution system has one primary goal:

```
git tag
    ↓
automated build
    ↓
validated native binaries
    ↓
installer archives
    ↓
GitHub Release
    ↓
curl | sh
    ↓
installed CLI
```

## 1. Distribution model

ExplainThisRepo has one CLI and two public release artifact classes.

Human-readable native binaries

These are intended for people browsing a GitHub Release:

```
ExplainThisRepo-Linux-x64
ExplainThisRepo-Linux-ARM64
ExplainThisRepo-macOS-Apple-Silicon-arm64
ExplainThisRepo-macOS-Intel-x64
ExplainThisRepo-Windows-ARM64.exe
ExplainThisRepo-Windows-x64.exe
```

These names are deliberately human-readable.

CLI installer archives

These are intended for automated installation:

```
explainthisrepo-v<version>-cli-installer-linux-x64.tar.gz
explainthisrepo-v<version>-cli-installer-linux-arm64.tar.gz
explainthisrepo-v<version>-cli-installer-darwin-arm64.tar.gz
explainthisrepo-v<version>-cli-installer-darwin-x64.tar.gz
explainthisrepo-v<version>-cli-installer-win-x64.zip
explainthisrepo-v<version>-cli-installer-win-arm64.zip
```

The `cli-installer` component explicitly identifies the purpose of these artifacts.

The two artifact classes are not replacements for each other.

```
CI target
    │
    ├── human-readable binary
    │
    └── CLI installer archive
```

## 2. Supported targets

The build matrix currently contains six targets:

```
darwin-arm64
darwin-x64
linux-arm64
linux-x64
win-arm64
win-x64
```

These target names are machine-oriented identifiers.

They are used internally by:

- GitHub Actions
- PyInstaller
- native binary directories
- release packaging
- installer routing

The target names should remain stable because they are part of the distribution system's internal contract.

## 3. Native build layer

The native executable is produced by:

`scripts/build_pyinstaller.py`

The build system already knows how to build all six targets.

This distribution layer does not modify the PyInstaller build logic.

The build pipeline therefore remains:

```
source code
    ↓
PyInstaller
    ↓
native executable
```

Examples:

```
linux-x64
└── explainthisrepo

linux-arm64
└── explainthisrepo

darwin-x64
└── explainthisrepo

darwin-arm64
└── explainthisrepo

win-x64
└── explainthisrepo.exe

win-arm64
└── explainthisrepo.exe
```

## 4. Checksums

Every native binary receives a SHA256 checksum.

For example:

```
explainthisrepo
explainthisrepo.sha256
```

The release pipeline verifies these checksums before continuing.

The installer archives receive their own checksums.

For example:

```
explainthisrepo-v0.29.0-cli-installer-linux-x64.tar.gz
explainthisrepo-v0.29.0-cli-installer-linux-x64.tar.gz.sha256
```

The archive checksum is the important checksum for installation because the installer downloads the archive.

The installation integrity flow is:

```
download archive
    ↓
download archive checksum
    ↓
verify archive
    ↓
extract
    ↓
install
```

## 5. Installer archive contract

Every CLI installer archive has a strict content contract.

Linux and macOS archives contain:

`explainthisrepo`

Windows archives contain:

`explainthisrepo.exe`

There are no:

- nested directories
- README files
- version files
- metadata files
- checksums inside the archive

The checksum is a separate release asset.

This makes extraction deterministic.

The installer does not need to search the extracted directory for the executable.

6. Release artifact layout

A release such as `v0.29.0` contains both public artifact classes.

```
GitHub Release v0.29.0
│
├── Human-readable binaries
│   ├── ExplainThisRepo-Linux-x64
│   ├── ExplainThisRepo-Linux-x64.sha256
│   ├── ExplainThisRepo-Linux-ARM64
│   ├── ExplainThisRepo-Linux-ARM64.sha256
│   ├── ExplainThisRepo-macOS-Apple-Silicon-arm64
│   ├── ExplainThisRepo-macOS-Apple-Silicon-arm64.sha256
│   ├── ExplainThisRepo-macOS-Intel-x64
│   ├── ExplainThisRepo-macOS-Intel-x64.sha256
│   ├── ExplainThisRepo-Windows-ARM64.exe
│   ├── ExplainThisRepo-Windows-ARM64.exe.sha256
│   ├── ExplainThisRepo-Windows-x64.exe
│   └── ExplainThisRepo-Windows-x64.exe.sha256
│
└── CLI installer archives
    ├── explainthisrepo-v0.29.0-cli-installer-linux-x64.tar.gz
    ├── explainthisrepo-v0.29.0-cli-installer-linux-x64.tar.gz.sha256
    ├── explainthisrepo-v0.29.0-cli-installer-linux-arm64.tar.gz
    ├── explainthisrepo-v0.29.0-cli-installer-linux-arm64.tar.gz.sha256
    ├── explainthisrepo-v0.29.0-cli-installer-darwin-arm64.tar.gz
    ├── explainthisrepo-v0.29.0-cli-installer-darwin-arm64.tar.gz.sha256
    ├── explainthisrepo-v0.29.0-cli-installer-darwin-x64.tar.gz
    ├── explainthisrepo-v0.29.0-cli-installer-darwin-x64.tar.gz.sha256
    ├── explainthisrepo-v0.29.0-cli-installer-win-x64.zip
    ├── explainthisrepo-v0.29.0-cli-installer-win-x64.zip.sha256
    ├── explainthisrepo-v0.29.0-cli-installer-win-arm64.zip
    └── explainthisrepo-v0.29.0-cli-installer-win-arm64.zip.sha256
```

## 7. GitHub Actions pipeline

A release starts with a semantic version tag:

```
git tag v0.29.0
git push origin v0.29.0
```

The workflow is triggered by the tag.

```
v0.29.0
    ↓
GitHub Actions
```

### Build stage

The six matrix jobs run independently:

```
darwin-arm64
darwin-x64
linux-arm64
linux-x64
win-arm64
win-x64
```

Each job:

1. Checks out the repository.
2. Installs Python.
3. Validates the tag against the canonical project version.
4. Installs build dependencies.
5. Runs `scripts/build_pyinstaller.py`.
6. Generates a binary SHA256 checksum.
7. Verifies the checksum.
8. Uploads the native binary and checksum as a workflow artifact.

If one target fails, the other targets can finish, but the release job does not run until the required build matrix succeeds.

## 8. Release stage

The release job downloads all six build artifacts.

It then reconstructs:

```
node_version/dist/native/
dotnet_version/native/
```

This is important because the native binaries are also consumed by the npm and .NET distributions.

The release job then creates the human-readable release assets.

After that it creates the CLI installer archives.

The installer archives are generated from the already-validated native binaries.

The pipeline therefore does not build a second copy of the executable.

```
validated binary
       │
       ├── npm package
       │
       ├── NuGet package
       │
       ├── human-readable release asset
       │
       └── CLI installer archive
```

## 9. Archive packaging

Unix targets use:

`.tar.gz`

Windows targets use:

`.zip`

Examples:

```
explainthisrepo-v0.29.0-cli-installer-linux-x64.tar.gz
explainthisrepo-v0.29.0-cli-installer-linux-arm64.tar.gz
explainthisrepo-v0.29.0-cli-installer-darwin-x64.tar.gz
explainthisrepo-v0.29.0-cli-installer-darwin-arm64.tar.gz
explainthisrepo-v0.29.0-cli-installer-win-x64.zip
explainthisrepo-v0.29.0-cli-installer-win-arm64.zip
```

The archive is created from a temporary staging directory so unrelated files cannot accidentally enter the archive.

The pipeline then inspects the archive contents.

An archive containing unexpected files causes the release job to fail.

## 10. Installer

The stable installation entry point is:

```bash
curl -fsSL https://cli.explainthisrepo.com/install.sh | sh
```

The installer owns platform selection.

The release pipeline's responsibility is to publish correctly named artifacts.

The installer performs:

```
uname
  ↓
operating system
  ↓
CPU architecture
  ↓
target
  ↓
latest stable version
  ↓
archive filename
  ↓
download
  ↓
SHA256 verification
  ↓
extraction
  ↓
installation
```

For example:

```
macOS Apple Silicon
        ↓
darwin-arm64
        ↓
v0.29.0
        ↓
explainthisrepo-v0.29.0-cli-installer-darwin-arm64.tar.gz
```

## 11. Why the installer owns platform selection

The installer runs on the user's machine.

It knows:

```
uname -s
uname -m
```

Therefore it is the correct place to determine:

```
OS
architecture
target
```

The GitHub Release does not need to understand the user's machine.

It only needs to expose the deterministic artifacts.

This keeps the system boundary clean:

```
Release system
    │
    │ produces artifacts
    ▼
GitHub Release
    │
    │ serves artifacts
    ▼
Installer
    │
    │ selects artifact
    ▼
User machine
```

## 12. Stable installer URL

The public installer URL is:

```
https://cli.explainthisrepo.com/install.sh
```

The URL should be treated as a stable API.

Users should not need to know:

- the GitHub repository name
- the latest version
- the release tag
- the archive filename
- the architecture mapping
- the download URL

The installer abstracts those details.

## 13. Version resolution

The installer queries GitHub's latest release endpoint.

The endpoint returns the latest published full release rather than a draft or prerelease.

The installer extracts the release tag, for example:

`v0.29.0`

It then constructs the expected artifact name:

`explainthisrepo-v0.29.0-cli-installer-linux-x64.tar.gz`

The version is therefore part of the artifact URL but does not need to be hardcoded into "install.sh".

## 14. Failure behavior

The distribution system is designed to fail closed.

Examples:

```
unsupported OS
    → stop

unsupported architecture
    → stop

GitHub unavailable
    → stop

latest release cannot be determined
    → stop

archive unavailable
    → stop

checksum unavailable
    → stop

checksum mismatch
    → stop

invalid archive contents
    → stop

installation permission failure
    → stop
```

The installer must never silently install a different platform's binary.

## 15. Important system invariants

These properties must remain true.

### Invariant 1: Target naming

The supported internal target names are:

```
darwin-arm64
darwin-x64
linux-arm64
linux-x64
win-arm64
win-x64
```

### Invariant 2: Archive naming

The naming contract is:

`explainthisrepo-v<VERSION>-cli-installer-<TARGET>.<EXT>`

where:

```
Linux/macOS → tar.gz
Windows     → zip
```

### Invariant 3: Archive contents

Unix:

`explainthisrepo`

Windows:

`explainthisrepo.exe`

Nothing else.

### Invariant 4: Checksums

Every installer archive has a separate SHA256 checksum.

### Invariant 5: Human-readable release assets

The existing human-readable binary names remain unchanged.

### Invariant 6: Native build source

`scripts/build_pyinstaller.py` remains the source of the native executable build.

### Invariant 7: Installer independence

The standalone installer must not require:

```
Python
pip
Node.js
npm
```

## 16. Adding another platform

Adding a new platform requires changes to the distribution contract.

At minimum:

1. Add the target to the GitHub Actions matrix.
2. Ensure `scripts/build_pyinstaller.py` supports it.
3. Define its human-readable release asset name.
4. Define its installer archive format.
5. Add archive packaging.
6. Add checksum generation.
7. Add installer OS/architecture mapping.
8. Add release-layout validation.
9. Add the platform to the supported-platform documentation.
10. Test installation on a clean machine.

The target should not be considered supported until the complete path works:

```
build
  ↓
checksum
  ↓
archive
  ↓
release
  ↓
installer selection
  ↓
download
  ↓
verification
  ↓
installation
  ↓
execution
```

## 17. Release testing

Before treating a new distribution change as complete, test the actual user path.

Linux:

```bash
curl -fsSL https://cli.explainthisrepo.com/install.sh | sh
```

Widows (with Git Bash/WSL)

```bash
curl -fsSL https://cli.explainthisrepo.com/install.sh | sh
```

macOS:

```bash
curl -fsSL https://cli.explainthisrepo.com/install.sh | sh
```

Then:

```bash
explainthisrepo
```

The test environment should be as close as possible to a machine that has never installed ExplainThisRepo before.

The important test is not:

`Did PyInstaller succeed?`

The important test is:

`Can a new machine install and execute the correct binary?`

## 18. Distribution system

The complete system is:

```
                    git tag v0.29.0
                           │
                           ▼
                   GitHub Actions
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
       Build six targets          Validate checksums
              │                         │
              └────────────┬────────────┘
                           ▼
                    Native binaries
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
             npm         NuGet       Release assets
                                      │
                              ┌───────┴────────┐
                              │                │
                              ▼                ▼
                         Human binary    CLI installer
                                          archive
                                              │
                                              ▼
                                   GitHub Release
                                              │
                                              ▼
                           cli.explainthisrepo.com
                                              │
                                              ▼
                                         install.sh
                                              │
                               ┌──────────────┴──────────────┐
                               │                             │
                               ▼                             ▼
                           OS + arch                    latest version
                               │                             │
                               └──────────────┬──────────────┘
                                              ▼
                                       archive URL
                                              │
                                              ▼
                                          download
                                              │
                                              ▼
                                        SHA256 verify
                                              │
                                              ▼
                                           extract
                                              │
                                              ▼
                                    /usr/local/bin/explainthisrepo
                                              │
                                              ▼
                                      explainthisrepo
```

The CLI is the payload.

The release pipeline is the distribution mechanism.

The installer is the machine-facing interface to that distribution mechanism.

> The release pipeline described here is implemented by [RELEASE-ARCHITECTURE.md](RELEASE-ARCHITECTURE.md)