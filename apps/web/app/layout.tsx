import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "ExplainThisRepo: CLI to explain GitHub repositories in plain English",
  description:
    "ExplainThisRepo is a CLI tool that explains GitHub repositories in plain English. Install with pipx and generate an EXPLAIN.md for any repo.",
  keywords: [
    "github cli",
    "explain github repo",
    "developer tools",
    "open source cli",
    "pip",
  ],
  authors: [{ name: "Caleb Wodi" }],
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://explainthisrepo.com/",
  },
  openGraph: {
    title: "ExplainThisRepo: Explain GitHub repos in plain English",
    description:
      "A CLI tool that explains any GitHub repo in plain English and generates an EXPLAIN.md file.",
    url: "https://explainthisrepo.com/",
    type: "website",
    images: [
      {
        url: "https://explainthisrepo.com/og.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ExplainThisRepo: Explain GitHub repos in plain English",
    description: "Run one command. Get a plain-English EXPLAIN.md for any repo.",
    images: ["https://explainthisrepo.com/og.png"],
    creator: "@calchiwo",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="author" content="Caleb Wodi" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}