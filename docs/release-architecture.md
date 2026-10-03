# Release Architecture

This document describes the full release pipeline.

It is a deterministic, multi-language build, release and publishing system with:

- one canonical version source
- build-time version materialization
- six-target native builds
- artifact fan-out
- artifact rehydration
- multi-registry publishing
- native binary integrity verification
- installer archive generation
- installer archive integrity verification
- GitHub Release publication

## Core Principle

A release is treated as a compiled artifact of a single source version.

The system enforces:

- One source of truth: `pyproject.toml`
- One canonical version extracted per release
- One materialization phase before any build tool runs
- One consistent version propagated across all ecosystems
- One native binary build per target
- One validated native binary reused across distribution formats
- One release job responsible for aggregation and publication

`pyproject.toml` is the ONLY human-edited version source

Contributors should only change the version in `pyproject.toml`.

CI materializes that version into the files required by the npm and .NET packaging systems.

## System Overview

The pipeline is split into three phases:

1. Build phase (parallel artifact generation)
2. Materialization phase (version + manifest normalization)
3. Release phase (publishing + verification)


The build stage runs six native builds in parallel.

The materialization stage runs once after all six builds succeed, normalizing versions and manifests before assembling the release artifacts.

The release stage runs once after all six builds succeed.

The overall system is:

```
pyproject.toml
       ↓
Git tag
       ↓
GitHub Actions
       ↓
┌──────────────────────────────────────────────┐
│              Build matrix                    │
│                                              │
│  darwin-arm64   darwin-x64                   │
│  linux-arm64    linux-x64                    │
│  win-arm64      win-x64                      │
│                                              │
└──────────────────────────────────────────────┘
       ↓
validated native binaries
       ↓
artifact rehydration
       ↓
┌──────────────┬──────────────┬────────────────┐
│ npm package  │ NuGet tool   │ GitHub Release │
└──────────────┴──────────────┴────────────────┘
                                      ↓
                           release distribution
                                      ↓
                         human-readable binaries
                                      +
                           CLI installer archives
```

## 1. Build Phase (Matrix Execution)

The build phase runs once for each supported target.

The current build matrix contains six targets:

- darwin-arm64
- darwin-x64
- linux-arm64
- linux-x64
- win-arm64
- win-x64

Each target has its own GitHub Actions runner.

Current runner mapping:

```
darwin-arm64 → macos-latest
darwin-x64   → macos-15-intel

linux-x64    → ubuntu-latest
linux-arm64  → ubuntu-24.04-arm

win-arm64    → windows-11-arm
win-x64      → windows-latest
```

The matrix uses:

```
fail-fast: false
```

This allows the individual matrix jobs to finish independently when another target fails.


However, the `release` job depends on the complete `build` job, so a failed required target prevents the release stage from running.

### Build steps

Each build job:

1. Checks out the repository.
2. Sets up Python 3.12.
3. Validates the Git tag against the canonical project version.
4. Installs Python dependencies.
5. Runs `scripts/build_pyinstaller.py`.
6. Generates a SHA256 checksum for the native binary.
7. Uploads the native binary and checksum as a workflow artifact.

The output for each target is:

- native binary
- native binary SHA256 checksum

The native build output is placed under:

```
node_version/dist/native/<target>/
```

Examples:

```
node_version/dist/native/linux-x64/
└── explainthisrepo

node_version/dist/native/linux-arm64/
└── explainthisrepo

node_version/dist/native/darwin-x64/
└── explainthisrepo

node_version/dist/native/darwin-arm64/
└── explainthisrepo

node_version/dist/native/win-x64/
└── explainthisrepo.exe

node_version/dist/native/win-arm64/
└── explainthisrepo.exe
```

### Build isolation

The build phase does not rewrite the repository's version-dependent manifests.

Its responsibility is native artifact generation.

Version materialization for npm, .NET, and runtime version files happens in the release job.


## 2. Canonical Version Extraction

The release job extracts the canonical version from:

```
pyproject.toml
       ↓
scripts/get_version.py
       ↓
.ci/version.txt
```

The resulting value becomes the canonical release version for the remainder of the release job.

For example:

```
pyproject.toml
    ↓
0.29.0
    ↓
.ci/version.txt
```

