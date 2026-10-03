# FinanceHub

<div align="center">
  <img src="https://img.shields.io/badge/Status-Live-brightgreen?style=flat-square" alt="Status">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square" alt="Version">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License">
</div>

<div align="center">
  <h3>Kalkulator Keuangan, Matematika, dan Pelacak Tabungan</h3>
  <p>Aplikasi web all-in-one untuk mengelola keuangan pribadi. Tanpa server, tanpa akun — semua data tersimpan lokal di browser.</p>
</div>

---

## Fitur Utama

- **Kalkulator Ilmiah** - trigonometri, logaritma, dan konstanta (π, e) dengan riwayat perhitungan
- **Math Solver** - selesaikan ekspresi matematika kompleks langkah demi langkah
- **Pelacak Tabungan** - tujuan ganda, setoran harian, progress bar, dan kalender analitik bulanan
- **Keuangan Harian** - catat pemasukan & pengeluaran, filter kategori, pencarian, foto bukti transaksi, analitik bulanan + zoom chart
- **Konverter** - suhu, gaya, panjang, berat, trigonometri, dan luas dengan rumus tertera
- **Dark / Light Mode** - toggle tema dengan persistensi localStorage
- **Export CSV** - export riwayat setoran dan transaksi ke CSV
- **Privasi Penuh** - data tidak pernah dikirim ke server, semua tersimpan di localStorage
- **Responsive** - mobile-first, optimal di semua ukuran layar

---

## Teknologi yang Digunakan

| Teknologi | Kegunaan |
|-----------|----------|
| HTML5 | Struktur semantik |
| CSS3 | Styling dengan CSS Variables, Grid, Flexbox |
| JavaScript (Vanilla) | Semua logika aplikasi, tanpa framework |
| Custom SVG Chart | Grafik analitik harian dan bulanan (tanpa library) |
| Google Fonts (Inter) | Typography modern |
| Font Awesome 6.4 | Icon library |
| localStorage | Penyimpanan tema, tabungan, dan transaksi |

---

## Struktur Proyek

```
financehub/
├── index.html      # Semua section: kalkulator, math solver, tabungan, keuangan, konverter
├── style.css       # Styling, tema, dark mode, animasi
├── script.js       # Semua logika aplikasi
└── README.md       # Dokumentasi
```

---

## Cara Menjalankan

### Local Development

1. Clone repository ini:

   ```bash
   git clone https://github.com/DanielAliRassya/financehub.git
   cd financehub
   ```

2. Buka dengan Live Server atau:

   ```bash
   python3 -m http.server 8080
   ```

3. Buka [http://localhost:8080](http://localhost:8080) di browser.

> Tidak butuh `npm install` atau build step — aplikasi ini vanilla HTML/CSS/JS, langsung jalan di browser.

### Deploy ke Vercel / Netlify

- Push ke GitHub
- Import repository di dashboard Vercel atau Netlify
- Tidak perlu konfigurasi, auto-detect sebagai static site
- Done!

---

## Penyimpanan Data

Semua data disimpan di `localStorage` browser, per-key terpisah:

| localStorage Key | Isi |
|------------------|-----|
| `financehub_theme` | Tema terpilih (`light` / `dark`) |
| `financehub_savings_v2` | Tujuan tabungan, setoran, dan riwayat |
| `financehub_keuangan_v1` | Transaksi pemasukan & pengeluaran |

Data tidak pernah dikirim ke server. Untuk reset, gunakan tombol **Reset Semua** di section Keuangan atau hapus site data di browser.

---

## Tema Warna

| Token | Warna | Hex |
|-------|-------|-----|
| Primary | Sky Blue | `#0ea5e9` |
| Secondary | Indigo | `#6366f1` |
| Success | Emerald Green | `#10b981` |
| Warning | Amber | `#f59e0b` |
| Danger | Red | `#ef4444` |
| Accent | Pink | `#ec4899` |
| Teal | Teal | `#14b8a6` |

---

## Lisensi

Proyek ini menggunakan lisensi **MIT**. Bebas digunakan dan dimodifikasi dengan menyertakan credit yang sesuai.

---

<div align="center">
  <p>Dibuat dengan ❤️ oleh <strong>Daniel Ali Rassya</strong></p>
</div>
