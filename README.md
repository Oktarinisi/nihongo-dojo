# Nihongo Dojo

Website belajar bahasa Jepang sampai N5: kartu hafalan, kuis, penjelasan materi, suara, dan jadwal 24 minggu. Tanpa build dan tanpa dependensi, cukup file statis. Progres belajar tersimpan di browser (localStorage). Bisa dipakai offline dan dipasang ke layar HP (PWA).

## Struktur
- `index.html` : halaman utama
- `css/style.css` : tampilan (mendukung tema terang dan gelap)
- `js/app.js` : data materi dan logika (edit di sini untuk menambah kosakata)
- `sw.js` + `manifest.webmanifest` : mode offline dan instalasi
- `icons/` : ikon aplikasi

## Jalankan lokal
    python3 -m http.server 8000
lalu buka http://localhost:8000

## Deploy gratis (pilih salah satu)
**Netlify (paling cepat):** buka app.netlify.com/drop, lalu seret folder ini ke halaman itu. Langsung dapat link.

**GitHub Pages:** buat repository baru, unggah semua file, lalu buka Settings > Pages > Deploy from a branch > `main` / root. Link: `https://username.github.io/nama-repo/`.

**Cloudflare Pages / Vercel:** hubungkan repository, biarkan Build command kosong dan Output directory `/` (root).

## Catatan
- Saat mengubah file, naikkan `V` di `sw.js` (misalnya `nihongo-dojo-v2`) supaya pengunjung mendapat versi terbaru.
- Suara Jepang memakai voice bawaan browser. Pastikan perangkat punya voice Japanese.