No other project file becomes a version source of truth.


## 3. Tag Validation Gate

The workflow requires a Git tag.

The tag is expected to use the form:

```
v<VERSION>
```

For example:

```
v0.29.0
```

The workflow removes the leading `v` and compares the result with the canonical version extracted from `pyproject.toml`.

```
Git tag:             v0.29.0
                         ↓
                     0.29.0

pyproject.toml:      0.29.0

                     ↓
                  MATCH
```

If they do not match, the pipeline stops.

This prevents a release tag from publishing packages whose versions disagree with the canonical project version.


## 4. Manifest Materialization

After canonical version extraction and tag validation, CI rewrites version-dependent files.

The current materialized files are:

- `node_version/package.json`
- `node_version/package-lock.json`
- `dotnet_version/ExplainThisRepo.csproj`

- runtime version files:
    - `_version.py
    - `explain_this_repo/_version.py`
    - `node_version/_version.py`

The materialization flow is:

```
.ci/version.txt
       ↓
┌──────────────────────────────────────┐
│ version-dependent project artifacts  │
└──────────────────────────────────────┘
       ↓
npm metadata
.NET metadata
runtime version files
```

The purpose is to ensure that every publishing ecosystem receives the same release version.

Rules:

- `pyproject.toml` remains the source of truth.
- No tool sees unmaterialized state
- No dependency install occurs before rewrite
- All ecosystems receive identical version
- CI performs the version propagation.
- npm does not determine the release version.
- NuGet does not determine the release version.
- Runtime version files are generated from the canonical version.


## 5. Dependency Restoration

After materialization:

- npm ci

- dotnet restore

- packaging setup steps


At this point:

All tools operate on a fully normalized filesystem state.


## 6. Native Artifact Rehydration

The release job downloads the six build artifacts.

They are then rehydrated into the repository's distribution trees:

- `node_version/dist/native/<target>/`
- `dotnet_version/native/<target>/`

A third staging location is created:

- `release/`

The native binaries are therefore reused by multiple distribution systems.

The release job does not rebuild them.

This creates a unified artifact tree.:

```
GitHub Actions build artifacts
            ↓
      artifact download
            ↓
      artifact rehydration
            ↓
┌────────────┼─────────────┐
│            │             │
▼            ▼             ▼
npm        .NET       GitHub Release
```


## 7. Native Binary Integrity Verification

Before publishing, the release job verifies the SHA256 checksums generated during the build phase.

The verification operates against the rehydrated native binaries.

The flow is:

```
native binary
      +
native binary.sha256
      ↓
SHA256 verification
      ↓
continue only if valid
```

If verification fails, the release job stops.

This creates an integrity gate between native artifact generation and publication.


## 8. Human-Readable GitHub Release Assets

Each validated native binary is also copied into the `release/` staging directory using a human-readable filename.

The current names are:

```
ExplainThisRepo-Linux-x64
ExplainThisRepo-Linux-x64.sha256

ExplainThisRepo-Linux-ARM64
ExplainThisRepo-Linux-ARM64.sha256

ExplainThisRepo-macOS-Apple-Silicon-arm64
ExplainThisRepo-macOS-Apple-Silicon-arm64.sha256

ExplainThisRepo-macOS-Intel-x64
ExplainThisRepo-macOS-Intel-x64.sha256

ExplainThisRepo-Windows-ARM64.exe
ExplainThisRepo-Windows-ARM64.exe.sha256

ExplainThisRepo-Windows-x64.exe
ExplainThisRepo-Windows-x64.exe.sha256
```

These assets are intended for people browsing a GitHub Release and wanting the native executable directly.

Their names are deliberately human-readable.

They are separate from the machine-oriented target identifiers used internally by CI.



## 9. CLI Installer Archives

The release pipeline also packages the validated native binaries into deterministic CLI installer archives.

The archive naming convention is:

```
explainthisrepo-v<VERSION>-cli-installer-<TARGET>.<EXT>
```

Current archives:

```
explainthisrepo-v0.29.0-cli-installer-linux-x64.tar.gz
explainthisrepo-v0.29.0-cli-installer-linux-arm64.tar.gz

