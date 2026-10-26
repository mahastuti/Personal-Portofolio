import { useRef } from 'react'
import { SiteNav } from './home/SiteNav'
import { PortfolioHero } from './home/PortfolioHero'
import { Sections } from './home/Sections'
import { IntroScene } from './intro/IntroScene'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'

function App() {
  const navRef = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()

  return (
    <>
      <SiteNav navRef={navRef} hidden={!reduced} />
      <main>
        {/* reduced motion: intro jadi gambar statis, about me langsung di bawahnya */}
        <IntroScene key={String(reduced)} navRef={navRef} reduced={reduced} />
        {reduced && <PortfolioHero />}
        <Sections />
      </main>
    </>
  )
}

export default App
