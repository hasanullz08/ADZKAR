# ADZKAR — Daily Islamic Companion

Aplikasi pendamping ibadah harian berdesain futuristik modern (*cyber-aesthetic*) dengan fitur lengkap:
- 📖 **Al-Qur'an 30 Juz Offline**: Menggunakan 604 halaman Mushaf Madinah standar resolusi tinggi.
- 📜 **Hadits Arba'in An-Nawawiyyah**: 42 Hadits lengkap teks Arab, terjemahan Indonesia, takhrij, dan faedah.
- 📿 **Dzikir Harian**: Dzikir Pagi, Dzikir Petang, Dzikir Ba'da Shalat, dan Dzikir Sebelum Tidur.
- ⏱️ **Jadwal Shalat & Countdown**: Waktu shalat akurat berdasarkan koordinat kota-kota di Indonesia beserta notifikasi dan nada adzan.
- 🔢 **Tasbih Digital Cyber**: Penghitung dzikir interaktif dengan respon audio haptik.
- 📊 **Worship Tracker**: Pencatat rutinitas shalat wajib 5 waktu, shalat sunnah, dan rekor streak ibadah.

---

## 🚀 1. Cara Menjalankan di Komputer (Lokal)

Pastikan sudah menginstal **Node.js** (versi 18 ke atas).

1. Buka terminal di folder project ini:
   ```bash
   npm install
   ```
2. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```
3. Buka browser di alamat yang tampil (biasanya `http://localhost:3000` atau `http://localhost:5173`).

Untuk melakukan kompilasi build produksi:
```bash
npm run build
npm run preview
```

---

## 🌐 2. Cara Mempublikasikan (Publish agar Semua Orang Bisa Pakai)

Aplikasi ini adalah Web App / PWA modern yang dapat di-hosting secara **gratis** di berbagai platform:

### Opsi A: Deploy ke Vercel (Paling Direkomendasikan - 2 Menit)
1. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub.
2. Upload kode ini ke repository GitHub Anda (atau gunakan Vercel CLI: `npx vercel`).
3. Import repository di Vercel:
   - Framework preset otomatis terdeteksi: **Vite**
   - Output directory: `dist`
4. Klik **Deploy**. Dalam 1 menit aplikasi Anda aktif dan memiliki link HTTPS seperti `https://adzkar-app.vercel.app` yang dapat dibuka oleh siapa saja di seluruh dunia!

### Opsi B: Deploy ke Netlify
1. Buka [netlify.com](https://www.netlify.com).
2. Tarik folder `dist` hasil `npm run build` ke dashboard Netlify Drop, atau sambungkan dengan repository GitHub Anda.
3. Aplikasi langsung online dengan domain Netlify.

---

## 📱 3. Cara Menjadikan APK untuk HP Android

Ada 3 cara mudah untuk menjalankan aplikasi ini di HP Android:

### Cara 1: Pasang Sebagai PWA (Tanpa Butuh File APK & Tanpa Play Store)
Aplikasi ini sudah dilengkapi teknologi **Progressive Web App (PWA)**:
1. Buka link web aplikasi Anda (misal `https://adzkar-app.vercel.app`) di browser HP (Google Chrome / Samsung Internet).
2. Akan muncul banner otomatis **"Tambahkan ke Layar Utama"** atau klik menu titik tiga (⋮) di Chrome -> pilih **"Instal aplikasi"** / **"Add to Home screen"**.
3. Aplikasi akan langsung terpasang di HP dengan ikon tersendiri, layar penuh (*fullscreen* tanpa bilah alamat browser), dan dapat dibuka secara offline layaknya aplikasi native dari Play Store!

### Cara 2: Generate APK via PWABuilder (1 Menit, Tanpa Coding)
1. Publikasikan web ke Vercel / Netlify hingga Anda memiliki URL HTTPS yang aktif.
2. Buka situs resmi buatan Microsoft/Google: [PWABuilder.com](https://www.pwabuilder.com).
3. Masukkan link website Anda -> Klik **Start**.
4. Klik tombol **Package for Android**.
5. PWABuilder akan otomatis meng-generate file `.apk` (untuk langsung di-install di HP) dan `.aab` (jika ingin di-upload ke Google Play Store).
6. Download file `.apk`, kirim ke HP Anda, dan instal langsung!

### Cara 3: Auto-Build APK via GitHub Actions (Otomatis di Cloud)
Project ini sudah dilengkapi file workflow otomatis di `.github/workflows/build-apk.yml`.
1. Buat repository baru di GitHub dan lakukan `git push` kode ini ke GitHub.
2. Masuk ke tab **Actions** di halaman repository GitHub Anda.
3. GitHub akan otomatis menjalankan proses kompilasi Android APK menggunakan server cloud Ubuntu.
4. Setelah selesai, buka hasil run workflow tersebut dan unduh file **`adzkar-companion-app`** (berisi file `app-debug.apk`) yang siap di-install di HP Android.

---

## 🛠️ Struktur Project

```text
adzkar-dengan-quran/
├── .github/workflows/       # Workflow CI/CD otomatis pembuatan APK
│   └── build-apk.yml
├── public/
│   ├── assets/              # Aset gambar & PDF Hadits Arbain
│   ├── icons/               # Ikon aplikasi PWA & Android
│   ├── quran/pages/         # 604 halaman mushaf Madinah WebP lengkap
│   ├── favicon.svg          # Favicon vektor aplikasi
│   ├── manifest.webmanifest # PWA App Manifest
│   └── sw.js                # Service Worker untuk cache & offline mode
├── src/
│   ├── components/          # Komponen UI (QuranReader, Adzkar, Tasbih, Tracker, dll.)
│   ├── data/                # Data teks dzikir, 42 hadits arbain, & navigasi surah
│   ├── utils/               # Perhitungan waktu shalat, audio synthesizer, storage lokal
│   ├── App.tsx              # Root container aplikasi
│   ├── main.tsx             # Entry point React
│   └── index.css            # Desain TailwindCSS & styling Cyber HUD
├── capacitor.config.json    # Konfigurasi Capacitor untuk Android
├── package.json             # Dependency & scripts
├── tsconfig.json            # Konfigurasi TypeScript
├── vercel.json              # Konfigurasi deployment Vercel
└── vite.config.ts           # Konfigurasi bundler Vite
```
