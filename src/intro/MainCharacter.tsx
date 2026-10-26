import { CANVAS, CHARACTER_BOX } from './config'

const pct = (v: number, total: number) => `${((v / total) * 100).toFixed(3)}%`

// tokoh utama dari artwork asli (cutout), tidak digambar ulang
export function MainCharacter({ src }: { src: string }) {
  return (
    <div
      className="intro-character"
      style={{
        left: pct(CHARACTER_BOX.x, CANVAS.w),
        top: pct(CHARACTER_BOX.y, CANVAS.h),
        width: pct(CHARACTER_BOX.w, CANVAS.w),
        height: pct(CHARACTER_BOX.h, CANVAS.h),
      }}
    >
      <span className="intro-character__halo" aria-hidden="true" />
      <img src={src} alt="" draggable={false} />
    </div>
  )
}
