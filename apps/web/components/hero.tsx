import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TerminalDemo } from "@/components/terminal-demo"
import { ArrowRight, Github } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-32">
      {/* Subtle glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full opacity-[0.07]"
        style={{
          background:
            "radial-gradient(ellipse, hsl(160 84% 39%) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-16 flex flex-col items-center text-center md:mb-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs font-medium text-muted-foreground">
              Available on PyPI and npm
            </span>
          </div>

          <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Understand any GitHub repo{" "}
            <span className="text-primary">instantly</span>
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            A CLI tool that generates plain-English explanations of public GitHub
            repositories by analyzing structure, README content, and high-signal
            files.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="gap-2 px-6">
              <Link href="#install">
                Get Started
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
                View on GitHub
              </Link>
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-2">
            <code className="rounded-md border border-border bg-secondary px-3 py-1.5 font-mono text-sm text-muted-foreground">
              pip install explainthisrepo
            </code>
          </div>
        </div>

        <TerminalDemo />
      </div>
    </section>
  )
}
