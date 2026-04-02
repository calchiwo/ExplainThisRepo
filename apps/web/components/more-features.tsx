import { Monitor, Terminal, Smartphone } from "lucide-react"

const featuresList = [
  {
    icon: Monitor,
    title: "Local Directory Analysis",
    description:
      "Analyze any local directory directly without GitHub. Works with all modes (--quick, --simple, --detailed, --stack). Perfect for private or non-GitHub projects.",
    examples: [
      "explainthisrepo .        # Current directory",
      "explainthisrepo ./path/to/directory",
    ],
  },
  {
    icon: Terminal,
    title: "CLI Aliases",
    description:
      "Three command names that all work identically. Pick your favorite: explainthisrepo, explain-this-repo, or etr for faster typing.",
    examples: [
      "explainthisrepo owner/repo",
      "explain-this-repo owner/repo",
      "etr owner/repo",
    ],
  },
  {
    icon: Smartphone,
    title: "Termux (Android)",
    description:
      "Run ExplainThisRepo on your phone via Termux. Install with pip --user or use the Node.js version with npx for better compatibility.",
    examples: [
      "pip install --user -U explainthisrepo",
      "npx explainthisrepo owner/repo",
    ],
  },
]

export function MoreFeatures() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Advanced
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Advanced usage & environments
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground leading-relaxed">
            Powerful features for power users: local analysis, command aliases, and mobile support.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {featuresList.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                {feature.description}
              </p>
              <div className="space-y-2 pt-4 border-t border-border">
                {feature.examples.map((example) => (
                  <code
                    key={example}
                    className="block text-xs bg-background px-3 py-2 rounded font-mono text-foreground/80 truncate"
                  >
                    {example}
                  </code>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
