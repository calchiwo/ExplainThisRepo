# GitHub Token Setup

ExplainThisRepo can use a GitHub token to:

- Access private repositories
- Increase API rate limits for public repositories

## Create a GitHub token

1. Go to: [github.com/settings/tokens](https://github.com/settings/tokens)

2. Click:
   "Generate new token" → "Fine-grained token"

3. Configure:

- Repository access:
  - Select repositories you want (or all)
- Permissions:
  - Contents: Read-only

4. Generate and copy the token

## Use the token

### Option 1 (recommended)

Run:

```bash
explainthisrepo init
```

Paste your token when prompted.

### Option 2 (environment variable)

MacOS/Linux:

```
export GITHUB_TOKEN=ghp_xxx
```

Windows (PowerShell):

```
setx GITHUB_TOKEN "ghp_xxx"
```

## Notes

- Token is optional for public repositories

- Without it:

    - private repos will fail

    - rate limits are lower