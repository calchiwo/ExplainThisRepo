"use client"

import React, { useState, useCallback, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
import { searchDocs } from "@/lib/search-index"
import { cn } from "@/lib/utils"

interface DocSearchProps {
  onSelectResult?: (id: string, section: string) => void
}

export function DocSearch({ onSelectResult }: DocSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<ReturnType<typeof searchDocs>>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        const searchResults = searchDocs(query)
        setResults(searchResults)
        setSelectedIndex(0)
        setIsOpen(true)
      } else {
        setResults([])
        setIsOpen(false)
      }
    }, 150)

    return () => clearTimeout(timer)
  }, [query])

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = useCallback(
    (id: string, section: string) => {
      onSelectResult?.(id, section)
      setQuery("")
      setIsOpen(false)
    },
    [onSelectResult]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        )
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0))
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault()
        const result = results[selectedIndex]
        handleSelect(result.id, result.section)
      } else if (e.key === "Escape") {
        setIsOpen(false)
      }
    },
    [results, selectedIndex, handleSelect]
  )

  return (
    <div ref={containerRef} className="relative w-full md:w-64">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search docs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          className={cn(
            "w-full rounded-lg border border-border bg-background px-3 pl-9 py-2 text-sm",
            "transition-colors placeholder:text-muted-foreground",
            "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          )}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("")
              setIsOpen(false)
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-lg border border-border bg-card shadow-lg max-h-96 overflow-y-auto">
          {results.map((result, index) => (
            <button
              key={result.id}
              type="button"
              onClick={() => handleSelect(result.id, result.section)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={cn(
                "w-full px-4 py-3 text-left transition-colors border-b border-border last:border-0",
                "hover:bg-secondary focus:outline-none focus:bg-secondary",
                index === selectedIndex && "bg-secondary"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground text-sm truncate">
                    {result.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {result.section}
                  </p>
                </div>
                <span className="text-xs font-medium text-primary whitespace-nowrap ml-2">
                  {result.category}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {isOpen && query && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-lg border border-border bg-card p-4 text-center">
          <p className="text-sm text-muted-foreground">
            No results found for &quot;{query}&quot;
          </p>
        </div>
      )}
    </div>
  )
}
