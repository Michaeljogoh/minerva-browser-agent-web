import type { Metadata } from "next"

import { Cta, Footer } from "@/components/landing/cta-footer"
import { Faq } from "@/components/landing/faq"
import { Features } from "@/components/landing/features"
import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Nav } from "@/components/landing/nav"
import { Problem } from "@/components/landing/problem"
import { Trust } from "@/components/landing/trust"
import { WakeApi } from "@/components/landing/wake-api"
import { UseCases } from "@/components/landing/use-cases"

export const metadata: Metadata = {
  title: "Minerva | AI browser agent for SMB accounting",
  description:
    "Minerva handles the tab-hopping behind small-business accounting: reconciliation, receipts, month-end close and tax research. Nothing posts without your approval.",
}

export default function LandingPage() {
  return (
    <>
      <WakeApi />
      <Nav />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Features />
        <UseCases />
        <Trust />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  )
}