explainthisrepo-v0.29.0-cli-installer-darwin-arm64.tar.gz
explainthisrepo-v0.29.0-cli-installer-darwin-x64.tar.gz

explainthisrepo-v0.29.0-cli-installer-win-x64.zip
explainthisrepo-v0.29.0-cli-installer-win-arm64.zip
```

Unix targets use:

`.tar.gz`

Windows targets use:

`.zip`

The installer archive is created from the already-built native binary.

There is no second PyInstaller build.

The same validated native executable fans out into multiple distribution formats:

```
                 validated native binary
                         │
          ┌──────────────┼───────────────┐
          │              │               │
          ▼              ▼               ▼
      npm package     NuGet        GitHub Release
                                      │
                              ┌───────┴────────┐
                              │                │
                              ▼                ▼
                       raw executable    installer archive
```


## 10. Installer Archive Contract

Each installer archive has a strict content contract.

Linux and macOS archives contain exactly:

`explainthisrepo`

Windows archives contain exactly:

`explainthisrepo.exe`

The archive contains no:

- nested directories
- README files
- version files
- metadata files
- checksum files

The checksum is published as a separate GitHub Release asset.

This makes extraction deterministic.

The installer knows the executable name in advance and does not need to search the extracted directory.


# 11. Installer Archive Integrity

Each installer archive receives its own SHA256 checksum.

For example:

```
explainthisrepo-v0.29.0-cli-installer-linux-x64.tar.gz
explainthisrepo-v0.29.0-cli-installer-linux-x64.tar.gz.sha256
```

The archive checksum is separate from the checksum of the raw native binary.

The installation integrity flow is:

```
download archive
       ↓
download archive checksum
       ↓
verify archive SHA256
       ↓
extract
       ↓
install executable
```

The archive itself is therefore the integrity boundary used by the standalone installer.


## 12. npm Distribution

The rehydrated native binaries are included in the npm package.

The npm release pipeline:

1. Uses the CI-materialized version.
2. Checks whether the version already exists.
3. Runs `npm ci`.
4. Runs `npm run sync-meta`.
5. Runs `npm pack`.
6. Verifies that the package contains native binaries.
7. Runs the package check.
8. Publishes to npm.

The npm package does not build the native executables.

It consumes the binaries produced by the native build matrix.

Invariant:

```
PyInstaller build
       ↓
validated native binaries
       ↓
npm package
```


## 13. .NET Distribution

The rehydrated native binaries are also included in the .NET Global Tool package.

The .NET release pipeline:

1. Uses the CI-materialized `.csproj` version.
2. Checks whether the version already exists on NuGet.
3. Runs `dotnet pack`.
4. Publishes the generated package to NuGet.

The .NET package does not build a separate copy of the native executable.

It consumes the native binaries produced by the build matrix.

Invariant:

```
PyInstaller build
       ↓
validated native binaries
       ↓
NuGet package
```


## 14. GitHub Release Publication

The final release stage publishes everything staged under:

`release/`

The GitHub Release contains:

```
Human-readable native binaries
+
native binary checksums
+
CLI installer archives
+
installer archive checksums
```

GitHub Releases therefore act as the public artifact distribution layer.

A release such as `v0.29.0` contains both artifact classes:

```
GitHub Release v0.29.0
│
├── Human-readable native binaries
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


## 15. System Model

The release system behaves like a compiler pipeline.

```
pyproject.toml
       ↓
canonical version extraction
       ↓
Git tag validation
       ↓
version materialization
       ↓
native build matrix
       ↓
artifact aggregation
       ↓
integrity verification
       ↓
distribution fan-out
       ↓
┌──────────────┬──────────────┬──────────────────┐
│ npm          │ NuGet        │ GitHub Release   │
│              │              │                  │
│ native       │ native       │ raw binaries     │
│ binaries     │ binaries     │ installer        │
│              │              │ archives         │
└──────────────┴──────────────┴──────────────────┘
```

The important distinction is that native compilation happens once per target.

Distribution packaging happens afterward.


## 16. Critical Invariants

#### Invariant 1: Canonical version

`pyproject.toml` is the only human-edited version source.

#### Invariant 2: Tag consistency

The Git tag must match the canonical project version.

