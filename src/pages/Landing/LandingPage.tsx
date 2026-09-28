import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Benefits } from './sections/Benefits'
import { ChallengeSection } from './sections/ChallengeSection'
import { Faq } from './sections/Faq'
import { Features } from './sections/Features'
import { FinalCta } from './sections/FinalCta'
import { Footer } from './sections/Footer'
import { Hero } from './sections/Hero'
import { ModulesMarquee } from './sections/ModulesMarquee'
import { Navbar } from './sections/Navbar'
import { Pricing } from './sections/Pricing'
import { Problem } from './sections/Problem'
import { Showcase } from './sections/Showcase'
import { Solution } from './sections/Solution'
import { Testimonials } from './sections/Testimonials'

export default function LandingPage() {
  useDocumentTitle()
  return (
    <div className="min-h-dvh bg-canvas">
      <a href="#conteudo" className="sr-only z-50 rounded-lg bg-primary px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="conteudo">
        <Hero />
        <ModulesMarquee />
        <Problem />
        <Solution />
        <Features />
        <Showcase />
        <ChallengeSection />
        <Benefits />
        <Testimonials />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
