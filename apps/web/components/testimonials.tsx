'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { MessageCircle, Heart, Repeat2, Share } from 'lucide-react'

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

const TESTIMONIALS = [
  {
    id: '1',
    author: 'Developer',
    handle: '@dev_user',
    text: 'ExplainThisRepo just saved me hours of time understanding a new codebase. This is insanely useful!',
    url: TWEET_URLS[0],
    avatar: 'D'
  },
  {
    id: '2',
    author: 'Tech Lead',
    handle: '@tech_lead',
    text: 'Finally a tool that actually analyzes code structure properly instead of just summarizing blindly.',
    url: TWEET_URLS[1],
    avatar: 'T'
  },
  {
    id: '3',
    author: 'Open Source',
    handle: '@oss_contributor',
    text: 'The best way to onboard new developers to our project. They understand the architecture instantly.',
    url: TWEET_URLS[2],
    avatar: 'O'
  },
  {
    id: '4',
    author: 'Engineer',
    handle: '@software_eng',
    text: 'This tool is a game changer for code reviews and documentation.',
    url: TWEET_URLS[3],
    avatar: 'E'
  },
  {
    id: '5',
    author: 'Startup Founder',
    handle: '@startup_founder',
    text: 'Our entire team uses ExplainThisRepo. Incredible productivity boost.',
    url: TWEET_URLS[4],
    avatar: 'S'
  },
  {
    id: '6',
    author: 'Security Researcher',
    handle: '@sec_researcher',
    text: 'Perfect for understanding security implications of new codebases.',
    url: TWEET_URLS[5],
    avatar: 'R'
  },
]

function TestimonialCard({ testimonial }: { testimonial: typeof TESTIMONIALS[0] }) {
  return (
    <Link
      href={testimonial.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex-shrink-0 w-full sm:w-96"
    >
      <div className="h-full rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50 hover:bg-card/80">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary flex-shrink-0">
            {testimonial.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{testimonial.author}</p>
            <p className="text-xs text-muted-foreground truncate">{testimonial.handle}</p>
          </div>
        </div>
        
        <p className="text-sm leading-relaxed text-foreground mb-4 line-clamp-4">
          {testimonial.text}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex gap-4">
            <div className="flex items-center gap-1 hover:text-primary transition-colors">
              <MessageCircle className="h-4 w-4" />
              <span>12</span>
            </div>
            <div className="flex items-center gap-1 hover:text-primary transition-colors">
              <Repeat2 className="h-4 w-4" />
              <span>34</span>
            </div>
            <div className="flex items-center gap-1 hover:text-primary transition-colors">
              <Heart className="h-4 w-4" />
              <span>456</span>
            </div>
          </div>
          <Share className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
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
        scrollPosition += 0.5
        container.scrollLeft = scrollPosition

        const maxScroll = (container.scrollWidth - container.clientWidth) / 2
        if (scrollPosition >= maxScroll) {
          scrollPosition = 0
        }
      }

      animationFrameId = requestAnimationFrame(scroll)
    }

    animationFrameId = requestAnimationFrame(scroll)

    return () => cancelAnimationFrame(animationFrameId)
  }, [isHovering, prefersReducedMotion])

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
            {TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}

            {TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={`${testimonial.id}-duplicate`} testimonial={testimonial} />
            ))}
          </div>

          <div className="pointer-events-none absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-background to-transparent" />
        </div>

        <p className="text-xs text-muted-foreground text-center mt-8">
          View more testimonials on{' '}
          <Link
            href="https://x.com/explainthisrepo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Twitter/X
          </Link>
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