#### Invariant 3: Six supported native targets

The current target contract is:

```
darwin-arm64
darwin-x64
linux-arm64
linux-x64
win-arm64
win-x64
```

#### Invariant 4: One native build per target

The native executable is built once by:

`scripts/build_pyinstaller.py`

All later distribution formats consume that built executable.

#### Invariant 5: Native artifact integrity

Native binary checksums must verify before publication continues.

#### Invariant 6: Installer archive naming

The archive naming contract is:

`explainthisrepo-v<VERSION>-cli-installer-<TARGET>.<EXT>`

#### Invariant 7: Installer archive contents

Unix archives contain:

```
explainthisrepo
```

Windows archives contain:

```
explainthisrepo.exe
```

Nothing else.

#### Invariant 8: Installer archive integrity

Every installer archive has a separate SHA256 checksum.

#### Invariant 9: Human-readable release assets

The existing human-readable native binary names remain stable.

#### Invariant 10: Distribution independence

The standalone installer does not require:

Python
pip
Node.js
npm


## 17. Failure Modes Prevented

The architecture prevents or detects:

- canonical version drift
- Git tag/package version mismatch
- cross-language version mismatch
- missing native binaries
- corrupted native artifacts
- missing release targets
- incorrectly named installer archives
- invalid installer archive contents
- missing installer checksums
- checksum mismatches
- accidental publication of unvalidated native artifacts
- rebuilding different native binaries for different distribution formats

The release job stops when a required validation fails.


## 18. Adding Another Platform

Adding another platform requires changes across the complete distribution path.

At minimum:

1. Add the target to the GitHub Actions matrix.
2. Ensure `scripts/build_pyinstaller.py` supports the target.
3. Define the runner.
4. Define the human-readable release asset name.
5. Define the executable filename.
6. Define the installer archive format.
7. Add release packaging for the target.
8. Add checksum generation and verification.
9. Add installer target mapping.
10. Add release-layout validation.
11. Update supported-platform documentation.
12. Test installation on a clean machine.

A platform is not complete when its binary builds.

The complete path must work:

```
build
  ↓
checksum
  ↓
artifact upload
  ↓
artifact rehydration
  ↓
archive packaging
  ↓
release publication
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


## 19. Release Testing

The important test is the complete user path, not only whether PyInstaller succeeds.

For Unix-like environments, test:


```bash
curl -fsSL https://cli.explainthisrepo.com/install.sh | sh
```

Then:

```bash
explainthisrepo
```

Testing should cover the supported native targets and should be performed against environments that are as close as possible to fresh machines.

The key question is:

`Can a new machine receive the correct native executable from the published release and execute it successfully?`


## 20. Complete Distribution System

The complete release system is:

```
                         pyproject.toml
                               │
                               ▼
                         Git tag v0.29.0
                               │
                               ▼
                        GitHub Actions
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
             Build six targets       Tag validation
                    │
                    ▼
             Native binaries
                    │
                    ▼
             Native checksums
                    │
                    ▼
             Artifact upload
                    │
                    ▼
              Release job
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
 Version materialization   Artifact rehydration
          │                   │
          └─────────┬─────────┘
                    ▼
             Integrity checks
                    │
                    ▼
             Distribution fan-out
                    │
       ┌────────────┼───────────────────┐
       │            │                   │
       ▼            ▼                   ▼
      npm         NuGet          GitHub Release
                                       │
                         ┌─────────────┴─────────────┐
                         │                           │
                         ▼                           ▼
                  Human-readable             CLI installer
                     binaries                   archives
                         │                           │
                         │                     SHA256 checksums
                         │                           │
                         └─────────────┬─────────────┘
                                       ▼
                                GitHub Release
                                       │
                                       ▼
                          cli.explainthisrepo.com
                                       │
                                       ▼
                                  install.sh
                                       │
                             ┌─────────┴─────────┐
                             │                   │
                             ▼                   ▼
                         OS + arch         latest release
                             │                   │
                             └─────────┬─────────┘
                                       ▼
```


## Release Distribution

For the artifact packaging, distribution model, installer archives, and installation flow, see [RELEASE-DISTRIBUTION.md](RELEASE-DISTRIBUTION.md).