import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'

import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

export const metadata: Metadata = {
  title: 'ExplainThisRepo: Understand Any Codebase in Plain English',
  description: 'The fastest way to understand any codebase using real project signals. Analyze GitHub repos, local directories, and get clear explanations without blind AI summarization. Python, Node.js & standalone binaries available.',
  keywords: [
    'GitHub',
    'CLI tool',
    'code analysis',
    'repository analysis',
    'codebase understanding',
    'developer tools',
    'code documentation',
    'AI code explanation',
    'open source',
    'software architecture'
  ],
  metadataBase: new URL('https://explainthisrepo.com'),
  other: {
    "websitelaunches-verification": "155f2b1b53e5917e5ed8c827903883db"
  },
  openGraph: {
    title: 'ExplainThisRepo: The fastest way to understand any codebase in plain English',
    description: 'Analyze GitHub repositories and local codebases using real project signals, not blind AI summarization. Get instant explanations with ExplainThisRepo CLI.',
    type: 'website',
    url: 'https://explainthisrepo.com',
    siteName: 'ExplainThisRepo',
    images: [
      {
        url: 'apps/web/og.png',
        width: 512,
        height: 512,
        alt: 'ExplainThisRepo Logo'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ExplainThisRepo: The fastest way to understand any codebase in plain English',
    description: 'Analyze GitHub repositories and local codebases using real project signals, not blind AI summarization. Get instant explanations with ExplainThisRepo CLI',
    site: '@explainthisrepo',
    creator: '@calchiwo',
    images: ['apps/web/og.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1
    }
  },
  alternates: {
    canonical: 'https://explainthisrepo.com'
  }
}

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
