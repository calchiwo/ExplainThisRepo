import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Modes } from "@/components/modes"
import { InputFormats } from "@/components/input-formats"
import { Install } from "@/components/install"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"
import { DocsSections } from "@/components/docs-sections"

export default function Page() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <Modes />
      <InputFormats />
      <Install />
      <section className="py-24 md:py-32 bg-secondary/20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
              Full Documentation
            </p>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Complete Guide
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground leading-relaxed">
              Everything you need to install, configure, and use ExplainThisRepo effectively. Click on any section to expand.
            </p>
          </div>
          <DocsSections />
        </div>
      </section>
      <CTA />
      <Footer />
    </main>
  )
}
