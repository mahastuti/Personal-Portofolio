import { useRef, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)
ScrollTrigger.config({ ignoreMobileResize: true })

interface Options {
  enabled: boolean
  pinLength: number
  focus: { x: number; y: number }
  navRef: RefObject<HTMLElement | null>
}

// kamera bergerak ke tokoh utama: translate + scale tanpa memperlihatkan tepi artwork
function cameraFrame(camera: HTMLElement, stage: HTMLElement, focus: { x: number; y: number }) {
  const vw = camera.clientWidth
  const vh = camera.clientHeight
  const W = stage.offsetWidth
  const H = stage.offsetHeight
  const fx = stage.offsetLeft + focus.x * W
  const fy = stage.offsetTop + focus.y * H
  // jarak dari titik fokus ke tiap tepi kanvas, dalam koordinat layar
  const need = Math.max(
    1.25,
    vw / 2 / (fx - stage.offsetLeft),
    vw / 2 / (stage.offsetLeft + W - fx),
    vh / 2 / (fy - stage.offsetTop),
    vh / 2 / (stage.offsetTop + H - fy),
  )
  return {
    transformOrigin: `${fx}px ${fy}px`,
    x: vw / 2 - fx,
    y: vh / 2 - fy,
    scale: need * 1.03,
  }
}

// satu timeline, satu sumber progress: posisi scroll selama intro di-pin
export function useScrollTransition(rootRef: RefObject<HTMLElement | null>, opts: Options) {
  const trigger = useRef<ScrollTrigger | null>(null)
  const { enabled, pinLength, focus, navRef } = opts

  useGSAP(
    () => {
      const root = rootRef.current
      if (!enabled || !root) return
      const q = gsap.utils.selector(root)
      const camera = q<HTMLElement>('.intro-camera')[0]
      const stage = q<HTMLElement>('.intro-stage')[0]
      const about = q<HTMLElement>('.intro__about .hero')[0]
      const aboutInner = q('[data-hero-inner]')
      const aboutItems = q('[data-hero-item]')
      const origin = `${focus.x * 100}% ${focus.y * 100}%`

      gsap.set(q('[data-depth]'), { transformOrigin: origin })
      gsap.set(aboutInner, { scale: 1.1, transformOrigin: '50% 60%' })
      gsap.set(aboutItems, { autoAlpha: 0, y: 28 })
      gsap.set(navRef.current, { autoAlpha: 0 })
      if (about) about.inert = true

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${window.innerHeight * pinLength}`,
          pin: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const revealed = self.progress > 0.97
            if (about) about.inert = !revealed
            root.toggleAttribute('data-revealed', revealed)
          },
        },
      })
      trigger.current = tl.scrollTrigger ?? null

      // teks intro dan reveal angka mundur dulu supaya kamera bersih
      tl.to(q('[data-intro-fade]'), { autoAlpha: 0, y: -12, duration: 0.1 }, 0)
        .to(q('.intro-reveal-wrap'), { autoAlpha: 0, duration: 0.1 }, 0)
        .to(q('.intro-skip'), { autoAlpha: 0, duration: 0.1 }, 0.42)
        // logo intro diganti logo nav utama di posisi yang sama
        .to(q('.intro-nav__brand'), { autoAlpha: 0, duration: 0.06 }, 0.9)
        // dorongan kamera ke tokoh utama; nilai dihitung ulang saat resize
        .fromTo(
          camera,
          { x: 0, y: 0, scale: 1, transformOrigin: () => cameraFrame(camera, stage, focus).transformOrigin },
          {
            x: () => cameraFrame(camera, stage, focus).x,
            y: () => cameraFrame(camera, stage, focus).y,
            scale: () => cameraFrame(camera, stage, focus).scale,
            transformOrigin: () => cameraFrame(camera, stage, focus).transformOrigin,
            duration: 0.62,
            ease: 'power1.inOut',
          },
          0,
        )
        // parallax kedalaman: foreground paling cepat, background paling lambat
        .to(q('[data-depth="bg"]'), { scale: 1.12, duration: 0.7 }, 0)
        .to(q('[data-depth="bg"]'), { autoAlpha: 0.4, duration: 0.45 }, 0.25)
        .to(q('[data-depth="mid"]'), { scale: 1.7, duration: 0.7 }, 0)
        .to(q('[data-depth="mid"]'), { autoAlpha: 0.15, duration: 0.32 }, 0.4)
        .to(q('[data-depth="fg"]'), { scale: 3.2, duration: 0.5, ease: 'power1.in' }, 0)
        .to(q('[data-depth="fg"]'), { autoAlpha: 0, duration: 0.25 }, 0.25)
        .to(q('[data-depth="character"]'), { scale: 2.4, duration: 0.72, ease: 'power1.in' }, 0)
        .to(q('[data-depth="character"]'), { autoAlpha: 0, duration: 0.16 }, 0.64)
        // atmosfer makin tebal
        .to(q('[data-depth="haze-front"]'), { scale: 1.6, duration: 0.7 }, 0)
        .to(q('.intro-veil'), { opacity: 0.6, duration: 0.4 }, 0.3)
        .to(q('.intro-tint'), { opacity: 0.45, duration: 0.45 }, 0.3)
        // portal haze menutup, scene hilang, lalu lubangnya membuka ke about me
        .fromTo(q('.intro-portal'), { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 0.14 }, 0.5)
        .to(q('.intro-scene'), { autoAlpha: 0, duration: 0.16 }, 0.62)
        .to(q('.intro-portal'), { scale: 6, duration: 0.34, ease: 'power2.in' }, 0.66)
        .to(q('.intro-portal'), { autoAlpha: 0, duration: 0.12 }, 0.88)
        .to(aboutInner, { scale: 1, duration: 0.4, ease: 'power2.out' }, 0.6)
        .to(aboutItems, { autoAlpha: 1, y: 0, duration: 0.12, stagger: 0.03 }, 0.8)
        .to(navRef.current, { autoAlpha: 1, duration: 0.08 }, 0.92)

      return () => {
        trigger.current = null
      }
    },
    { scope: rootRef, dependencies: [enabled] },
  )

  // lompat ke akhir intro
  const skip = () => {
    const end = trigger.current?.end
    if (end == null) {
      document.getElementById('about')?.scrollIntoView()
      return
    }
    window.scrollTo({ top: end + 2, behavior: 'instant' })
    window.setTimeout(() => {
      const about = rootRef.current?.querySelector<HTMLElement>('#about')
      about?.focus({ preventScroll: true })
    }, 60)
  }

  return { skip }
}
