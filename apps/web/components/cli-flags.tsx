import { Code2, HelpCircle, Zap, Bug } from "lucide-react"

const flags = [
  {
    icon: Zap,
    command: "--init",
    name: "Configuration",
    description: "Set up your preferred LLM model and API keys interactively",
  },
  {
    icon: Code2,
    command: "--llm",
    name: "Model Selection",
    description: "Override provider selection. Supports gemini, openai, anthropic, groq, and more",
  },
  {
    icon: Bug,
    command: "--doctor",
    name: "Diagnostics",
    description: "Check system health, network connectivity, and API key configuration",
  },
  {
    icon: HelpCircle,
    command: "--help",
    name: "Help",
    description: "Show usage guide and available commands",
  },
]

const aliases = [
  { primary: "explainthisrepo", secondary: "Primary command" },
  { primary: "explain-this-repo", secondary: "Readable alias" },
  { primary: "etr", secondary: "Short alias" },
]

export function CLIFlags() {
  return (
    <section className="py-24 md:py-32 border-y border-border bg-card/50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Advanced Features
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Powerful CLI flags
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground leading-relaxed">
            Advanced options for configuration, diagnostics, and customization
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {flags.map((flag) => (
            <div
              key={flag.command}
              className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                  <flag.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-mono text-sm font-semibold text-primary mb-1">
                    {flag.command}
                  </h3>
                  <p className="text-sm font-medium text-foreground mb-2">
                    {flag.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {flag.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-xl border border-border bg-background p-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Command Aliases</h3>
          <p className="text-sm text-muted-foreground mb-6">
            All three commands run the same tool and support the same flags and modes:
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {aliases.map((alias) => (
              <div key={alias.primary} className="flex items-center gap-3">
                <code className="flex-1 rounded-lg bg-secondary px-3 py-2 font-mono text-sm text-primary">
                  {alias.primary}
                </code>
                <span className="text-xs text-muted-foreground">{alias.secondary}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
