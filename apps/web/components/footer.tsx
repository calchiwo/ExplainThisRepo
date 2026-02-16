import Link from "next/link"
import { Terminal } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Terminal className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              ExplainThisRepo
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="https://pypi.org/project/explainthisrepo/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              PyPI
            </Link>
            <Link
              href="https://www.npmjs.com/package/explainthisrepo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              npm
            </Link>
            <Link
              href="https://github.com/calchiwo/ExplainThisRepo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
            </Link>
            <Link
              href="https://x.com/calchiwo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Twitter
            </Link>
            <Link
              href="mailto:caleb@explainthisrepo.com"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Contact
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            MIT License. Built by{" "}
            <Link
              href="https://calebwodi.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4 transition-colors hover:text-primary"
            >
              Caleb Wodi
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
