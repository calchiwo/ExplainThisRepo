VERSION = "0.28.0"

#    This version is a build-time placeholder only.

#    Do not edit manually.

#    CI rewrites VERSION from pyproject.toml before any tooling runs.

#    Single source of truth:
#    pyproject.toml

#    Build-time normalization rewrites:
#    - package.json
#    - package-lock.json
#    - ExplainThisRepo.csproj
#    - generated version files

#    Release architecture execution order:

#    pyproject.toml
#    ↓
#    extract version from pyproject.toml
#    ↓
#    THEN rewrite all manifests
#    ↓
#    restore / install (tooling runs on already-correct state)
#    ↓
#    build / pack / publish everywhere