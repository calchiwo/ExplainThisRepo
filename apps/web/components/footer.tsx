import Link from "next/link"
import { Terminal } from "lucide-react"

const FOOTER_LINKS = [
  { label: "PyPI", href: "https://pypi.org/project/explainthisrepo/" },
  { label: "npm", href: "https://www.npmjs.com/package/explainthisrepo" },
  { label: "GitHub", href: "https://github.com/calchiwo/ExplainThisRepo" },
  { label: "Twitter", href: "https://x.com/calchiwo" },
  { label: "Contact", href: "mailto:caleb@explainthisrepo.com" },
]

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* Logo and branding */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Terminal className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              ExplainThisRepo
            </span>
          </div>

          {/* External links */}
          <nav className="flex items-center gap-6">
            {FOOTER_LINKS.map((link) => {
              const isEmail = link.href.startsWith("mailto:")
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  {...(!isEmail && { target: "_blank", rel: "noopener noreferrer" })}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Copyright info */}
          <p className="text-xs text-muted-foreground text-center md:text-right">
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
