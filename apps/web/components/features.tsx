import {
  FolderTree,
  FileSearch,
  Globe,
  Link2,
  Languages,
  FileText,
} from "lucide-react"

const features = [
  {
    icon: Globe,
    title: "Fetch Any Public Repo",
    description:
      "Automatically fetches public GitHub repositories using the GitHub API. Just provide the owner/repo.",
  },
  {
    icon: FolderTree,
    title: "Structure Analysis",
    description:
      "Builds a complete file tree summary to understand the project architecture at a glance.",
  },
  {
    icon: FileSearch,
    title: "High-Signal File Detection",
    description:
      "Extracts repo signals from key files like package.json, pyproject.toml, configs, and entrypoints.",
  },
  {
    icon: Languages,
    title: "Language Detection",
    description:
      "Detects programming languages via the GitHub API to provide accurate context for explanations.",
  },
  {
    icon: Link2,
    title: "Flexible Input Formats",
    description:
      "Accepts owner/repo, GitHub URLs, issue/PR links, SSH clone links. All normalized automatically.",
  },
  {
    icon: FileText,
    title: "EXPLAIN.md Output",
    description:
      "Generates a clear, readable EXPLAIN.md file in your current directory with the full explanation.",
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
