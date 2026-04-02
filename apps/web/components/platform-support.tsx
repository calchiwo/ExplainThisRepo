import { BarChart3, Folder, Lock } from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "GitHub Repositories",
    description: "Analyze any public GitHub repository instantly. Support for private repos with GitHub token authentication.",
  },
  {
    icon: Folder,
    title: "Local Directories",
    description: "Analyze projects directly from your filesystem without GitHub. Works with any programming language and project structure.",
  },
  {
    icon: Lock,
    title: "Monorepos & Private",
    description: "Full support for monorepos, private repositories, and complex project structures. Scale to any codebase size.",
  },
]

const methods = [
  { name: "pip", version: "Python 3.9+" },
  { name: "pipx", version: "Python 3.9+" },
  { name: "npm", version: "Node.js" },
  { name: "npx", version: "Node.js" },
  { name: "Standalone Binary", version: "No dependencies" },
]

export function PlatformSupport() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Universal Support
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Works everywhere
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground leading-relaxed">
            Analyze GitHub repos, local directories, monorepos, and private projects. Multiple installation methods for maximum flexibility.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors"
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

        <div className="rounded-xl border border-border bg-card/50 p-8">
          <h3 className="text-lg font-semibold text-foreground mb-6">Installation Methods</h3>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
            {methods.map((method) => (
              <div
                key={method.name}
                className="rounded-lg border border-border bg-background p-4 text-center hover:border-primary/30 transition-colors"
              >
                <p className="font-mono text-sm font-semibold text-primary mb-1">
                  {method.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {method.version}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
