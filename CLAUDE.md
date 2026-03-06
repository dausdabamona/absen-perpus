# Perpus Absen

Aplikasi absensi pengunjung perpustakaan Politeknik KP Sorong.

## Stack
- React 19 + Vite 7
- Dexie.js 4 (IndexedDB offline storage)
- html5-qrcode (scanner kamera)
- SheetJS (export Excel)
- Tailwind CSS
- vite-plugin-pwa

## Target
- Device: Android low-end (RAM 2-3GB)
- Koneksi: Offline-first — semua data tersimpan lokal di IndexedDB
- User: Petugas perpustakaan — UI harus sangat intuitif

## Konvensi
- Bahasa UI: Indonesia
- Penamaan: kebab-case file, PascalCase komponen, camelCase fungsi
- Error handling: selalu handle loading/error/empty state
- Toast: selalu beri feedback setelah aksi

## Alur Utama
1. Petugas buka ScanPage → aktifkan kamera
2. Pengunjung tunjukkan KTM → scan barcode → NIT terbaca
3. Sistem cari NIT di Dexie → tampilkan konfirmasi
4. Petugas konfirmasi → data kunjungan tersimpan lokal
5. Saat keluar → scan lagi → otomatis mode keluar

## Catatan Penting
- QR/Barcode KTM berisi NIT saja (string angka/alfanumerik)
- Satu NIT bisa scan masuk dan keluar dalam satu hari
- Export Excel untuk pelaporan bulanan ke pimpinan
- Tidak ada backend — semua IndexedDB
