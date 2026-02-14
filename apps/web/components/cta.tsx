import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Github } from "lucide-react"

export function CTA() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-12 text-center md:p-20">
          {/* Subtle glow */}
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full opacity-[0.05]"
            style={{
              background:
                "radial-gradient(ellipse, hsl(160 84% 39%) 0%, transparent 70%)",
            }}
          />

          <div className="relative">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Stop guessing. Start understanding.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground leading-relaxed">
              Run a single command and get a clear explanation of any
              public GitHub repository.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="gap-2 px-6">
                <Link href="#install">
                  Install Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 px-6 bg-transparent">
                <Link
                  href="https://github.com/calchiwo/ExplainThisRepo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4" />
                  Star on GitHub
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
