import { useRef, type ReactNode, type RefObject } from 'react'
import { useCursorReveal } from '../hooks/useCursorReveal'

interface Props {
  areaRef: RefObject<HTMLElement | null>
  radius: number
  reduced: boolean
  children: ReactNode
}

// kabut tipis + konten tersembunyi, hanya terlihat di dalam mask radial yang mengikuti pointer
export function CursorReveal({ areaRef, radius, reduced, children }: Props) {
  const mask = useRef<HTMLDivElement>(null)
  useCursorReveal(areaRef, mask, { radius, reduced })

  return (
    <div className="intro-reveal-wrap">
      <div ref={mask} className="intro-reveal">
        {children}
      </div>
    </div>
  )
}
