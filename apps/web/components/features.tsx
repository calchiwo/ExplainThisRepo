import {
  FolderTree,
  FileSearch,
  Globe,
  Link2,
  Languages,
  FileText,
  Settings,
  Zap,
} from "lucide-react"

const features = [
  {
    icon: Globe,
    title: "Public & Private Repos",
    description:
      "Analyze any public GitHub repository instantly. Support for private repos with GitHub token authentication.",
  },
  {
    icon: FileSearch,
    title: "Signal-Based Analysis",
    description:
      "Extracts real signals from configs (package.json, pyproject.toml), manifests, entrypoints, and dependency graphs.",
  },
  {
    icon: FolderTree,
    title: "Architecture Detection",
    description:
      "Builds complete file tree summaries and detects project structure, patterns, and organization at a glance.",
  },
  {
    icon: Languages,
    title: "Multi-Language Support",
    description:
      "Auto-detects programming languages and tech stacks via GitHub API for accurate context.",
  },
  {
    icon: Link2,
    title: "Flexible Input",
    description:
      "Accepts owner/repo, GitHub URLs, issue links, PR links, and SSH clone links—all normalized automatically.",
  },
  {
    icon: Settings,
    title: "Multiple LLM Models",
    description:
      "Choose from Gemini, OpenAI, Anthropic, Groq, Ollama, or OpenRouter. Switch anytime with the --llm flag.",
  },
  {
    icon: FileText,
    title: "Multiple Output Formats",
    description:
      "Generate full EXPLAIN.md files, quick summaries, detailed explanations, or stack detection—no LLM required.",
  },
  {
    icon: Zap,
    title: "Local & Remote Analysis",
    description:
      "Works with GitHub repositories, local directories, monorepos, and private projects with proper authentication.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Features
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Everything you need to understand code
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground leading-relaxed">
            ExplainThisRepo uses real repository data, not just the README, to
            ground every explanation in actual structure and signals.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30 hover:bg-secondary/50"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
