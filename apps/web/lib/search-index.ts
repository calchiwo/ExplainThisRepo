export interface DocEntry {
  id: string
  title: string
  section: string
  content: string
  keywords: string[]
  category: string
}

export const docIndex: DocEntry[] = [
  {
    id: "overview",
    title: "ExplainThisRepo Overview",
    section: "overview",
    category: "Getting Started",
    content: `A CLI tool that generates plain-English explanations of public GitHub repositories by analyzing structure, README content, and high-signal files. Available on PyPI and npm. Supports Python 3.9+ and Node.js. Uses Gemini models for code analysis.`,
    keywords: ["CLI", "tool", "GitHub", "explanation", "analysis", "PyPI", "npm"],
  },
  {
    id: "installation-pip",
    title: "Installation via pip",
    section: "installation",
    category: "Installation",
    content: `Install using pip package manager. Run: pip install explainthisrepo. Then use: explainthisrepo owner/repo. Also available via pipx for isolated environments.`,
    keywords: ["pip", "install", "python", "package manager", "pipx"],
  },
  {
    id: "installation-npm",
    title: "Installation via npm",
    section: "installation",
    category: "Installation",
    content: `Install using npm or npx. Run: npm install -g explainthisrepo. Or use directly without installation: npx explainthisrepo owner/repo. Requires Node.js to be installed.`,
    keywords: ["npm", "npx", "node", "javascript", "install", "global"],
  },
  {
    id: "installation-binary",
    title: "Standalone Binary",
    section: "installation",
    category: "Installation",
    content: `Download compiled binaries from GitHub releases. Available for macOS, Linux, and Windows. Extract and add to PATH for command-line access.`,
    keywords: ["binary", "executable", "standalone", "download", "release"],
  },
  {
    id: "api-key-setup",
    title: "API Key Configuration",
    section: "configuration",
    category: "Configuration",
    content: `ExplainThisRepo uses Gemini models for code analysis. Set your API key with: export GEMINI_API_KEY="your_key". Get a free API key from Google AI Studio (aistudio.google.com). Required for all analysis operations.`,
    keywords: ["API key", "Gemini", "configuration", "environment variable", "setup"],
  },
  {
    id: "github-token",
    title: "GitHub Token Access",
    section: "github-token",
    category: "Configuration",
    content: `Use GitHub tokens for private repository access and higher API rate limits. Set with: export GITHUB_TOKEN="your_token". Create tokens at github.com/settings/tokens. Fine-grained tokens recommended for better security.`,
    keywords: ["GitHub token", "authentication", "private repos", "rate limits", "PAT"],
  },
  {
    id: "basic-usage",
    title: "Basic Command Usage",
    section: "usage",
    category: "Usage",
    content: `Basic syntax: explainthisrepo [REPOSITORY]. Analyze with custom LLM: explainthisrepo owner/repo --llm "claude-3-5-sonnet". Disable browser: explainthisrepo owner/repo --no-browser. Generate to file: explainthisrepo owner/repo > output.md`,
    keywords: ["command", "usage", "syntax", "flags", "options", "repository"],
  },
  {
    id: "command-flags",
    title: "Available Command Flags",
    section: "usage",
    category: "Usage",
    content: `--llm MODEL: Specify LLM provider and model (default: "gemini-2.0-flash"). --no-browser: Don't open explanation in browser. --max-context-lines N: Limit context to N lines (default: 10000). --github-token TOKEN: Provide GitHub token. --gemini-api-key KEY: Provide Gemini API key. --verbose: Show detailed processing logs.`,
    keywords: ["flags", "options", "parameters", "arguments", "command-line"],
  },
  {
    id: "flexible-input",
    title: "Flexible Input Formats",
    section: "input-formats",
    category: "Usage",
    content: `Support multiple input formats: owner/repo (short form), https://github.com/owner/repo (URL), https://github.com/owner/repo/issues/123 (issue), https://github.com/owner/repo/pull/456 (PR), git@github.com:owner/repo.git (SSH), ./local/path (local directory). All normalized automatically.`,
    keywords: ["input", "formats", "github", "URL", "SSH", "local directory"],
  },
  {
    id: "cli-aliases",
    title: "CLI Command Aliases",
    section: "aliases",
    category: "Usage",
    content: `Use shorter command aliases: etr (alias for explainthisrepo). Example: etr owner/repo. Both full command and alias work identically.`,
    keywords: ["alias", "shorthand", "command", "etr"],
  },
  {
    id: "model-selection",
    title: "Model Selection with --llm Flag",
    section: "models",
    category: "Advanced",
    content: `Select different LLM providers and models. Default: gemini-2.0-flash. Examples: --llm "claude-3-5-sonnet" (Anthropic), --llm "gpt-4" (OpenAI), --llm "llama-2" (Meta). Each provider requires appropriate API key. Mix and match providers as needed.`,
    keywords: ["LLM", "model", "provider", "Claude", "GPT", "Llama", "Gemini"],
  },
  {
    id: "local-directory",
    title: "Analyze Local Directories",
    section: "advanced",
    category: "Advanced",
    content: `Analyze local codebases without pushing to GitHub. Use: explainthisrepo ./path/to/repo or explainthisrepo /absolute/path/to/repo. Useful for private codebases or rapid iteration. Works with all input formats and flags.`,
    keywords: ["local directory", "local analysis", "relative path", "absolute path"],
  },
  {
    id: "diagnostics",
    title: "Diagnostics and Troubleshooting",
    section: "advanced",
    category: "Advanced",
    content: `Use --verbose flag to see detailed processing logs. Check API keys are set correctly. Verify GitHub rate limits with: export GITHUB_TOKEN and check limits. For large repos, increase context: --max-context-lines 50000. Check internet connection if API calls fail.`,
    keywords: ["diagnostics", "troubleshooting", "verbose", "debugging", "logs"],
  },
  {
    id: "termux-usage",
    title: "Termux Mobile Support",
    section: "advanced",
    category: "Advanced",
    content: `ExplainThisRepo works on Termux (Android terminal emulator). Install Python and dependencies, then pip install explainthisrepo. Note: Some features may be limited on mobile devices. Works best with larger screens and stable connections.`,
    keywords: ["Termux", "mobile", "Android", "phone", "terminal"],
  },
  {
    id: "contributions",
    title: "Contributing to ExplainThisRepo",
    section: "contributions",
    category: "Community",
    content: `Contributions welcome! Fork the repository, create a feature branch, and submit pull requests. Report bugs via GitHub issues. See CONTRIBUTING.md for guidelines. Follow existing code style and add tests for new features.`,
    keywords: ["contribute", "contributions", "pull request", "fork", "issues", "community"],
  },
  {
    id: "license",
    title: "License Information",
    section: "license",
    category: "Community",
    content: `ExplainThisRepo is released under the MIT License. Free for personal, commercial, and educational use. See LICENSE file in repository for full terms.`,
    keywords: ["license", "MIT", "open source", "legal"],
  },
]

export function searchDocs(query: string): DocEntry[] {
  if (!query.trim()) return []

  const lowerQuery = query.toLowerCase()
  const results: (DocEntry & { score: number })[] = []

  for (const entry of docIndex) {
    let score = 0

    // Exact title match
    if (entry.title.toLowerCase() === lowerQuery) {
      score += 100
    }

    // Title contains query
    if (entry.title.toLowerCase().includes(lowerQuery)) {
      score += 50
    }

    // Keywords match
    for (const keyword of entry.keywords) {
      if (keyword.toLowerCase() === lowerQuery) {
        score += 40
      } else if (keyword.toLowerCase().includes(lowerQuery)) {
        score += 20
      }
    }

    // Content contains query
    if (entry.content.toLowerCase().includes(lowerQuery)) {
      score += 10
    }

    if (score > 0) {
      results.push({ ...entry, score })
    }
  }

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score).slice(0, 8)
}
