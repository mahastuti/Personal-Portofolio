import { useMemo } from 'react'

// prng kecil supaya angkanya sama di setiap kunjungan
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// lembar angka seperti isi dataset: desimal, nilai negatif, bilangan bulat
function buildSheet(rows: number, cols: number) {
  const rand = mulberry32(1672)
  const cell = () => {
    const r = rand()
    if (r < 0.5) return ((rand() * 4 - 2) * (rand() < 0.3 ? 10 : 1)).toFixed(4)
    if (r < 0.75) return (rand() * 100).toFixed(2)
    if (r < 0.92) return String(Math.floor(rand() * 98000) + 1000)
    return rand().toFixed(6)
  }
  const lines: string[] = []
  for (let i = 0; i < rows; i++) {
    let line = ''
    while (line.length < cols) line += cell().padStart(10, ' ')
    lines.push(line)
  }
  return lines.join('\n')
}

export function HiddenArtwork() {
  const sheet = useMemo(() => buildSheet(64, 250), [])
  return (
    <pre className="intro-numbers" aria-hidden="true">
      {sheet}
    </pre>
  )
}
