"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const modes = [
  {
    flag: "default",
    label: "Default",
    command: "explainthisrepo facebook/react",
    description: "Full repository explanation written to EXPLAIN.md",
    output: [
      "Fetching repository data...",
      "Analyzing file tree and structure...",
      "Reading high-signal files...",
      "",
      "React is a JavaScript library for building user",
      "interfaces using a component-based architecture...",
      "",
      "EXPLAIN.md created successfully.",
    ],
  },
  {
    flag: "--quick",
    label: "Quick",
    command: "explainthisrepo facebook/react --quick",
    description: "One-sentence summary printed to terminal",
    output: [
      "Fetching repository data...",
      "",
      "React is a declarative JavaScript library for",
      "building composable user interfaces.",
    ],
  },
  {
    flag: "--detailed",
    label: "Detailed",
    command: "explainthisrepo facebook/react --detailed",
    description: "Deeper explanation including architecture and structure",
    output: [
      "Fetching repository data...",
      "Analyzing file tree and structure...",
      "Reading high-signal files...",
      "Building architecture map...",
      "",
      "React is a UI library using a fiber-based reconciler.",
      "Core packages: react, react-dom, react-reconciler.",
      "Architecture: virtual DOM with concurrent rendering.",
      "",
      "EXPLAIN.md created successfully.",
    ],
  },
  {
    flag: "--simple",
    label: "Simple",
    command: "explainthisrepo facebook/react --simple",
    description: "Short, easy explanation printed to terminal",
    output: [
      "Fetching repository data...",
      "",
      "React helps you build websites by breaking the UI",
      "into reusable pieces called components.",
    ],
  },
  {
    flag: "--stack",
    label: "Stack",
    command: "explainthisrepo facebook/react --stack",
    description: "Tech stack breakdown from repo signals. No AI.",
    output: [
      "Detecting stack from repo signals...",
      "",
      "Languages:  JavaScript, TypeScript, C++",
      "Build:      Rollup, Gradle",
      "Testing:    Jest",
      "CI/CD:      GitHub Actions, CircleCI",
      "Package:    Yarn workspaces (monorepo)",
    ],
  },
]

export function Modes() {
  const [activeMode, setActiveMode] = useState(0)
  const mode = modes[activeMode]

  return (
    <section id="modes" className="border-y border-border bg-card/50 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Modes
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Multiple ways to understand a repo
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground leading-relaxed">
            Choose the right level of detail. From a one-liner to a full
            architectural breakdown.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Mode selector */}
          <div className="flex flex-row gap-2 overflow-x-auto lg:col-span-2 lg:flex-col lg:gap-1.5 lg:overflow-x-visible">
            {modes.map((m, index) => (
              <button
                key={m.flag}
                type="button"
                onClick={() => setActiveMode(index)}
                className={cn(
                  "flex-shrink-0 rounded-lg px-4 py-3 text-left transition-all",
                  index === activeMode
                    ? "bg-secondary border border-primary/30 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <code className="font-mono text-xs text-primary">
                    {m.flag}
                  </code>
                </div>
                <p className="mt-1 text-sm hidden lg:block">{m.description}</p>
              </button>
            ))}
          </div>

          {/* Terminal preview */}
          <div className="lg:col-span-3">
            <div className="overflow-hidden rounded-xl border border-border bg-background shadow-xl">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                <span className="ml-3 text-xs text-muted-foreground font-mono">
                  {mode.label.toLowerCase()}
                </span>
              </div>
              <div className="p-5 font-mono text-sm leading-relaxed min-h-[280px]">
                <div className="text-foreground font-semibold">
                  $ {mode.command}
                </div>
                <div className="mt-2">
                  {mode.output.map((line, i) => (
                    <div
                      key={i}
                      className={cn(
                        line === ""
                          ? "h-4"
                          : line.startsWith("EXPLAIN.md")
                            ? "text-primary font-medium"
                            : line.startsWith("Fetching") ||
                                line.startsWith("Analyzing") ||
                                line.startsWith("Reading") ||
                                line.startsWith("Building") ||
                                line.startsWith("Detecting")
                              ? "text-muted-foreground"
                              : "text-foreground/90"
                      )}
                    >
                      {line || "\u00A0"}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
