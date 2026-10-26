import { useRef, type CSSProperties, type RefObject } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { PortfolioHero } from '../home/PortfolioHero'
import { useMouseParallax } from '../hooks/useMouseParallax'
import { useScrollTransition } from '../hooks/useScrollTransition'
import { AtmosphericBackground } from './AtmosphericBackground'
import { CrowdLayer, Depth } from './CrowdLayer'
import { CursorReveal } from './CursorReveal'
import { HiddenArtwork } from './HiddenArtwork'
import { IntroNavigation } from './IntroNavigation'
import { MainCharacter } from './MainCharacter'
import {
  ARTWORK_RATIO,
  CROWD_HOTSPOTS,
  FOCUS,
  INTRO_ASSETS,
  PARALLAX,
  PIN_LENGTH,
  PORTAL_HOLE,
  REVEAL_RADIUS,
  STAGE_BLEED,
} from './config'
import { useImagesReady } from './useImagesReady'

gsap.registerPlugin(useGSAP)

interface Props {
  navRef: RefObject<HTMLElement | null>
  reduced: boolean
}

export function IntroScene({ navRef, reduced }: Props) {
  const root = useRef<HTMLElement>(null)
  const ready = useImagesReady(Object.values(INTRO_ASSETS))
  const animated = ready && !reduced

  useMouseParallax(root, animated)
  const { skip } = useScrollTransition(root, { enabled: animated, pinLength: PIN_LENGTH, focus: FOCUS, navRef })

  // cahaya orang-orang bernapas pelan, tetap jalan walau pointer diam
  useGSAP(
    () => {
      if (!animated) return
      gsap.to('.intro-glow--halo', { opacity: 0.65, duration: 6.5, ease: 'sine.inOut', repeat: -1, yoyo: true })
      gsap.to('.intro-glow--bloom', { opacity: 0.4, duration: 4.8, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: -2 })
    },
    { scope: root, dependencies: [animated] },
  )

  const stageVars = {
    '--ar': ARTWORK_RATIO,
    '--fx': FOCUS.x,
    '--fy': FOCUS.y,
    '--bleed': STAGE_BLEED,
  } as CSSProperties

  const portalVars = {
    '--ar': ARTWORK_RATIO,
    '--hx': PORTAL_HOLE.x,
    '--hy': PORTAL_HOLE.y,
    '--hmx': Math.min(PORTAL_HOLE.x, 1 - PORTAL_HOLE.x),
    '--hmy': Math.min(PORTAL_HOLE.y, 1 - PORTAL_HOLE.y),
  } as CSSProperties

  return (
    <section
      ref={root}
      id="top"
      className="intro"
      data-ready={ready || undefined}
      data-static={reduced || undefined}
      aria-label="Opening"
    >
      {!reduced && (
        <div className="intro__about">
          <PortfolioHero />
        </div>
      )}

      <div className="intro-scene" aria-hidden="true">
        <div className="intro-camera">
          <div className="intro-stage" style={stageVars}>
            <Depth depth="bg" parallax={PARALLAX.bg}>
              <img className="intro-art intro-art--bg" src={INTRO_ASSETS.background} alt="" draggable={false} />
              <img className="intro-glow intro-glow--halo" src={INTRO_ASSETS.glowHalo} alt="" draggable={false} />
              <AtmosphericBackground variant="back" reduced={reduced} />
              <CursorReveal areaRef={root} radius={REVEAL_RADIUS} reduced={reduced}>
                <HiddenArtwork />
              </CursorReveal>
            </Depth>

            <CrowdLayer depth="mid" parallax={PARALLAX.mid} src={INTRO_ASSETS.midground} hotspots={CROWD_HOTSPOTS}>
              <img className="intro-glow intro-glow--bloom" src={INTRO_ASSETS.glowBloom} alt="" draggable={false} />
            </CrowdLayer>

            <Depth depth="character" parallax={PARALLAX.character}>
              <MainCharacter src={INTRO_ASSETS.character} />
            </Depth>

            <CrowdLayer depth="fg" parallax={PARALLAX.fg} src={INTRO_ASSETS.foreground} />

            <Depth depth="haze-front" parallax={PARALLAX.haze}>
              <AtmosphericBackground variant="front" reduced={reduced} />
            </Depth>
          </div>
        </div>
        <div className="intro-veil" />
        <div className="intro-tint" />
      </div>

      {!reduced && (
        <img className="intro-portal" src={INTRO_ASSETS.portal} alt="" style={portalVars} draggable={false} />
      )}

      <IntroNavigation onSkip={skip} showChrome={!reduced} />
    </section>
  )
}
