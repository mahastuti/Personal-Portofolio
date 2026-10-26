import type { ReactNode } from 'react'
import { CANVAS } from './config'

const pct = (v: number, total: number) => `${((v / total) * 100).toFixed(3)}%`

interface DepthProps {
  depth: string
  parallax: number
  children: ReactNode
}

// wrapper kedalaman: luar dianimasikan scroll, dalam digeser parallax pointer
export function Depth({ depth, parallax, children }: DepthProps) {
  return (
    <div className="intro-depth" data-depth={depth}>
      <div className="intro-parallax" data-parallax={parallax}>
        {children}
      </div>
    </div>
  )
}

interface CrowdLayerProps {
  depth: string
  parallax: number
  src: string
  className?: string
  hotspots?: [number, number, number, number][]
  children?: ReactNode
}

// satu layer artwork kerumunan; hotspots memberi reaksi hover per orang
export function CrowdLayer({ depth, parallax, src, className, hotspots, children }: CrowdLayerProps) {
  return (
    <Depth depth={depth} parallax={parallax}>
      <img className={`intro-art ${className ?? ''}`} src={src} alt="" draggable={false} />
      {children}
      {hotspots?.map(([x, y, w, h]) => (
        <span
          key={`${x}-${y}`}
          className="intro-hotspot"
          aria-hidden="true"
          style={{
            left: pct(x, CANVAS.w),
            top: pct(y, CANVAS.h),
            width: pct(w, CANVAS.w),
            height: pct(h, CANVAS.h),
          }}
        />
      ))}
    </Depth>
  )
}
