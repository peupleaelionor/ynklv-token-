import { Navigation }           from '@/components/nav/Navigation'
import { CinematicHero }        from '@/components/landing/CinematicHero'
import { ManifestoSection }     from '@/components/landing/ManifestoSection'
import { EcosystemMap }         from '@/components/landing/EcosystemMap'
import { ProductShowcase }      from '@/components/landing/ProductShowcase'
import { TokenSection }         from '@/components/landing/TokenSection'
import { FinalCTA, SiteFooter } from '@/components/landing/FinalCTA'

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <CinematicHero />
        <ManifestoSection />
        <EcosystemMap />
        <ProductShowcase />
        <TokenSection />
        <FinalCTA />
      </main>
      <SiteFooter />
    </>
  )
}
