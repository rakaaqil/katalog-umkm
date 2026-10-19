"use client";

import { useActionState, useState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { tambahProduk, generateDeskripsi } from "@/app/admin/actions";

export default function FormTambahProduk() {
  const [state, formAction] = useActionState(tambahProduk, null);
  const [deskripsi, setDeskripsi] = useState("");
  const [namaInput, setNamaInput] = useState("");
  const [kategoriInput, setKategoriInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  async function handleGenerateAi() {
    if (!namaInput.trim()) {
      setAiError("Nama produk wajib diisi sebelum membuat deskripsi.");
      return;
    }
    setAiLoading(true);
    setAiError(null);

    const fd = new FormData();
    fd.append("nama", namaInput);
    fd.append("kategori", kategoriInput);

    try {
      const res = await generateDeskripsi(null, fd);
      if (res?.success && res?.deskripsi) {
        setDeskripsi(res.deskripsi);
      } else if (res?.error) {
        setAiError(res.error);
      }
    } catch (err) {
      setAiError(err.message || "Gagal membuat deskripsi.");
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      {state?.error && (
        <div className="rounded-lg border border-garis bg-permukaan p-3 text-sm text-bahaya">
          {state.error}
        </div>
      )}
      <Input
        label="Nama produk"
        name="nama"
        value={namaInput}
        onChange={(e) => setNamaInput(e.target.value)}
        required
      />
      <Input label="Harga (Rp)" name="harga" type="number" min="0" required />
      <Input
        label="Kategori"
        name="kategori"
        value={kategoriInput}
        onChange={(e) => setKategoriInput(e.target.value)}
      />
      <Input
        label="Link foto"
        name="foto_url"
        placeholder="https://... atau /produk/nama-file.svg"
      />

      {/* Deskripsi + tombol AI */}
      <div className="flex flex-col gap-1.5 text-sm font-semibold">
        <div className="flex items-center justify-between">
          <span>Deskripsi</span>
          <button
            type="button"
            onClick={handleGenerateAi}
            disabled={aiLoading}
            className="text-xs font-semibold text-utama underline underline-offset-2 hover:text-utama-gelap disabled:opacity-50"
          >
            {aiLoading ? "Sedang membuat..." : "✦ Buat dengan AI"}
          </button>
        </div>
        {aiError && <p className="text-xs text-bahaya">{aiError}</p>}
        <textarea
          name="deskripsi"
          rows={4}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
      </div>

      <div className="flex gap-3">
        <Tombol type="submit">Simpan produk</Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}

