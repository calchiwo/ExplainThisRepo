import Link from "next/link"
import { Github, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

const contributors = [
  {
    name: "Spectra010s",
    contribution: "Implemented Node.js version and improved Termux/mobile support",
  },
  {
    name: "HalxDocs",
    contribution: "Implemented --detailed mode for deeper architectural analysis",
  },
]

export function Contributors() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Community
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Open source & community-driven
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground leading-relaxed">
            Built and improved by a passionate community. Contributions welcome!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {contributors.map((contributor) => (
            <div
              key={contributor.name}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-start gap-4">
                <Heart className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {contributor.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {contributor.contribution}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card/50 p-8 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-3">Want to contribute?</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
            ExplainThisRepo is MIT licensed and welcomes contributions. Check out the CONTRIBUTING guide for setup and guidelines.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link
                href="https://github.com/calchiwo/ExplainThisRepo/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
                View Contributing Guide
              </Link>
            </Button>
            <Button asChild size="sm" className="gap-2">
              <Link
                href="https://github.com/calchiwo/ExplainThisRepo"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
                Open Issues
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
