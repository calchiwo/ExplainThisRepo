import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/80">
      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Brand and Description */}
        <div className="mb-12 grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <Image
                src="/explainthisrepo.png"
                alt="ExplainThisRepo logo"
                width={28}
                height={28}
                className="rounded-lg"
              />
              <span className="text-sm font-semibold text-foreground">
                ExplainThisRepo
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              The fastest way to understand any codebase using real project signals, not blind AI summarization.
            </p>
          </div>

          {/* Links - Installation */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Installation
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="https://pypi.org/project/explainthisrepo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  PyPI
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.npmjs.com/package/explainthisrepo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  npm
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/calchiwo/ExplainThisRepo/releases/latest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Standalone Binaries
                </Link>
              </li>
            </ul>
          </div>

          {/* Links - Resources */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="https://github.com/calchiwo/ExplainThisRepo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/calchiwo/ExplainThisRepo/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contributing
                </Link>
              </li>
              <li>
                <Link
                  href="https://discord.gg/explainthisrepo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Discord Community
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/calchiwo/ExplainThisRepo/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Discussions
                </Link>
              </li>
              <li>
                <Link
                  href="https://explainthisrepo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Docs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-8 border-t border-border" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-muted-foreground">
            MIT License. Built by{" "}
            <Link
              href="https://calebwodi.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary underline underline-offset-2 transition-colors"
            >
              Caleb Wodi
            </Link>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:justify-end">
            <Link
              href="https://linkedin.com/company/explainthisrepo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn Company"
            >
              LinkedIn
            </Link>
            <Link
              href="https://x.com/explainthisrepo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              Twitter
            </Link>
            <Link
              href="https://discord.gg/explainthisrepo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Discord"
            >
              Discord
            </Link>
            <Link
              href="mailto:caleb@explainthisrepo.com"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Email"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
