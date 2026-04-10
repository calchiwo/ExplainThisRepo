'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const TWEET_URLS = [
  'https://x.com/i/status/2012857527596368113',
  'https://x.com/i/status/2011027691047465031',
  'https://x.com/i/status/2016254037604110543',
  'https://x.com/i/status/2012263472059351513',
  'https://x.com/i/status/2010478240092106884',
  'https://x.com/i/status/2010784878103556455',
  'https://x.com/i/status/2014793222615109737',
  'https://x.com/i/status/2016303013208498402',
  'https://x.com/i/status/2011157654006366325',
  'https://x.com/i/status/2011157650579603920',
  'https://x.com/i/status/2015085360598892954',
  'https://x.com/i/status/2014648260196270178',
  'https://x.com/i/status/2018229836825690421',
  'https://x.com/i/status/2014684484889657413',
  'https://x.com/i/status/2018229840868942207',
]

interface TweetData {
  id: string
  url: string
  author?: string
  handle?: string
  text?: string
  createdAt?: string
  likeCount?: number
  replyCount?: number
}

function extractTweetId(url: string): string {
  const match = url.match(/status\/(\d+)/)
  return match ? match[1] : ''
}

function TweetCard({ url, tweetData }: { url: string; tweetData?: TweetData }) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load(iframeRef.current)
    }
  }, [])

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex-shrink-0 w-full sm:w-96"
    >
      <div className="h-full rounded-xl border border-border bg-card p-6 hover:shadow-md transition-all duration-300 hover:border-primary/50 cursor-pointer">
        <blockquote className="twitter-tweet" data-theme="dark">
          <a href={url} />
        </blockquote>
      </div>
    </Link>
  )
}

export function Testimonials() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || prefersReducedMotion) return

    let scrollPosition = 0
    let animationFrameId: number

    const scroll = () => {
      if (!isHovering) {
        scrollPosition += 1
        container.scrollLeft = scrollPosition

        const scrollWidth = container.scrollWidth / 2
        if (scrollPosition >= scrollWidth) {
          scrollPosition = 0
        }
      }

      animationFrameId = requestAnimationFrame(scroll)
    }

    animationFrameId = requestAnimationFrame(scroll)

    return () => cancelAnimationFrame(animationFrameId)
  }, [isHovering, prefersReducedMotion])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load()
    }
  }, [])

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Social Proof
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            What users are saying
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground leading-relaxed">
            Join developers worldwide using ExplainThisRepo to understand codebases faster.
          </p>
        </div>

        <div className="relative">
          <div
            ref={scrollContainerRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{
              scrollBehavior: 'auto',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {/* Original tweets */}
            {TWEET_URLS.map((url) => (
              <TweetCard key={url} url={url} />
            ))}

            {/* Duplicated tweets for seamless looping */}
            {TWEET_URLS.map((url) => (
              <TweetCard key={`${url}-duplicate`} url={url} />
            ))}
          </div>

          {/* Gradient fade edges */}
          <div className="pointer-events-none absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-background to-transparent" />
        </div>

        {/* Instructions for updating tweets */}
        <p className="text-xs text-muted-foreground text-center mt-8">
          To add or update tweet URLs, edit the TWEET_URLS array in testimonials.tsx
        </p>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}
