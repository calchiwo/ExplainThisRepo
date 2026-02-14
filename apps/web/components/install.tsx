"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  {
    label: "pip",
    commands: [
      { text: "pip install explainthisrepo", copyable: true },
      { text: "explainthisrepo owner/repo", copyable: true },
    ],
  },
  {
    label: "pipx",
    commands: [
      { text: "pipx install explainthisrepo", copyable: true },
      { text: "explainthisrepo owner/repo", copyable: true },
    ],
  },
  {
    label: "npm",
    commands: [
      { text: "npm install -g explainthisrepo", copyable: true },
      { text: "explainthisrepo owner/repo", copyable: true },
    ],
  },
  {
    label: "npx",
    commands: [
      { text: "npx explainthisrepo owner/repo", copyable: true },
    ],
  },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API not available (non-HTTPS or unsupported browser)
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="ml-3 flex-shrink-0 text-muted-foreground transition-colors hover:text-foreground"
      aria-label={`Copy: ${text}`}
    >
      {copied ? (
        <Check className="h-4 w-4 text-primary" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  )
}

export function Install() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section id="install" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Installation
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Get started in seconds
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground leading-relaxed">
            Install via pip or npm and start explaining repos right away.
            Requires Python 3.9+ or Node.js.
          </p>
        </div>

        <div className="mx-auto max-w-xl">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xl">
            {/* Tabs */}
            <div className="flex border-b border-border">
              {tabs.map((tab, index) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setActiveTab(index)}
                  className={cn(
                    "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                    index === activeTab
                      ? "bg-secondary text-foreground border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Commands */}
            <div className="p-5 font-mono text-sm space-y-3">
              {tabs[activeTab].commands.map((cmd) => (
                <div
                  key={cmd.text}
                  className="flex items-center justify-between rounded-lg bg-background px-4 py-3"
                >
                  <span className="text-foreground">
                    <span className="text-primary mr-2">$</span>
                    {cmd.text}
                  </span>
                  <CopyButton text={cmd.text} />
                </div>
              ))}
            </div>
          </div>

          {/* API key note */}
          <div className="mt-6 rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">API Key Required:</span>{" "}
              ExplainThisRepo uses Gemini models for code analysis. Set your API
              key with{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-primary">
                export GEMINI_API_KEY=&quot;your_key&quot;
              </code>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
