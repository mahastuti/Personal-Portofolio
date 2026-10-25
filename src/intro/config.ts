// semua angka intro di satu tempat: ganti aset atau posisi figur cukup di sini

// rasio kanvas artwork (semua layer harus berukuran sama: 1672 x 941)
export const ARTWORK_RATIO = 1672 / 941

const base = `${import.meta.env.BASE_URL}images/intro/`

export const INTRO_ASSETS = {
  background: `${base}crowd-background.webp`,
  midground: `${base}crowd-midground.webp`,
  foreground: `${base}crowd-foreground.webp`,
  target: `${base}target-figure.webp`,
  portal: `${base}transition-portal.webp`,
}

// kotak figur target dalam pecahan kanvas (0–1), hasil crop dari artwork
export const TARGET_BOX = { x: 0.3248, y: 0.3911, w: 0.0712, h: 0.4538 }

// titik fokus kamera: tengah badan figur, sedikit di atas pusat kotak
export const FOCUS = {
  x: TARGET_BOX.x + TARGET_BOX.w / 2,
  y: TARGET_BOX.y + TARGET_BOX.h * 0.42,
}

// pusat lubang di gambar portal (pecahan gambar portal)
export const PORTAL_HOLE = { x: 0.49, y: 0.44 }

// panjang pin scroll, dalam kelipatan tinggi layar
export const PIN_LENGTH = 2.6

// kalau belum ketemu figurnya, kasih hint setelah sekian ms
export const HINT_DELAY = 6000
