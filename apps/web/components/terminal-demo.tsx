"use client"

import { useEffect, useState } from "react"

type LineType = "command" | "blank" | "info" | "output" | "success"

interface TerminalLine {
  text: string
  type: LineType
  delay: number
}

const TERMINAL_OUTPUT: TerminalLine[] = [
  { text: "$ explainthisrepo facebook/react", type: "command" as const, delay: 0 },
  { text: "", type: "blank" as const, delay: 800 },
  { text: "Fetching repository data...", type: "info" as const, delay: 1200 },
  { text: "Analyzing file tree and structure...", type: "info" as const, delay: 2000 },
  { text: "Reading high-signal files...", type: "info" as const, delay: 2800 },
  { text: "Detecting languages: JavaScript, TypeScript", type: "info" as const, delay: 3400 },
  { text: "Generating explanation...", type: "info" as const, delay: 4000 },
  { text: "", type: "blank" as const, delay: 4600 },
  {
    text: "React is a JavaScript library for building user interfaces.",
    type: "output" as const,
    delay: 5200,
  },
  {
    text: "It uses a virtual DOM to efficiently update and render",
    type: "output" as const,
    delay: 5600,
  },
  {
    text: "components. The repository includes the core reconciler,",
    type: "output" as const,
    delay: 6000,
  },
  {
    text: "a fiber-based rendering architecture, and packages for",
    type: "output" as const,
    delay: 6400,
  },
  {
    text: "DOM, native, and server-side rendering targets.",
    type: "output" as const,
    delay: 6800,
  },
  { text: "", type: "blank" as const, delay: 7200 },
  { text: "EXPLAIN.md created successfully.", type: "success" as const, delay: 7600 },
]

const getLineColorClass = (type: LineType): string => {
  switch (type) {
    case "command":
      return "text-foreground font-semibold"
    case "info":
      return "text-muted-foreground"
    case "output":
      return "text-foreground/90"
    case "success":
      return "text-primary font-medium"
    case "blank":
      return ""
    default:
      return ""
  }
}

export function TerminalDemo() {
  const [visibleLineCount, setVisibleLineCount] = useState<number>(0)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    TERMINAL_OUTPUT.forEach((line, index) => {
      const timer = setTimeout(() => {
        setVisibleLineCount(index + 1)
      }, line.delay)
      timers.push(timer)
    })

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-primary/5">
        {/* Terminal header */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <div className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
          <div className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
          <div className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden="true" />
          <span className="ml-3 text-xs text-muted-foreground font-mono">
            terminal
          </span>
        </div>

        {/* Terminal output */}
        <div className="p-5 font-mono text-sm leading-relaxed min-h-[320px]">
          {TERMINAL_OUTPUT.slice(0, visibleLineCount).map((line, index) => (
            <div key={index} className={getLineColorClass(line.type)}>
              {line.text || "\u00A0"}
            </div>
          ))}
          {visibleLineCount < TERMINAL_OUTPUT.length && (
            <span className="inline-block h-4 w-2 animate-pulse bg-primary" aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  )
}
