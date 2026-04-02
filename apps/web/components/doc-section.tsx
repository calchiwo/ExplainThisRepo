"use client"

import React, { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface DocSectionProps {
  id: string
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
  icon?: React.ReactNode
}

export function DocSection({
  id,
  title,
  defaultOpen = false,
  children,
  icon,
}: DocSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div
      id={id}
      className="border border-border rounded-xl overflow-hidden bg-card transition-all"
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full px-6 py-4 flex items-center justify-between transition-colors",
          "hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50",
          isOpen && "bg-secondary/30"
        )}
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-primary">{icon}</div>}
          <h3 className="text-lg font-semibold text-foreground text-left">
            {title}
          </h3>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted-foreground transition-transform flex-shrink-0",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <div
        id={`${id}-content`}
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <div className="px-6 py-4 border-t border-border/50 space-y-4">
          {children}
        </div>
      </div>
    </div>
  )
}

interface DocSubsectionProps {
  title: string
  children: React.ReactNode
}

export function DocSubsection({ title, children }: DocSubsectionProps) {
  return (
    <div>
      <h4 className="font-semibold text-foreground mb-2">{title}</h4>
      <div className="text-muted-foreground text-sm space-y-2">{children}</div>
    </div>
  )
}
