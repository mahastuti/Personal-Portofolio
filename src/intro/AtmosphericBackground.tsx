import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

interface Blob {
  x: number // posisi kiri, % lebar kanvas
  y: number // posisi atas, % tinggi kanvas
  w: number // lebar, % lebar kanvas
  h: number // tinggi, % lebar kanvas (supaya bentuknya tidak ikut gepeng)
  color: string // "r g b"
  alpha: number
}

// warna diambil dari palette artwork: peach, pink, biru langit, kuning mentega, lilac
const BLOBS: Record<'back' | 'front', Blob[]> = {
  back: [
    { x: -8, y: -10, w: 48, h: 30, color: '255 214 190', alpha: 0.5 },
    { x: 30, y: 5, w: 44, h: 26, color: '255 240 214', alpha: 0.55 },
    { x: 62, y: -8, w: 46, h: 30, color: '247 179 200', alpha: 0.35 },
    { x: 8, y: 48, w: 52, h: 28, color: '185 212 255', alpha: 0.3 },
    { x: 52, y: 52, w: 50, h: 30, color: '255 233 168', alpha: 0.32 },
  ],
  front: [
    { x: -12, y: 40, w: 46, h: 30, color: '255 246 232', alpha: 0.35 },
    { x: 36, y: 58, w: 40, h: 22, color: '217 200 255', alpha: 0.22 },
    { x: 68, y: 30, w: 44, h: 28, color: '255 246 232', alpha: 0.3 },
    { x: 20, y: 12, w: 30, h: 18, color: '255 214 190', alpha: 0.18 },
  ],
}

const pct = (v: number) => `${v}%`

export function AtmosphericBackground({ variant, reduced }: { variant: 'back' | 'front'; reduced: boolean }) {
  const root = useRef<HTMLDivElement>(null)

  // gerakan asap: tiap blob bergerak sendiri, pelan, bolak-balik tanpa sambungan
  useGSAP(
    () => {
      if (reduced) return
      const r = gsap.utils.random
      gsap.utils.toArray<HTMLElement>('.intro-smoke__blob').forEach((el) => {
        gsap.to(el, {
          xPercent: r(-22, 22),
          yPercent: r(-18, 18),
          rotation: r(-14, 14),
          scale: r(0.85, 1.22),
          opacity: r(0.45, 0.85),
          duration: r(13, 26),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: r(-12, 0),
        })
      })
    },
    { scope: root, dependencies: [reduced] },
  )

  return (
    <div ref={root} className={`intro-smoke intro-smoke--${variant}`} aria-hidden="true">
      {BLOBS[variant].map((b, i) => (
        <span
          key={i}
          className="intro-smoke__blob"
          style={{
            left: pct(b.x),
            top: pct(b.y),
            width: pct(b.w),
            aspectRatio: `${b.w} / ${b.h}`,
            background: `radial-gradient(closest-side, rgb(${b.color} / ${b.alpha}), rgb(${b.color} / 0))`,
          }}
        />
      ))}
    </div>
  )
}
