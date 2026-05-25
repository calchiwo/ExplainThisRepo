# Release Architecture

This document describes the full release pipeline.

It is a deterministic, multi-language build, release and publishing system with build-time materialization, artifact fan-out, multi-registry publishing, integrity verification and more.

## Core Principle

A release is treated as a compiled artifact of a single source version.

The system enforces:

- One source of truth: `pyproject.toml`
- One canonical version extracted per release
- One materialization phase before any build tool runs
- One consistent version propagated across all ecosystems
- pyproject.toml is the ONLY human-edited version source; So humans (contributors) should only touch pyproject.toml

## System Overview

The pipeline is split into three phases:

1. Build phase (parallel artifact generation)
2. Materialization phase (version + manifest normalization)
3. Release phase (publishing + verification)

## 1. Build Phase (Matrix Execution)

Runs per target:

- darwin-arm64
- linux-x64
- linux-arm64
- win-x64

Steps:

- Checkout repository
- Setup Python environment
- Install dependencies
- Build PyInstaller binary
- Generate native checksums
- Upload artifacts per platform

Output:

- Platform-specific native binaries
- SHA256 checksum files

Important constraint:

No version rewriting happens here.
This phase is intentionally isolated from release logic.

## 2. Release Phase (Canonical Pipeline)

Runs once after all build jobs complete.

### Step 1: Canonical Version Extraction

```text
pyproject.toml → CI extracts version → .ci/version.txt
```

This value becomes immutable for the rest of the pipeline.

No other file is a source of truth.


### Step 2: Tag Validation Gate

Ensures release is intentional and consistent:

- Git tag must exist

- Tag version must match canonical version


If mismatch occurs:

- pipeline fails immediately

### Step 3: Manifest Materialization (Critical Step)

CI rewrites all version-dependent artifacts BEFORE any tool executes.

Rewritten files:

- node_version/package.json

- node_version/package-lock.json

- dotnet_version/ExplainThisRepo.csproj

- runtime version files (_version.py variants)


Rules:

- No tool sees unmaterialized state

- No dependency install occurs before rewrite

- All ecosystems receive identical version


### Step 4: Dependency Restoration

After materialization:

- npm ci

- dotnet restore

- packaging setup steps


At this point:

All tools operate on a fully normalized filesystem state.

### Step 5: Artifact Rehydration

Downloaded build outputs are merged:

- node_version/dist/native/<target>

- dotnet_version/native/<target>

- release/ staging folder


This creates a unified artifact tree.

### Step 6: Integrity Verification

Hard validation gates:

- SHA256 checksum verification

- File presence validation

- Native binary existence checks


If any check fails: release is aborted

### Step 7: Node.js Packaging Pipeline

Steps:

- version already injected from CI materialization

- npm ci installs dependencies

- metadata sync step runs

- npm pack generates tarball

- tarball validated for native binaries

- npm publish executes


Invariant:

npm never determines version itself. It only consumes CI-materialized state.

### Step 8: .NET Packaging Pipeline

Steps:

- csproj already rewritten by CI

- dotnet pack generates NuGet package

- version existence check against NuGet registry

- dotnet nuget push publishes package


Invariant:

NuGet package version is CI-derived, not project-derived at runtime.

### Step 9: GitHub Release Publication

Final step:

- Upload all artifacts in `release/`

- Generate release notes

- Publish GitHub release


This is the user-facing artifact layer.


## System Model

This system behaves like a compiler pipeline:

```
pyproject.toml
    ↓
version extraction (compiler frontend)
    ↓
manifest materialization (IR generation)
    ↓
build tools (execution stage)
    ↓
artifact aggregation
    ↓
publishing targets (npm, NuGet, GitHub)
```

## Critical Invariant

At no point may a build tool execute against raw repository state.

Materialization MUST always occur before:

- npm ci

- dotnet restore / pack

- npm pack

- nuget publish

- PyInstaller

- any version-sensitive operation

## Failure Modes Prevented

This architecture eliminates:

- cross-language version drift

- tag/package mismatch errors

- manual sync errors between ecosystems

- inconsistent build outputs

- “works locally but fails in CI” version bugs

## Design Summary

This is not a CI script.

It is a deterministic release compiler that:

- extracts a canonical version

- materializes a consistent build state

- executes all tooling on normalized inputs

- produces reproducible multi-ecosystem releases