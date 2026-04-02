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
    title: "GitHub & Local Analysis",
    description:
      "Analyze any public GitHub repository or local directory. Works with private repos when authenticated.",
  },
  {
    icon: FolderTree,
    title: "Real Project Signals",
    description:
      "Derives architectural summaries from configs, entrypoints, manifests, dependencies, and file structure—not blind AI.",
  },
  {
    icon: FileSearch,
    title: "High-Signal Files",
    description:
      "Extracts architecture signals from package.json, pyproject.toml, Dockerfile, configs, and more.",
  },
  {
    icon: Languages,
    title: "Multiple Explanation Modes",
    description:
      "Quick one-liner, simple, detailed with architecture, or pure tech stack detection. Choose your level of detail.",
  },
  {
    icon: Link2,
    title: "Flexible Input Formats",
    description:
      "Paste any GitHub URL, issue/PR link, SSH clone link, or owner/repo. All inputs auto-normalized internally.",
  },
  {
    icon: FileText,
    title: "CLI Aliases & Portability",
    description:
      "Works via pip, npm, npx, or as a standalone binary. Run as explainthisrepo, explain-this-repo, or etr.",
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
