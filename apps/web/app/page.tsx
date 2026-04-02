import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Modes } from "@/components/modes"
import { CLIFlags } from "@/components/cli-flags"
import { PlatformSupport } from "@/components/platform-support"
import { InputFormats } from "@/components/input-formats"
import { Install } from "@/components/install"
import { Contributors } from "@/components/contributors"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <Modes />
      <CLIFlags />
      <PlatformSupport />
      <InputFormats />
      <Install />
      <Contributors />
      <CTA />
      <Footer />
    </main>
  )
}
