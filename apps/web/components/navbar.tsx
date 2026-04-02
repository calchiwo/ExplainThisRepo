"use client"

import React from "react"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

function scrollTo(id: string, duration = 400) {
  const el = document.getElementById(id)
  if (!el) return
  const navbarOffset = 80
  const targetY = el.getBoundingClientRect().top + window.scrollY - navbarOffset
  const startY = window.scrollY
  const diff = targetY - startY
  let startTime: number | null = null

  function step(timestamp: number) {
    if (!startTime) startTime = timestamp
    const progress = Math.min((timestamp - startTime) / duration, 1)
    const ease = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - (-2 * progress + 2) ** 3 / 2
    window.scrollTo(0, startY + diff * ease)
    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNav = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault()
      setMobileOpen(false)
      scrollTo(id)
    },
    []
  )

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/explainthisrepo.png"
            alt="ExplainThisRepo logo"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="text-lg font-semibold tracking-tight text-foreground">
            ExplainThisRepo
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            onClick={(e) => handleNav(e, "features")}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </a>
          <a
            href="#input-formats"
            onClick={(e) => handleNav(e, "input-formats")}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Input
          </a>
          <a
            href="#configuration"
            onClick={(e) => handleNav(e, "configuration")}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Configuration
          </a>
          <a
            href="#install"
            onClick={(e) => handleNav(e, "install")}
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
        </div>

        <div className="hidden md:block">
          <Button asChild size="sm">
            <a href="#install" onClick={(e) => handleNav(e, "install")}>Get Started</a>
          </Button>
        </div>

        <button
          type="button"
          className="flex items-center justify-center md:hidden text-muted-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border/50 bg-background px-6 pb-6 md:hidden">
          <div className="flex flex-col gap-4 pt-4">
            <a
              href="#features"
              onClick={(e) => handleNav(e, "features")}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#input-formats"
              onClick={(e) => handleNav(e, "input-formats")}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Input
            </a>
            <a
              href="#configuration"
              onClick={(e) => handleNav(e, "configuration")}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Configuration
            </a>
            <a
              href="#install"
              onClick={(e) => handleNav(e, "install")}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Install
            </a>
            <Link
              href="https://github.com/calchiwo/ExplainThisRepo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              GitHub
            </Link>
            <Button asChild size="sm" className="mt-2 w-full">
              <a href="#install" onClick={(e) => handleNav(e, "install")}>Get Started</a>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
