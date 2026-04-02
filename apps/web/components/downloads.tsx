import { Download } from "lucide-react"
import Link from "next/link"

const binaries = [
  {
    platform: "macOS (ARM64)",
    download: "explainthisrepo-darwin-arm64",
  },
  {
    platform: "Linux (x64)",
    download: "explainthisrepo-linux-x64",
  },
  {
    platform: "Windows (x64)",
    download: "explainthisrepo-win-x64.exe",
  },
]

export function Downloads() {
  return (
    <section id="standalone" className="border-y border-border bg-card/50 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Standalone Binaries
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Download for your platform
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground leading-relaxed">
            Pre-built executables for macOS, Linux, and Windows. No Python or Node.js required.
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <div className="space-y-3">
            {binaries.map((binary) => (
              <Link
                key={binary.platform}
                href="https://github.com/calchiwo/ExplainThisRepo/releases/latest"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-4 transition-colors hover:border-primary/30 hover:bg-secondary/50 group"
              >
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {binary.platform}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono mt-1">
                    {binary.download}
                  </p>
                </div>
                <Download className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-6 text-center">
            Download from{" "}
            <Link
              href="https://github.com/calchiwo/ExplainThisRepo/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GitHub Releases
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
