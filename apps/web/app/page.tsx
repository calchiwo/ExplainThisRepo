import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Modes } from "@/components/modes"
import { InputFormats } from "@/components/input-formats"
import { Install } from "@/components/install"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col">
        <Hero />
        <Features />
        <Modes />
        <InputFormats />
        <Install />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
