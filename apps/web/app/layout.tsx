import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'

import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

export const metadata: Metadata = {
  title: 'ExplainThisRepo: Understand Any GitHub Repo Instantly',
  description: 'A CLI tool that generates plain-English explanations of public GitHub repositories by analyzing repository structure, README content, and high-signal files.',
  keywords: ['GitHub', 'CLI', 'developer tools', 'code analysis', 'repository', 'documentation'],
  metadataBase: new URL('https://explainthisrepo.com'),
  openGraph: {
    title: 'ExplainThisRepo: Understand Any GitHub Repo Instantly',
    description: 'A CLI tool that generates plain-English explanations of public GitHub repositories.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
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
