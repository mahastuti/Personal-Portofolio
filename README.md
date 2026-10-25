# Personal Portofolio

Web portofolio Nalin. Dibuka dengan opening interaktif "From the Crowd to the Self": pengunjung mencari dan mengklik satu figur di kerumunan, lalu scroll membawa kamera masuk ke figur itu sampai homepage terbuka.

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
│   ├── target-figure.webp      figur yang bisa diklik (crop, transparan)
│   └── transition-portal.webp  haze dengan lubang di tengah, untuk transisi
└── home/
    └── nalin-character.webp    karakter di homepage

src/
├── content.ts                  semua teks website
├── App.tsx                     intro + homepage + section
├── intro/
│   ├── config.ts               path aset, posisi figur, panjang scroll
│   ├── IntroExperience.tsx     state pilih figur, kamera, timeline scroll
│   └── useImagesReady.ts       tunggu semua layer selesai dimuat
└── home/
    ├── SiteNav.tsx
    ├── PortfolioHero.tsx
    └── Sections.tsx            work, about, contact
```

## Cara kerja intro

1. **Idle**: scroll dikunci. Hover/fokus ke figur memunculkan glow dan label "ENTER MY WORLD". Kalau belum ketemu dalam 6 detik, atau pengunjung mengklik tempat lain, figurnya berkedip pelan sebagai petunjuk.
2. **Klik**: animasi 0,8 detik. Kamera membawa figur ke tengah, layer lain blur, lalu scroll dibuka.
3. **Scroll**: section intro di-pin selama 2,6 kali tinggi layar. Satu timeline GSAP di-scrub oleh progress scroll: tiap layer membesar dengan kecepatan berbeda (parallax), warna bergeser ke biru, figur melebur, dan portal haze membuka ke homepage.
4. **Selesai**: homepage jadi section biasa. Scroll balik akan memutar animasi mundur, tapi figur tidak perlu dipilih ulang.

Tombol "Skip intro" langsung ke homepage. Pengguna dengan setting reduced motion langsung melihat homepage tanpa intro.

## Mengganti aset

- Semua layer intro harus berukuran sama (sekarang 1672 × 941) supaya tumpukannya pas.
- Kalau figur target atau posisinya diganti, update `TARGET_BOX` di `src/intro/config.ts`. Nilainya pecahan 0–1 dari lebar/tinggi kanvas (x, y = pojok kiri atas; w, h = ukuran).
- Teks diubah di `src/content.ts`. Link kontak yang masih kosong tidak ditampilkan.
