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
Buka salah satu halaman produk, misalnya http://localhost:3000/produk/1
.
Klik tombol "Pesan via WhatsApp".
Periksa bahwa tab baru terbuka mengarah ke URL https://wa.me/6281266971280?text=... dengan pesan otomatis yang sudah terisi nama dan harga produk (misal: "Halo, saya ingin memesan Kopi Bubuk Robusta 250 g seharga Rp 45.000.").

**Perbaikan:**

## US-04 Login admin

**Prompt:**
Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.

**Hasil:**
Uji login gagal (kredensial salah):
Buka http://localhost:3000/admin/login
.
Masukkan email sembarang (misal: salah@toko.com) dan password apa pun.
Klik "Masuk".
Pastikan muncul pesan error yang jelas di halaman login (misal: "Email atau password salah.").
Uji login berhasil:
Masukkan email dan password akun admin Supabase yang telah dibuat.
Klik "Masuk".
Halaman akan otomatis diarahkan ke http://localhost:3000/admin
.
Uji tombol keluar:
Di halaman admin, klik tombol "Keluar" pada navigasi atas.
Sesi akan diakhiri dan halaman kembali ke http://localhost:3000/admin/login
.

**Perbaikan:**

## US-05 Ganti password

**Prompt:**
Baca docs/user-stories.md bagian US-05.

Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
Pastikan sudah login sebagai admin (bisa lewat http://localhost:3000/admin/login
).
Buka halaman ganti password di http://localhost:3000/admin/password
.
Uji validasi error (password tidak sama):
Masukkan password baru minimal 8 karakter (misal: passwordBaru123).
Masukkan konfirmasi yang berbeda (misal: passwordBeda123).
Klik "Simpan password".
Pastikan muncul pesan error: "Password baru dan konfirmasi password tidak sama.".
Uji validasi error (kurang dari 8 karakter):
Masukkan password baru kurang dari 8 karakter (misal: abc dan abc).
Pastikan muncul pesan error validasi minimal 8 karakter.
Uji ganti password berhasil:
Masukkan password baru yang valid (minimal 8 karakter) dan sama dengan konfirmasinya.
Klik "Simpan password".
Pastikan muncul notifikasi hijau: "Password berhasil diganti.".

**Perbaikan:**

## US-06 Proteksi halaman admin

**Prompt:**
Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06.

Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.

**Hasil:**
Uji proteksi halaman tanpa login:
Buka browser dalam mode Incognito/Private (atau pastikan sudah keluar/logout).
Buka langsung URL http://localhost:3000/admin
 atau http://localhost:3000/admin/password
.
Pastikan halaman otomatis dialihkan (redirect) ke http://localhost:3000/admin/login
.
Uji akses setelah login:
Masuk melalui http://localhost:3000/admin/login
 dengan akun admin Supabase.
Setelah berhasil login dan diarahkan ke http://localhost:3000/admin
, pastikan halaman admin dapat diakses dan banner catatan belum aktif sudah tidak ada.
Coba akses kembali http://localhost:3000/admin/login
, pastikan otomatis diarahkan kembali ke http://localhost:3000/admin
 karena sudah login.

**Perbaikan:**

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.
