"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

const providers = [
  {
    name: "Gemini",
    command: "explainthisrepo owner/repo --llm gemini",
  },
  {
    name: "OpenAI",
    command: "explainthisrepo owner/repo --llm openai",
  },
  {
    name: "Ollama",
    command: "explainthisrepo owner/repo --llm ollama",
  },
  {
    name: "Anthropic",
    command: "explainthisrepo owner/repo --llm anthropic",
  },
  {
    name: "Groq",
    command: "explainthisrepo owner/repo --llm groq",
  },
  {
    name: "OpenRouter",
    command: "explainthisrepo owner/repo --llm openrouter",
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
      // Clipboard API not available
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="flex-shrink-0 text-muted-foreground transition-colors hover:text-foreground"
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

export function Configuration() {
  return (
    <section id="configuration" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Configuration
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Choose your LLM provider
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground leading-relaxed">
            Run <code className="bg-secondary px-2 py-1 rounded text-sm font-mono text-primary">explainthisrepo init</code> to configure your preferred model backend, then use <code className="bg-secondary px-2 py-1 rounded text-sm font-mono text-primary">--llm</code> flag to override.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <div
              key={provider.name}
              className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30"
            >
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-foreground">
                  {provider.name}
                </h3>
              </div>
              <div className="flex items-center gap-2 rounded-md bg-background px-3 py-2">
                <code className="flex-1 font-mono text-xs text-foreground/80 truncate">
                  {provider.command}
                </code>
                <CopyButton text={provider.command} />
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  )
}
