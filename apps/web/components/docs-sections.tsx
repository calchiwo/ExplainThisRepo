"use client"

import React from "react"
import {
  Download,
  Settings,
  Key,
  Terminal,
  FileText,
  Zap,
  Code,
  BookOpen,
  Heart,
} from "lucide-react"
import { DocSection, DocSubsection } from "@/components/doc-section"
import { CodeBlock, CodeExample } from "@/components/code-block"

export function DocsSections() {
  return (
    <div id="documentation" className="space-y-4">
      {/* Installation */}
      <DocSection
        id="installation"
        title="Installation"
        icon={<Download className="h-5 w-5" />}
        defaultOpen={false}
      >
        <DocSubsection title="pip - Python Package Manager">
          <p>Install via pip for the easiest setup on any system with Python 3.9+:</p>
          <CodeBlock code="pip install explainthisrepo" language="bash" />
          <p>Then use it immediately:</p>
          <CodeBlock code="explainthisrepo owner/repo" language="bash" />
        </DocSubsection>

        <DocSubsection title="pipx - Isolated Python Environments">
          <p>Install in an isolated environment to avoid conflicts with other Python packages:</p>
          <CodeBlock code="pipx install explainthisrepo" language="bash" />
        </DocSubsection>

        <DocSubsection title="npm - JavaScript Package Manager">
          <p>Install globally using npm for Node.js environments:</p>
          <CodeBlock code="npm install -g explainthisrepo" language="bash" />
          <p>Or use directly without installation:</p>
          <CodeBlock code="npx explainthisrepo owner/repo" language="bash" />
        </DocSubsection>

        <DocSubsection title="Standalone Binary">
          <p>Download pre-compiled binaries from GitHub releases for your platform (macOS, Linux, Windows). Extract and add to your PATH for instant command-line access.</p>
        </DocSubsection>
      </DocSection>

      {/* Configuration */}
      <DocSection
        id="configuration"
        title="Configuration & API Keys"
        icon={<Settings className="h-5 w-5" />}
        defaultOpen={false}
      >
        <DocSubsection title="Gemini API Key Setup">
          <p>ExplainThisRepo uses Google&apos;s Gemini models for code analysis. Get a free API key from <a href="https://aistudio.google.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google AI Studio</a>.</p>
          <CodeBlock code='export GEMINI_API_KEY="your_api_key_here"' language="bash" />
          <p className="text-sm">The API key is required for all analysis operations. Store it securely and never commit it to version control.</p>
        </DocSubsection>

        <DocSubsection title="GitHub Token (Optional)">
          <p>For private repositories and higher API rate limits, provide a GitHub token:</p>
          <CodeBlock code='export GITHUB_TOKEN="your_github_token"' language="bash" />
          <p className="text-sm">Create fine-grained tokens at <a href="https://github.com/settings/tokens" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">github.com/settings/tokens</a> for better security.</p>
        </DocSubsection>

        <DocSubsection title="Persistent Configuration">
          <p>Add to your shell profile (.bashrc, .zshrc, etc.) to persist settings:</p>
          <CodeBlock code={`echo 'export GEMINI_API_KEY="your_key"' >> ~/.bashrc
echo 'export GITHUB_TOKEN="your_token"' >> ~/.bashrc`} language="bash" />
        </DocSubsection>
      </DocSection>

      {/* Basic Usage */}
      <DocSection
        id="basic-usage"
        title="Basic Command Usage"
        icon={<Terminal className="h-5 w-5" />}
        defaultOpen={true}
      >
        <DocSubsection title="Basic Syntax">
          <CodeBlock code="explainthisrepo owner/repo" language="bash" />
          <p className="text-sm">This analyzes a public GitHub repository and generates an explanation file (EXPLAIN.md).</p>
        </DocSubsection>

        <DocSubsection title="Common Examples">
          <CodeExample
            title="Analyze Django repository"
            code="explainthisrepo django/django"
            language="bash"
          />
          <CodeExample
            title="Output to file instead of browser"
            code="explainthisrepo owner/repo > output.md"
            language="bash"
          />
          <CodeExample
            title="Use with custom LLM model"
            code='explainthisrepo owner/repo --llm "claude-3-5-sonnet"'
            language="bash"
          />
          <CodeExample
            title="Disable browser opening"
            code="explainthisrepo owner/repo --no-browser"
            language="bash"
          />
        </DocSubsection>

        <DocSubsection title="Command Aliases">
          <p>Use the shorter alias for faster typing:</p>
          <CodeBlock code="etr owner/repo" language="bash" />
        </DocSubsection>
      </DocSection>

      {/* Flexible Input Formats */}
      <DocSection
        id="input-formats"
        title="Flexible Input Formats"
        icon={<FileText className="h-5 w-5" />}
        defaultOpen={false}
      >
        <p className="text-sm text-muted-foreground mb-4">ExplainThisRepo accepts multiple input formats, automatically normalized:</p>

        <DocSubsection title="GitHub URLs">
          <CodeBlock code="explainthisrepo https://github.com/owner/repo" language="bash" />
        </DocSubsection>

        <DocSubsection title="Repository Issues & Pull Requests">
          <CodeBlock code="explainthisrepo https://github.com/owner/repo/issues/123" language="bash" />
          <CodeBlock code="explainthisrepo https://github.com/owner/repo/pull/456" language="bash" />
        </DocSubsection>

        <DocSubsection title="SSH Clone Links">
          <CodeBlock code="explainthisrepo git@github.com:owner/repo.git" language="bash" />
        </DocSubsection>

        <DocSubsection title="Local Directories">
          <CodeBlock code="explainthisrepo ./local-repo
explainthisrepo /absolute/path/to/repo" language="bash" />
          <p className="text-sm">Analyze private codebases without pushing to GitHub.</p>
        </DocSubsection>
      </DocSection>

      {/* Available Flags */}
      <DocSection
        id="command-flags"
        title="Command-Line Flags & Options"
        icon={<Zap className="h-5 w-5" />}
        defaultOpen={false}
      >
        <div className="space-y-4 text-sm">
          <div className="rounded-lg bg-secondary/30 p-3 border border-border/50">
            <code className="text-primary font-mono">--llm MODEL</code>
            <p className="text-muted-foreground mt-1">Specify LLM provider and model. Default: &quot;gemini-2.0-flash&quot;</p>
            <CodeBlock code='explainthisrepo owner/repo --llm "claude-3-5-sonnet"' language="bash" />
          </div>

          <div className="rounded-lg bg-secondary/30 p-3 border border-border/50">
            <code className="text-primary font-mono">--no-browser</code>
            <p className="text-muted-foreground mt-1">Don&apos;t automatically open explanation in browser</p>
            <CodeBlock code="explainthisrepo owner/repo --no-browser" language="bash" />
          </div>

          <div className="rounded-lg bg-secondary/30 p-3 border border-border/50">
            <code className="text-primary font-mono">--max-context-lines N</code>
            <p className="text-muted-foreground mt-1">Limit context to N lines. Default: 10000. Increase for large repos:</p>
            <CodeBlock code="explainthisrepo owner/repo --max-context-lines 50000" language="bash" />
          </div>

          <div className="rounded-lg bg-secondary/30 p-3 border border-border/50">
            <code className="text-primary font-mono">--github-token TOKEN</code>
            <p className="text-muted-foreground mt-1">Provide GitHub token directly instead of environment variable</p>
          </div>

          <div className="rounded-lg bg-secondary/30 p-3 border border-border/50">
            <code className="text-primary font-mono">--gemini-api-key KEY</code>
            <p className="text-muted-foreground mt-1">Provide Gemini API key directly instead of environment variable</p>
          </div>

          <div className="rounded-lg bg-secondary/30 p-3 border border-border/50">
            <code className="text-primary font-mono">--verbose</code>
            <p className="text-muted-foreground mt-1">Show detailed processing logs for debugging</p>
          </div>
        </div>
      </DocSection>

      {/* Model Selection */}
      <DocSection
        id="model-selection"
        title="Model Selection with --llm"
        icon={<Code className="h-5 w-5" />}
        defaultOpen={false}
      >
        <p className="text-sm text-muted-foreground mb-4">ExplainThisRepo supports multiple LLM providers. Choose based on your needs:</p>

        <DocSubsection title="Google Gemini (Default)">
          <CodeBlock code='explainthisrepo owner/repo --llm "gemini-2.0-flash"' language="bash" />
          <p className="text-sm">Fast, free tier available. Requires GEMINI_API_KEY.</p>
        </DocSubsection>

        <DocSubsection title="Anthropic Claude">
          <CodeBlock code='explainthisrepo owner/repo --llm "claude-3-5-sonnet"' language="bash" />
          <p className="text-sm">Excellent code understanding. Requires ANTHROPIC_API_KEY.</p>
        </DocSubsection>

        <DocSubsection title="OpenAI GPT">
          <CodeBlock code='explainthisrepo owner/repo --llm "gpt-4"' language="bash" />
          <p className="text-sm">Requires OPENAI_API_KEY.</p>
        </DocSubsection>

        <DocSubsection title="Meta Llama">
          <CodeBlock code='explainthisrepo owner/repo --llm "llama-2"' language="bash" />
          <p className="text-sm">Open-source model option.</p>
        </DocSubsection>
      </DocSection>

      {/* Advanced Usage */}
      <DocSection
        id="advanced-usage"
        title="Advanced Usage & Diagnostics"
        icon={<BookOpen className="h-5 w-5" />}
        defaultOpen={false}
      >
        <DocSubsection title="Analyze Local Codebases">
          <p>Analyze private or local repositories without pushing to GitHub:</p>
          <CodeBlock code="explainthisrepo ./my-private-project" language="bash" />
          <CodeBlock code="explainthisrepo /home/user/workspace/myrepo" language="bash" />
        </DocSubsection>

        <DocSubsection title="Verbose Debugging">
          <p>Get detailed logs for troubleshooting:</p>
          <CodeBlock code="explainthisrepo owner/repo --verbose" language="bash" />
        </DocSubsection>

        <DocSubsection title="Increase Context for Large Repos">
          <p>For monorepos or very large projects, increase the context window:</p>
          <CodeBlock code="explainthisrepo owner/repo --max-context-lines 100000" language="bash" />
        </DocSubsection>

        <DocSubsection title="Check GitHub Rate Limits">
          <p>Monitor your GitHub API usage:</p>
          <CodeBlock code="export GITHUB_TOKEN='your_token'
curl -H 'Authorization: token '$GITHUB_TOKEN https://api.github.com/rate_limit" language="bash" />
        </DocSubsection>

        <DocSubsection title="Termux Mobile Support">
          <p>ExplainThisRepo works on Termux (Android terminal). Install Python and dependencies, then:</p>
          <CodeBlock code="pkg install python
pip install explainthisrepo
explainthisrepo owner/repo" language="bash" />
          <p className="text-sm">Note: Some features may be limited on mobile devices.</p>
        </DocSubsection>
      </DocSection>

      {/* Contributing */}
      <DocSection
        id="contributing"
        title="Contributing & Community"
        icon={<Heart className="h-5 w-5" />}
        defaultOpen={false}
      >
        <DocSubsection title="How to Contribute">
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
            <li>Fork the repository on GitHub</li>
            <li>Create a feature branch: <code className="bg-secondary px-1.5 py-0.5 rounded text-xs">git checkout -b feature/my-feature</code></li>
            <li>Make your changes and commit: <code className="bg-secondary px-1.5 py-0.5 rounded text-xs">git commit -m "Add my feature"</code></li>
            <li>Push to the branch: <code className="bg-secondary px-1.5 py-0.5 rounded text-xs">git push origin feature/my-feature</code></li>
            <li>Submit a pull request describing your changes</li>
          </ol>
        </DocSubsection>

        <DocSubsection title="Report Issues">
          <p className="text-sm">Found a bug or have a suggestion? <a href="https://github.com/calchiwo/ExplainThisRepo/issues" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Open an issue on GitHub</a> with details about the problem.</p>
        </DocSubsection>

        <DocSubsection title="License">
          <p className="text-sm">ExplainThisRepo is released under the MIT License. Free for personal, commercial, and educational use. See LICENSE file in the repository for full terms.</p>
        </DocSubsection>
      </DocSection>
    </div>
  )
}
