"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Terminal, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const NAVBAR_OFFSET = 80
const SCROLL_DURATION = 400

function smoothScrollTo(id: string, duration: number = SCROLL_DURATION) {
  const element = document.getElementById(id)
  if (!element) return

  const targetY = element.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET
  const startY = window.scrollY
  const diff = targetY - startY
  let startTime: number | null = null

  const easeInOutCubic = (progress: number): number => {
    return progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - (-2 * progress + 2) ** 3 / 2
  }

  function animate(timestamp: number) {
    if (!startTime) startTime = timestamp
    const progress = Math.min((timestamp - startTime) / duration, 1)
    const easeProgress = easeInOutCubic(progress)
    window.scrollTo(0, startY + diff * easeProgress)
    if (progress < 1) requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault()
      setMobileMenuOpen(false)
      smoothScrollTo(id)
    },
    []
  )

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Terminal className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            ExplainThisRepo
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            onClick={(e) => handleNavClick(e, "features")}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </a>
          <a
            href="#modes"
            onClick={(e) => handleNavClick(e, "modes")}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Modes
          </a>
          <a
            href="#install"
            onClick={(e) => handleNavClick(e, "install")}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Install
          </a>
          <Link
            href="https://github.com/calchiwo/ExplainThisRepo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub
          </Link>
        </nav>

        <div className="hidden md:block">
          <Button asChild size="sm">
            <a href="#install" onClick={(e) => handleNavClick(e, "install")}>Get Started</a>
          </Button>
        </div>

        <button
          type="button"
          className="flex items-center justify-center md:hidden text-muted-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <nav className="border-t border-border/50 bg-background px-6 pb-6 md:hidden">
          <div className="flex flex-col gap-4 pt-4">
            <a
              href="#features"
              onClick={(e) => handleNavClick(e, "features")}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#modes"
              onClick={(e) => handleNavClick(e, "modes")}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Modes
            </a>
            <a
              href="#install"
              onClick={(e) => handleNavClick(e, "install")}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Install
            </a>
            <Link
              href="https://github.com/calchiwo/ExplainThisRepo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              GitHub
            </Link>
            <Button asChild size="sm" className="mt-2 w-full">
              <a href="#install" onClick={(e) => handleNavClick(e, "install")}>Get Started</a>
            </Button>
          </div>
        </nav>
      )}
    </header>
  )
}
