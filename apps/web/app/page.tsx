import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Modes } from "@/components/modes"
import { InputFormats } from "@/components/input-formats"
import { Configuration } from "@/components/configuration"
import { GithubToken } from "@/components/github-token"
import { Downloads } from "@/components/downloads"
import { MoreFeatures } from "@/components/more-features"
import { Testimonials } from "@/components/testimonials"
import { Install } from "@/components/install"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <Modes />
      <InputFormats />
      <Configuration />
      <GithubToken />
      <Downloads />
      <MoreFeatures />
      <Testimonials />
      <Install />
      <CTA />
      <Footer />
    </main>
  )
}
