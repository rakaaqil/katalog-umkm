"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSessionClient } from "@/lib/supabase/server";

// ─── Helper: wajib cek autentikasi admin di server ───────────────────────────
async function requireAdmin() {
  const supabase = await createSessionClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/admin/login");
  }

  return { supabase, user };
}

// ─── Login ───────────────────────────────────────────────────────────────────
export async function login(prevState, formData) {
  const form =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
        ? prevState
        : null;

  if (!form) return { error: "Data formulir tidak valid." };

  const email = form.get("email")?.toString().trim();
  const password = form.get("password")?.toString();

  if (!email || !password) return { error: "Email dan password wajib diisi." };

  try {
    const supabase = await createSessionClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message === "Invalid login credentials") {
        return { error: "Email atau password salah." };
      }
      return { error: error.message || "Gagal masuk." };
    }
  } catch (err) {
    return { error: `Terjadi kesalahan: ${err.message}` };
  }

  redirect("/admin");
}

// ─── Logout ──────────────────────────────────────────────────────────────────
export async function logout() {
  try {
    const supabase = await createSessionClient();
    await supabase.auth.signOut();
  } catch {}
  redirect("/admin/login");
}

// ─── Ganti Password (US-05) ──────────────────────────────────────────────────
export async function gantiPassword(prevState, formData) {
  const { supabase } = await requireAdmin();

  const form =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
        ? prevState
        : null;

  if (!form) return { error: "Data formulir tidak valid." };

  const passwordBaru = form.get("password_baru")?.toString();
  const konfirmasiPassword = form.get("konfirmasi_password")?.toString();

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password wajib diisi." };
  }
  if (passwordBaru.length < 8) return { error: "Password baru minimal 8 karakter." };
  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password tidak sama." };
  }

  try {
    const { error } = await supabase.auth.updateUser({ password: passwordBaru });
    if (error) return { error: error.message || "Gagal mengganti password." };
    return { success: "Password berhasil diganti." };
  } catch (err) {
    return { error: `Terjadi kesalahan: ${err.message}` };
  }
}

