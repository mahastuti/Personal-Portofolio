import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { intro } from '../content'
import { PortfolioHero } from '../home/PortfolioHero'
import { ARTWORK_RATIO, FOCUS, HINT_DELAY, INTRO_ASSETS, PIN_LENGTH, PORTAL_HOLE, TARGET_BOX } from './config'
import { useImagesReady } from './useImagesReady'

gsap.registerPlugin(ScrollTrigger, useGSAP)
ScrollTrigger.config({ ignoreMobileResize: true })

type Phase = 'idle' | 'selected'

// layer lain sedikit "menjauh" saat figur dipilih
const RECEDE = 0.97

const pct = (v: number) => `${(v * 100).toFixed(3)}%`

const targetBoxStyle: CSSProperties = {
  left: pct(TARGET_BOX.x),
  top: pct(TARGET_BOX.y),
  width: pct(TARGET_BOX.w),
  height: pct(TARGET_BOX.h),
}

function lockScroll(lock: boolean) {
  const v = lock ? 'hidden' : ''
  document.documentElement.style.overflow = v
  document.body.style.overflow = v
}

export function IntroExperience({ navRef }: { navRef: RefObject<HTMLElement | null> }) {
  const root = useRef<HTMLElement>(null)
  const camera = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const targetWrap = useRef<HTMLDivElement>(null)
  const hero = useRef<HTMLElement>(null)
  const cursor = useRef<HTMLDivElement>(null)
  const trigger = useRef<ScrollTrigger | null>(null)
  const phaseRef = useRef<Phase>('idle')
  const [phase, setPhase] = useState<Phase>('idle')
  const ready = useImagesReady(Object.values(INTRO_ASSETS))

  // intro selalu mulai dari atas, scroll dikunci sampai figur dipilih
  useEffect(() => {
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    lockScroll(true)
    return () => lockScroll(false)
  }, [])

  // posisi kamera yang membawa figur ke tengah layar tanpa memperlihatkan tepi artwork
  function cameraFrame() {
    const s = stage.current!
    const box = camera.current!
    const vw = box.clientWidth
    const vh = box.clientHeight
    const W = s.offsetWidth
    const H = s.offsetHeight
    const fx = s.offsetLeft + FOCUS.x * W
    const fy = s.offsetTop + FOCUS.y * H
    const need = Math.max(
      1,
      vw / 2 / (FOCUS.x * W),
      vw / 2 / ((1 - FOCUS.x) * W),
      vh / 2 / (FOCUS.y * H),
      vh / 2 / ((1 - FOCUS.y) * H),
    )
    return {
      transformOrigin: `${fx}px ${fy}px`,
      x: vw / 2 - fx,
      y: vh / 2 - fy,
      scale: (need / RECEDE) * 1.01,
    }
  }

  const { contextSafe } = useGSAP(
    () => {
      if (!ready) return
      const q = gsap.utils.selector(root)
      const origin = `${FOCUS.x * 100}% ${FOCUS.y * 100}%`
      const heroInner = q('[data-hero-inner]')
      const heroItems = q('[data-hero-item]')

      // state awal: semua skala berpusat di figur target
      gsap.set(q('[data-depth], [data-depth] > img'), { transformOrigin: origin })
      gsap.set(heroInner, { scale: 1.12, transformOrigin: '50% 60%' })
      gsap.set(heroItems, { autoAlpha: 0, y: 28 })
      gsap.set(navRef.current, { autoAlpha: 0 })
      if (hero.current) hero.current.inert = true

      // satu timeline, satu sumber progress: posisi scroll selama hero di-pin
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * PIN_LENGTH}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const revealed = self.progress > 0.97
            if (hero.current) hero.current.inert = !revealed
            root.current?.toggleAttribute('data-revealed', revealed)
          },
        },
      })
      trigger.current = tl.scrollTrigger ?? null

      tl.to(q('[data-copy-scroll], .intro-skip'), { autoAlpha: 0, y: -16, duration: 0.12 }, 0)
        // parallax: makin dekat ke kamera, makin cepat membesar
        .to(q('[data-depth="bg"]'), { scale: 1.3, duration: 0.75 }, 0)
        .to(q('[data-depth="mid"]'), { scale: 2.1, duration: 0.75 }, 0)
        .to(q('[data-depth="fg"]'), { scale: 3.8, duration: 0.55, ease: 'power1.in' }, 0)
        .to(q('[data-depth="fg"]'), { autoAlpha: 0, duration: 0.2 }, 0.35)
        .to(q('[data-depth="target"]'), { scale: 3.4, duration: 0.72, ease: 'power1.in' }, 0)
        // figur melebur, warna hangat bergeser ke biru
        .fromTo(targetWrap.current, { filter: 'blur(0px)' }, { filter: 'blur(14px)', autoAlpha: 0, duration: 0.23 }, 0.55)
        .to(q('.intro-tint'), { opacity: 0.62, duration: 0.55 }, 0.15)
        // portal haze menutup, crowd hilang, lalu lubangnya membuka ke homepage
        .fromTo(q('.intro-portal'), { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 0.16 }, 0.48)
        .to(q('.intro-scene'), { autoAlpha: 0, duration: 0.16 }, 0.62)
        .to(q('.intro-portal'), { scale: 6, duration: 0.34, ease: 'power2.in' }, 0.66)
        .to(q('.intro-portal'), { autoAlpha: 0, duration: 0.12 }, 0.88)
        .to(heroInner, { scale: 1, duration: 0.4, ease: 'power2.out' }, 0.6)
        .to(heroItems, { autoAlpha: 1, y: 0, duration: 0.12, stagger: 0.03 }, 0.8)
        .to(navRef.current, { autoAlpha: 1, duration: 0.08 }, 0.92)

      // kamera dihitung ulang kalau ukuran layar berubah setelah figur dipilih
      const onRefresh = () => {
        if (phaseRef.current === 'selected') gsap.set(camera.current, cameraFrame())
      }
      ScrollTrigger.addEventListener('refresh', onRefresh)

      // label kursor mengikuti pointer lewat quickTo, tanpa react state
      const xTo = gsap.quickTo(cursor.current, 'x', { duration: 0.25, ease: 'power3' })
      const yTo = gsap.quickTo(cursor.current, 'y', { duration: 0.25, ease: 'power3' })
      const onMove = (e: globalThis.PointerEvent) => {
        xTo(e.clientX)
        yTo(e.clientY)
      }
      window.addEventListener('pointermove', onMove)

      return () => {
        ScrollTrigger.removeEventListener('refresh', onRefresh)
        window.removeEventListener('pointermove', onMove)
        trigger.current = null
      }
    },
    { scope: root, dependencies: [ready] },
  )

  // sebelum figur dipilih, konten di bawah intro tidak bisa dijangkau tab (scroll masih dikunci)
  useEffect(() => {
    const el = root.current
    const main = el?.closest('main')
    if (!el || !main) return
    const rest = Array.from(main.children).filter((c) => !c.contains(el)) as HTMLElement[]
    rest.forEach((c) => (c.inert = phase === 'idle'))
    return () => rest.forEach((c) => (c.inert = false))
  }, [phase])

  // hint ringan kalau pengunjung belum menemukan figurnya
  const pulse = () => {
    const el = targetWrap.current
    if (!el || phaseRef.current !== 'idle') return
    el.classList.remove('is-hinting')
    void el.offsetWidth
    el.classList.add('is-hinting')
  }

  useEffect(() => {
    if (!ready || phase !== 'idle') return
    const id = window.setTimeout(pulse, HINT_DELAY)
    return () => window.clearTimeout(id)
  }, [ready, phase])

  // logo nav: kembali ke homepage (akhir intro), bukan ke awal crowd
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href="#top"]')
      if (!a || !trigger.current) return
      e.preventDefault()
      window.scrollTo({ top: trigger.current.end, behavior: 'smooth' })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const setDiscover = (value: '' | 'pointer' | 'focus') => {
    const s = stage.current
    if (!s) return
    if (value) s.dataset.discover = value
    else delete s.dataset.discover
    cursor.current?.classList.toggle('is-on', value === 'pointer')
  }

  const markSelected = () => {
    phaseRef.current = 'selected'
    setPhase('selected')
    setDiscover('')
    targetWrap.current?.classList.remove('is-hinting')
  }

  // contextSafe dipanggil saat event, bukan saat render
  const select = () => contextSafe(runSelect)()
  const skip = () => contextSafe(runSkip)()

  function runSelect() {
    if (phaseRef.current !== 'idle') return
    markSelected()
    const q = gsap.utils.selector(root)
    gsap
      .timeline({
        defaults: { duration: 0.8, ease: 'power3.inOut' },
        onComplete: () => {
          lockScroll(false)
          ScrollTrigger.refresh()
          q<HTMLElement>('[data-copy="selected"]')[0]?.focus({ preventScroll: true })
        },
      })
      .to(camera.current, cameraFrame(), 0)
      .to(
        q('[data-depth] > img[data-blur]'),
        { filter: (_: number, el: HTMLElement) => `blur(${el.dataset.blur}px)`, scale: RECEDE },
        0,
      )
      .to(q('[data-copy="idle"]'), { autoAlpha: 0, y: -12, duration: 0.4 }, 0)
      .fromTo(q('[data-copy="selected"]'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.3)
  }

  function runSkip() {
    if (phaseRef.current === 'idle') {
      markSelected()
      const q = gsap.utils.selector(root)
      gsap.set(camera.current, cameraFrame())
      gsap.set(q('[data-copy="idle"]'), { autoAlpha: 0 })
    }
    lockScroll(false)
    ScrollTrigger.refresh()
    const end = trigger.current?.end ?? 0
    window.scrollTo({ top: end + 2, behavior: 'instant' })
    window.setTimeout(() => hero.current?.focus({ preventScroll: true }), 60)
  }

  const onHitEnter = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' && phaseRef.current === 'idle') setDiscover('pointer')
  }

  const onSceneClick = () => {
    if (phaseRef.current === 'idle') pulse()
  }

  const stageVars = {
    '--ar': ARTWORK_RATIO,
    '--fx': FOCUS.x,
    '--fy': FOCUS.y,
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
      className="intro"
      data-phase={phase}
      data-ready={ready || undefined}
      aria-label="Opening"
    >
      <button type="button" className="intro-skip" onClick={skip}>
        {intro.skip}
      </button>

      <div className="intro__hero">
        <PortfolioHero heroRef={hero} />
      </div>

      <div className="intro-scene" onClick={onSceneClick}>
        <div ref={camera} className="intro-camera">
          <div ref={stage} className="intro-stage" style={stageVars}>
            <div className="intro-layer" data-depth="bg">
              <img src={INTRO_ASSETS.background} alt="" data-blur="2" draggable={false} />
            </div>
            <div className="intro-layer" data-depth="mid">
              <img src={INTRO_ASSETS.midground} alt="" data-blur="4" draggable={false} />
            </div>
            <div className="intro-layer" data-depth="target">
              <div ref={targetWrap} className="intro-target" style={targetBoxStyle}>
                <img src={INTRO_ASSETS.target} alt="" draggable={false} />
                <span className="intro-target__tip" aria-hidden="true">
                  {intro.cursor}
                </span>
              </div>
            </div>
            <div className="intro-layer" data-depth="fg">
              <img src={INTRO_ASSETS.foreground} alt="" data-blur="6" draggable={false} />
            </div>
            <button
              type="button"
              className="intro-hit"
              style={targetBoxStyle}
              aria-label={intro.targetLabel}
              disabled={phase !== 'idle' || !ready}
              onClick={(e) => {
                e.stopPropagation()
                select()
              }}
              onPointerEnter={onHitEnter}
              onPointerLeave={() => setDiscover('')}
              onFocus={(e) => e.currentTarget.matches(':focus-visible') && setDiscover('focus')}
              onBlur={() => setDiscover('')}
            />
          </div>
        </div>
        <div className="intro-tint" />
      </div>

      <img className="intro-portal" src={INTRO_ASSETS.portal} alt="" style={portalVars} draggable={false} />

      <div className="intro-copy">
        <div className="intro-label" data-copy="idle">
          <p className="intro-label__title">{intro.label}</p>
          <p className="intro-label__note">{intro.prompt}</p>
        </div>
        <div data-copy-scroll>
          <div className="intro-label intro-label--moment" data-copy="selected" tabIndex={-1} aria-live="polite">
            {phase === 'selected' && (
              <>
                <p className="intro-label__moment">{intro.selected}</p>
                <p className="intro-label__note">{intro.scroll}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div ref={cursor} className="intro-cursor" aria-hidden="true">
        <span className="intro-cursor__dot" />
        <span className="intro-cursor__label">{intro.cursor}</span>
      </div>
    </section>
  )
}
