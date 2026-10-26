import { useEffect, type RefObject } from 'react'
import { gsap } from 'gsap'

// tiap elemen [data-parallax="<px>"] bergeser berlawanan arah pointer, makin besar angkanya makin jauh
export function useMouseParallax(areaRef: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const area = areaRef.current
    if (!area || !enabled) return

    const layers = Array.from(area.querySelectorAll<HTMLElement>('[data-parallax]')).map((el) => ({
      strength: Number(el.dataset.parallax) || 0,
      x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3.out' }),
    }))

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      // posisi pointer relatif ke area intro, -1..1
      const r = area.getBoundingClientRect()
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1
      for (const l of layers) {
        l.x(-nx * l.strength)
        l.y(-ny * l.strength * 0.6)
      }
    }

    // kembali pelan ke posisi awal saat pointer keluar
    const onLeave = () => {
      for (const l of layers) {
        l.x(0)
        l.y(0)
      }
    }

    area.addEventListener('pointermove', onMove)
    area.addEventListener('pointerleave', onLeave)
    return () => {
      area.removeEventListener('pointermove', onMove)
      area.removeEventListener('pointerleave', onLeave)
      layers.length = 0
    }
  }, [areaRef, enabled])
}
