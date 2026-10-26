import { useEffect, type RefObject } from 'react'
import { gsap } from 'gsap'

interface Options {
  radius: number
  reduced: boolean
}

// mask radial mengikuti pointer; koordinat dihitung ulang tiap frame supaya tetap akurat saat resize, scroll, atau parallax
export function useCursorReveal(
  areaRef: RefObject<HTMLElement | null>,
  maskRef: RefObject<HTMLElement | null>,
  { radius, reduced }: Options,
) {
  useEffect(() => {
    const area = areaRef.current
    const mask = maskRef.current
    if (!area || !mask) return

    const pointer = { x: 0, y: 0 }
    const pos = { x: 0, y: 0 }
    const state = { active: false, visible: 0, holdTimer: 0 }
    const fade = { value: 0 }
    let fadeTween: gsap.core.Tween | null = null

    const show = (on: boolean) => {
      if (state.active === on) return
      state.active = on
      fadeTween?.kill()
      fadeTween = gsap.to(fade, {
        value: on ? 1 : 0,
        duration: reduced ? 0 : on ? 0.5 : 0.8,
        ease: on ? 'power2.out' : 'power2.inOut',
      })
    }

    const setPointer = (e: PointerEvent, jump = false) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      if (jump || fade.value === 0) {
        pos.x = pointer.x
        pos.y = pointer.y
      }
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        if (state.active) setPointer(e)
        return
      }
      setPointer(e)
      show(true)
    }

    const onLeave = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') show(false)
    }

    // layar sentuh: tahan sebentar untuk membuka, lalu boleh digeser
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return
      setPointer(e, true)
      window.clearTimeout(state.holdTimer)
      state.holdTimer = window.setTimeout(() => show(true), 280)
    }
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return
      window.clearTimeout(state.holdTimer)
      show(false)
    }
    // selama reveal aktif di layar sentuh, geser jari tidak ikut men-scroll halaman
    const onTouchMove = (e: TouchEvent) => {
      if (state.active) e.preventDefault()
    }

    const tick = (_t: number, dt: number) => {
      if (fade.value === 0 && !state.active) {
        if (state.visible !== 0) {
          mask.style.opacity = '0'
          state.visible = 0
        }
        return
      }
      // sedikit inersia supaya lingkarannya tidak kaku
      const k = reduced ? 1 : 1 - Math.exp(-dt / 55)
      pos.x += (pointer.x - pos.x) * k
      pos.y += (pointer.y - pos.y) * k

      // client px -> koordinat lokal elemen yang di-mask (memperhitungkan scale dari parent)
      const r = mask.getBoundingClientRect()
      const sx = r.width / mask.offsetWidth || 1
      const sy = r.height / mask.offsetHeight || 1
      mask.style.setProperty('--rx', `${(pos.x - r.left) / sx}px`)
      mask.style.setProperty('--ry', `${(pos.y - r.top) / sy}px`)
      mask.style.setProperty('--rr', `${radius / sx}px`)
      mask.style.opacity = fade.value.toFixed(3)
      state.visible = fade.value
    }

    gsap.ticker.add(tick)
    area.addEventListener('pointermove', onMove)
    area.addEventListener('pointerleave', onLeave)
    area.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    area.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
      gsap.ticker.remove(tick)
      fadeTween?.kill()
      window.clearTimeout(state.holdTimer)
      area.removeEventListener('pointermove', onMove)
      area.removeEventListener('pointerleave', onLeave)
      area.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      area.removeEventListener('touchmove', onTouchMove)
    }
  }, [areaRef, maskRef, radius, reduced])
}
