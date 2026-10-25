import { useRef, useState } from 'react'
import { SiteNav } from './home/SiteNav'
import { PortfolioHero } from './home/PortfolioHero'
import { Sections } from './home/Sections'
import { IntroExperience } from './intro/IntroExperience'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function App() {
  const navRef = useRef<HTMLElement>(null)
  // reduced motion: langsung ke homepage tanpa intro
  const [reduced] = useState(prefersReducedMotion)

  return (
    <>
      <SiteNav navRef={navRef} hidden={!reduced} />
      <main>
        {reduced ? <PortfolioHero /> : <IntroExperience navRef={navRef} />}
        <Sections />
      </main>
    </>
  )
}

export default App