// ─── Tambah Produk (US-08) ───────────────────────────────────────────────────
export async function tambahProduk(prevState, formData) {
  const { supabase } = await requireAdmin();

  const form =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
        ? prevState
        : null;

  if (!form) return { error: "Data formulir tidak valid." };

  const nama = form.get("nama")?.toString().trim();
  const harga = Number(form.get("harga"));
  const kategori = form.get("kategori")?.toString().trim() || null;
  const foto_url = form.get("foto_url")?.toString().trim() || null;
  const deskripsi = form.get("deskripsi")?.toString().trim() || null;

  if (!nama) return { error: "Nama produk wajib diisi." };
  if (isNaN(harga) || harga < 0) return { error: "Harga harus berupa angka yang valid." };

  try {
    const { error } = await supabase
      .from("produk")
      .insert([{ nama, harga, kategori, foto_url, deskripsi }]);
    if (error) return { error: `Gagal menyimpan produk: ${error.message}` };
  } catch (err) {
    return { error: `Terjadi kesalahan: ${err.message}` };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

// ─── Ubah Produk (US-09) ─────────────────────────────────────────────────────
export async function ubahProduk(prevState, formData) {
  const { supabase } = await requireAdmin();

  const form =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
        ? prevState
        : null;

  if (!form) return { error: "Data formulir tidak valid." };

  const id = form.get("id")?.toString();
  const nama = form.get("nama")?.toString().trim();
  const harga = Number(form.get("harga"));
  const kategori = form.get("kategori")?.toString().trim() || null;
  const foto_url = form.get("foto_url")?.toString().trim() || null;
  const deskripsi = form.get("deskripsi")?.toString().trim() || null;

  if (!id) return { error: "ID produk tidak ditemukan." };
  if (!nama) return { error: "Nama produk wajib diisi." };
  if (isNaN(harga) || harga < 0) return { error: "Harga harus berupa angka yang valid." };

  try {
    const { error } = await supabase
      .from("produk")
      .update({ nama, harga, kategori, foto_url, deskripsi })
      .eq("id", id);
    if (error) return { error: `Gagal menyimpan perubahan: ${error.message}` };
  } catch (err) {
    return { error: `Terjadi kesalahan: ${err.message}` };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/produk/${id}`);
  redirect("/admin");
}

// ─── Hapus Produk (US-10) ────────────────────────────────────────────────────
export async function hapusProduk(prevState, formData) {
  const { supabase } = await requireAdmin();

  const form =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
        ? prevState
        : null;

  if (!form) return { error: "Data formulir tidak valid." };

  const id = form.get("id")?.toString();
  if (!id) return { error: "ID produk tidak ditemukan." };

  try {
    const { error } = await supabase.from("produk").delete().eq("id", id);
    if (error) return { error: `Gagal menghapus produk: ${error.message}` };
  } catch (err) {
    return { error: `Terjadi kesalahan: ${err.message}` };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

// ─── Generator Deskripsi Cerdas (Fallback Otomatis) ──────────────────────────
function buatDeskripsiOtomatis(nama, kategori) {
  const kat = (kategori || "").toLowerCase();
  const n = (nama || "").toLowerCase();

  if (kat.includes("minuman") || n.includes("kopi") || n.includes("teh") || n.includes("jus")) {
    return `${nama} dibuat dari bahan berkualitas pilihan dengan racikan yang pas dan aroma yang memikat. Memberikan sensasi rasa segar dan nikmat, sangat cocok dinikmati kapan saja.`;
  }
  if (kat.includes("camilan") || kat.includes("bumbu") || n.includes("keripik") || n.includes("sambal")) {
    return `${nama} diolah secara higienis menggunakan bahan-bahan alami untuk menghasilkan rasa yang lezat, gurih, dan khas. Pilihan sempurna untuk menemani waktu santai atau sebagai hidangan pelengkap.`;
  }
  if (kat.includes("kue") || n.includes("nastar") || n.includes("roti") || n.includes("bolu")) {
    return `${nama} memiliki tekstur yang lembut dengan kelezatan rasa manis yang pas di setiap gigitan. Dipanggang secara segar dan higienis, cocok untuk santapan keluarga maupun hantaran istimewa.`;
  }
  if (kat.includes("kain") || kat.includes("batik") || n.includes("katun") || n.includes("tenun")) {
    return `${nama} terbuat dari material pilihan yang halus, adem, dan nyaman dipakai sehari-hari. Desain motifnya yang anggun dan rapi sangat cocok untuk berbagai acara formal maupun kasual.`;
  }
  if (kat.includes("kerajinan") || n.includes("tas") || n.includes("anyaman") || n.includes("dompet")) {
    return `${nama} merupakan produk kerajinan tangan bermutu tinggi yang dibuat dengan ketelitian dan detail yang kuat. Menghadirkan tampilan yang unik, fungsional, dan bernilai seni tinggi.`;
  }

  return `${nama} merupakan produk unggulan dari kategori ${kategori || "produk pilihan"} kami, diproduksi dengan standar mutu terbaik untuk menjamin kepuasan Anda.`;
}

// ─── Generate Deskripsi AI (US-14) ───────────────────────────────────────────
export async function generateDeskripsi(prevState, formData) {
  await requireAdmin();

  const form =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
        ? prevState
        : null;

  if (!form) return { error: "Data formulir tidak valid." };

  const nama = form.get("nama")?.toString().trim();
  const kategori = form.get("kategori")?.toString().trim();

  if (!nama) return { error: "Nama produk wajib diisi sebelum membuat deskripsi." };

  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // 1. Jika API key tersedia, prioritaskan pemanggilan Google Gemini API
  if (apiKey) {
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Buat deskripsi produk singkat (2-3 kalimat) dalam bahasa Indonesia yang menarik dan ramah untuk produk UMKM berikut:
Nama: ${nama}
Kategori: ${kategori || "Umum"}

Deskripsi harus memikat pembeli, alami, dan informatif. Langsung tulis teks deskripsinya tanpa kata pengantar atau tanda kutip.`;

      const result = await model.generateContent(prompt);
      const deskripsi = result.response.text().trim();

      if (deskripsi) {
        return { success: true, deskripsi };
      }
    } catch (err) {
      console.warn("Gemini API call failed, using smart generator:", err.message);
    }
  }

  // 2. Generator cerdas otomatis (bekerja langsung tanpa harus menunggu API key)
  const deskripsiCerdas = buatDeskripsiOtomatis(nama, kategori);
  return { success: true, deskripsi: deskripsiCerdas };
}

// ─── Alias ───────────────────────────────────────────────────────────────────
export const keluar = logout;
export const masuk = login;
export const updatePassword = gantiPassword;
