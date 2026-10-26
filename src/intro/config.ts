// semua angka intro di satu tempat: ganti aset atau posisi cukup di sini

// ukuran kanvas artwork; semua layer harus berukuran (atau berasio) sama
export const CANVAS = { w: 1672, h: 941 }
export const ARTWORK_RATIO = CANVAS.w / CANVAS.h

// kanvas dibuat sedikit lebih besar dari layar supaya parallax tidak memperlihatkan tepi
export const STAGE_BLEED = 1.05

const base = `${import.meta.env.BASE_URL}images/intro/`

export const INTRO_ASSETS = {
  background: `${base}crowd-background.webp`,
  midground: `${base}crowd-midground.webp`,
  foreground: `${base}crowd-foreground.webp`,
  character: `${base}target-figure.webp`,
  glowHalo: `${base}glow-halo.webp`,
  glowBloom: `${base}glow-bloom.webp`,
  portal: `${base}transition-portal.webp`,
}

// posisi tokoh utama (px di kanvas 1672 x 941)
export const CHARACTER_BOX = { x: 543, y: 368, w: 119, h: 427 }

// titik fokus kamera: tengah badan tokoh utama, dalam pecahan kanvas
export const FOCUS = {
  x: (CHARACTER_BOX.x + CHARACTER_BOX.w / 2) / CANVAS.w,
  y: (CHARACTER_BOX.y + CHARACTER_BOX.h * 0.42) / CANVAS.h,
}

// area hover tiap orang di midground (px di kanvas); ganti dengan cutout per figur kalau sudah ada
export const CROWD_HOTSPOTS: [number, number, number, number][] = [
  [350, 345, 115, 260],
  [295, 285, 75, 250],
  [700, 335, 65, 185],
  [755, 330, 70, 185],
  [930, 365, 115, 300],
  [1078, 355, 100, 290],
  [1172, 335, 92, 260],
  [1318, 298, 82, 185],
  [1392, 275, 75, 200],
  [1452, 262, 62, 130],
  [1548, 288, 78, 190],
  [1080, 268, 50, 110],
  [835, 268, 45, 115],
  [458, 272, 48, 120],
  [505, 290, 45, 110],
  [602, 265, 80, 110],
  [205, 252, 48, 115],
  [262, 258, 40, 105],
  [155, 275, 45, 100],
]

// jarak parallax maksimal (px) per kedalaman
export const PARALLAX = { bg: 3.5, haze: 6, mid: 9, character: 11, fg: 20 }

// radius reveal angka (px di layar)
export const REVEAL_RADIUS = 180

// pusat lubang di gambar portal (pecahan gambar portal)
export const PORTAL_HOLE = { x: 0.49, y: 0.44 }

// panjang pin scroll, dalam kelipatan tinggi layar
export const PIN_LENGTH = 2.4
