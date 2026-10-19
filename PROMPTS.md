# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:*
Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.*

**Hasil:**
Jalankan server lokal:
powershell
npm run dev
Buka browser di http://localhost:3000
.
Pastikan daftar produk berhasil muncul dari database Supabase (6 produk awal: Kopi, Keripik, Sambal, Nastar, Tas, dan Batik) lengkap dengan foto, kategori, nama, dan harga dalam format rupiah.
Pastikan komponen peringatan CatatanBelumAktif sudah tidak ada di halaman depan.
Untuk menguji kondisi error, kamu bisa sementara mengubah salah satu huruf pada SUPABASE_SECRET_KEY di .env.local lalu refresh halaman (akan muncul pesan error yang jelas di halaman).

**Perbaikan:**

## US-02 Detail produk

**Prompt:**
Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.

**Hasil:**
Jalankan server lokal:
powershell
npm run dev
Uji produk yang ada:
Buka halaman katalog di http://localhost:3000
 lalu klik salah satu kartu produk (misalnya produk ID 1 ke http://localhost:3000/produk/1
).
Pastikan detail foto, kategori, nama, harga (format Rupiah), deskripsi, dan tombol WhatsApp muncul dari database Supabase, serta tidak ada lagi kotak catatan belum aktif.
Uji produk yang tidak ada (404):
Buka URL produk dengan ID yang tidak ada di database, misalnya http://localhost:3000/produk/9999
 atau http://localhost:3000/produk/abc
.
Pastikan halaman menampilkan tampilan 404 ("Halaman tidak ditemukan").

**Perbaikan:**

## US-03 Pesan via WhatsApp

**Prompt:**
Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

**Hasil:**

**Perbaikan:**

## US-04 Login admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-05 Ganti password

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-06 Proteksi halaman admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.
