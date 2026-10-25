import type { Ref } from 'react'
import { hero } from '../content'

const figureSrc = `${import.meta.env.BASE_URL}images/home/nalin-character.webp`

export function PortfolioHero({ heroRef }: { heroRef?: Ref<HTMLElement> }) {
  return (
    <section ref={heroRef} id="top" className="hero" aria-label="Introduction" tabIndex={-1}>
      <div className="hero__world" aria-hidden="true" />
      <div className="hero__inner" data-hero-inner>
        <div className="hero__copy">
          <p className="hero__hello" data-hero-item>
            {hero.hello}
          </p>
          <h1 className="hero__headline" data-hero-item>
            {hero.headline.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className="hero__lede" data-hero-item>
            {hero.lede}
          </p>
          <a className="hero__cta" href={hero.cta.href} data-hero-item>
            {hero.cta.label}
          </a>
        </div>
        <img className="hero__figure" src={figureSrc} alt={hero.figureAlt} width={304} height={905} />
      </div>
    </section>
  )
}
