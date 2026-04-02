import Link from "next/link"
import { Lock } from "lucide-react"

export function GithubToken() {
  return (
    <section id="github-token" className="border-y border-border bg-card/50 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="h-5 w-5 text-primary" />
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              GitHub Token for Private Repos
            </h2>
          </div>
          
          <p className="text-muted-foreground leading-relaxed mb-6">
            ExplainThisRepo supports GitHub authentication to access private repositories and increase API rate limits. When you run <code className="bg-secondary px-2 py-1 rounded text-sm font-mono text-primary">explainthisrepo init</code>, you&apos;ll be prompted to provide your GitHub token.
          </p>

          <div className="space-y-4 mb-6">
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm font-semibold text-foreground mb-2">Why you need a GitHub token:</p>
              <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                <li>✓ Access private repositories</li>
                <li>✓ Increase API rate limits (5000 req/hour vs 60 req/hour)</li>
                <li>✓ Analyze repos you have access to</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm font-semibold text-foreground mb-3">How to set up:</p>
            <ol className="text-sm text-muted-foreground space-y-3 ml-4 list-decimal">
              <li>Run <code className="bg-secondary px-2 py-1 rounded font-mono text-primary">explainthisrepo init</code></li>
              <li>Follow the prompts to create or paste your GitHub token</li>
              <li>Token is securely stored locally in your config</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-4">
              See{" "}
              <Link
                href="https://github.com/calchiwo/ExplainThisRepo/blob/main/docs/GITHUB_TOKEN.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-primary/80"
              >
                GITHUB_TOKEN.md
              </Link>
              {" "}for detailed step-by-step instructions.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
