# Personal Portofolio

Web portofolio Nalin. Dibuka dengan intro interaktif berupa artwork kerumunan yang terus "bernapas": asap pastel bergerak, orang-orangnya bercahaya, layer bergeser mengikuti mouse, dan di balik gambar ada lembar angka yang hanya terlihat di sekitar cursor. Scroll membawa kamera masuk ke tokoh utama sampai halaman About Me terbuka.

Stack: React + TypeScript + Vite, GSAP + ScrollTrigger (`@gsap/react`), CSS biasa (Tailwind tersedia).

## Jalankan lokal

```bash
npm install
npm run dev
```

Build produksi: `npm run build`, hasilnya di folder `dist/`.

## Struktur

```
public/images/
├── intro/
│   ├── crowd-background.webp   layer paling belakang (opaque)
│   ├── crowd-midground.webp    kerumunan tengah (transparan)
│   ├── crowd-foreground.webp   figur besar di depan (transparan)
│   ├── target-figure.webp      tokoh utama (cutout dari artwork, transparan)
│   ├── glow-halo.webp          cahaya di belakang orang-orang (sudah di-blur)
│   ├── glow-bloom.webp         cahaya tipis di atas orang-orang (sudah di-blur)
│   └── transition-portal.webp  haze berlubang untuk transisi ke About Me
└── home/
    └── nalin-character.webp    karakter di About Me

src/
├── content.ts                    semua teks website
├── App.tsx
├── hooks/
│   ├── useMouseParallax.ts       parallax pointer per kedalaman (gsap.quickTo)
│   ├── useCursorReveal.ts        mask radial mengikuti cursor / tahan di layar sentuh
│   ├── useScrollTransition.ts    pin + timeline kamera, skip intro
│   └── usePrefersReducedMotion.ts
├── intro/
│   ├── config.ts                 path aset, posisi tokoh, hotspot, kekuatan parallax
│   ├── IntroScene.tsx            menyusun semua layer
│   ├── AtmosphericBackground.tsx asap pastel yang bergerak terus
│   ├── CrowdLayer.tsx            layer kerumunan + area hover per orang
│   ├── MainCharacter.tsx
│   ├── HiddenArtwork.tsx         lembar angka di balik artwork
│   ├── CursorReveal.tsx          kabut + mask untuk HiddenArtwork
│   ├── IntroNavigation.tsx       logo, skip intro, label, petunjuk scroll
│   └── useImagesReady.ts
└── home/
    ├── SiteNav.tsx
    ├── PortfolioHero.tsx         About Me (tujuan transisi)
    └── Sections.tsx              background, work, contact
```

## Cara kerja intro

- **Ambient**: blob gradien radial (tanpa filter blur) digerakkan GSAP terus-menerus; cahaya orang-orang naik-turun pelan.
- **Parallax**: background ±3,5px, kerumunan ±9px, tokoh utama ±11px, foreground ±20px. Kembali pelan ke posisi awal saat pointer keluar.
- **Reveal angka**: lembar angka ada di antara background dan kerumunan, ditutup kabut. Mask radial 180px mengikuti cursor (koordinat dihitung ulang tiap frame, jadi tetap pas setelah resize atau scroll). Di layar sentuh: tahan sebentar, lalu geser.
- **Hover**: tiap orang punya area hover yang memberi cahaya lembut; tokoh utama sedikit terangkat dan lebih terang.
- **Scroll**: intro di-pin selama 2,4 kali tinggi layar. Kamera mendorong ke tokoh utama, foreground bergerak paling cepat, background memudar, kabut menebal, lalu portal haze membuka ke About Me.
- **Reduced motion**: tanpa animasi, parallax, dan pin; intro jadi gambar statis dan About Me langsung di bawahnya. Reveal angka tetap bisa dipakai.

## Mengganti aset

- Semua layer intro harus berukuran sama (sekarang 1672 × 941) supaya tumpukannya pas.
- Kalau tokoh utama atau posisinya diganti, update `CHARACTER_BOX` di `src/intro/config.ts` (px di kanvas 1672 × 941).
- Area hover tiap orang ada di `CROWD_HOTSPOTS`. Kalau nanti punya cutout per orang, hotspot bisa diganti gambar terpisah supaya orangnya ikut bergeser saat hover.
- `glow-halo` dan `glow-bloom` dibuat dari midground. Kalau midground diganti, buat ulang keduanya (blur besar + saturasi dinaikkan).
- Teks diubah di `src/content.ts`. Link kontak yang masih kosong tidak ditampilkan.
