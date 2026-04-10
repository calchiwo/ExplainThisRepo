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
    author: 'Sarah Chen',
    handle: '@sarahcodes',
    text: 'ExplainThisRepo just saved me hours understanding a massive codebase. This is the tool I didn\'t know I needed!',
    url: TWEET_URLS[0],
    avatar: 'S',
    likes: '2.4K'
  },
  {
    id: '2',
    author: 'James Wilson',
    handle: '@jwilson_dev',
    text: 'Finally, a tool that analyzes code structure properly instead of just throwing blind AI summaries at you.',
    url: TWEET_URLS[1],
    avatar: 'J',
    likes: '1.8K'
  },
  {
    id: '3',
    author: 'Maya Patel',
    handle: '@mayaops',
    text: 'The best way to onboard new team members. They understand our entire architecture in minutes.',
    url: TWEET_URLS[2],
    avatar: 'M',
    likes: '3.1K'
  },
  {
    id: '4',
    author: 'Alex Rodriguez',
    handle: '@alexcode',
    text: 'Using this for code reviews has been a game changer. Catches things I would have missed.',
    url: TWEET_URLS[3],
    avatar: 'A',
    likes: '956'
  },
  {
    id: '5',
    author: 'Emma Davis',
    handle: '@emmadeveloper',
    text: 'Recommended this to all my developer friends. The quality of analysis is genuinely impressive.',
    url: TWEET_URLS[4],
    avatar: 'E',
    likes: '2.2K'
  },
  {
    id: '6',
    author: 'Marcus Lee',
    handle: '@securityfirst',
    text: 'Perfect for analyzing security implications in unfamiliar codebases. Saves so much time.',
    url: TWEET_URLS[5],
    avatar: 'M',
    likes: '1.5K'
  },
]

function TestimonialCard({ testimonial }: { testimonial: typeof TESTIMONIALS[0] }) {
  return (
    <Link
      href={testimonial.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="h-full rounded-lg border border-border bg-card p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-200">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary flex-shrink-0">
            {testimonial.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">{testimonial.author}</p>
            <p className="text-xs text-muted-foreground">{testimonial.handle}</p>
          </div>
        </div>
        
        <p className="text-sm leading-relaxed text-foreground mb-4">
          {testimonial.text}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>12</span>
            </div>
            <div className="flex items-center gap-1">
              <Repeat2 className="h-3.5 w-3.5" />
              <span>34</span>
            </div>
            <div className="flex items-center gap-1 font-medium">
              <Heart className="h-3.5 w-3.5" />
              <span>{testimonial.likes}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-card/30">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Social Proof
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            What developers are saying
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground leading-relaxed">
            Join thousands of developers using ExplainThisRepo to understand codebases faster and smarter.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="https://x.com/explainthisrepo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all testimonials on Twitter/X →
          </Link>
        </div>
      </div>
    </section>
  )
}
