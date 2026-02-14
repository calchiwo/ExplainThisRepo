import { ArrowRight } from "lucide-react"

const formats = [
  "https://github.com/owner/repo",
  "github.com/owner/repo",
  "owner/repo",
  "https://github.com/owner/repo/issues/123",
  "https://github.com/owner/repo?tab=readme",
  "git@github.com:owner/repo.git",
]

export function InputFormats() {
  return (
    <section className="border-y border-border bg-card/50 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
              Flexible Input
            </p>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Paste any GitHub link
            </h2>
            <p className="mt-4 max-w-lg text-pretty text-muted-foreground leading-relaxed">
              No need to reformat URLs. ExplainThisRepo accepts repositories the
              way you actually copy them. All inputs are normalized internally to
              owner/repo.
            </p>
          </div>

          <div className="space-y-3">
            {formats.map((format) => (
              <div
                key={format}
                className="group flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 transition-colors hover:border-primary/30"
              >
                <code className="flex-1 font-mono text-sm text-foreground/90 truncate">
                  {format}
                </code>
                <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                <code className="hidden font-mono text-sm text-primary sm:block">
                  owner/repo
                </code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
