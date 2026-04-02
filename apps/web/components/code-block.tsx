"use client"

import React, { useState } from "react"
import { Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  code: string
  language?: string
  showCopy?: boolean
}

export function CodeBlock({
  code,
  language = "bash",
  showCopy = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="relative">
      <div className="bg-background rounded-lg border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-secondary/50 px-4 py-2 border-b border-border/50">
          <span className="text-xs font-mono text-muted-foreground uppercase">
            {language}
          </span>
          {showCopy && (
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Copy code"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-primary" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Code */}
        <pre className="px-4 py-3 font-mono text-sm overflow-x-auto">
          <code className="text-foreground">{code}</code>
        </pre>
      </div>
    </div>
  )
}

interface CodeExampleProps {
  title: string
  code: string
  language?: string
  description?: string
}

export function CodeExample({
  title,
  code,
  language = "bash",
  description,
}: CodeExampleProps) {
  return (
    <div className="space-y-2">
      <div>
        <h5 className="font-medium text-foreground">{title}</h5>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <CodeBlock code={code} language={language} />
    </div>
  )
}
