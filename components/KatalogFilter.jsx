"use client";

import { useState } from "react";
import KartuProduk from "./KartuProduk";

export default function KatalogFilter({ daftarProduk, daftarKategori }) {
  const [cari, setCari] = useState("");
  const [kategoriAktif, setKategoriAktif] = useState("Semua");

  const produkTerfilter = daftarProduk.filter((p) => {
    const cocokKategori =
      kategoriAktif === "Semua" || p.kategori === kategoriAktif;
    const cocokCari =
      cari === "" ||
      p.nama.toLowerCase().includes(cari.toLowerCase()) ||
      (p.kategori && p.kategori.toLowerCase().includes(cari.toLowerCase()));
    return cocokKategori && cocokCari;
  });

  return (
    <div className="flex flex-col gap-5">
      {/* Kotak pencarian */}
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-teks-lembut">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
        </span>
        <input
          type="search"
          placeholder="Cari produk..."
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          className="w-full rounded-lg border border-garis bg-latar py-2.5 pl-9 pr-4 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
      </div>

      {/* Filter kategori */}
      <div className="flex flex-wrap gap-2">
        {["Semua", ...daftarKategori].map((kat) => (
          <button
            key={kat}
            onClick={() => setKategoriAktif(kat)}
            className={`rounded-full border px-3 py-1 text-sm font-semibold transition-colors ${
              kategoriAktif === kat
                ? "border-utama bg-utama text-white"
                : "border-garis bg-latar text-teks hover:border-utama hover:text-utama"
            }`}
          >
            {kat}
          </button>
        ))}
      </div>

      {/* Grid produk */}
      {produkTerfilter.length === 0 ? (
        <p className="py-8 text-teks-lembut">
          Tidak ada produk{" "}
          {kategoriAktif !== "Semua" ? `dalam kategori "${kategoriAktif}"` : ""}
          {cari ? ` yang cocok dengan "${cari}"` : ""}.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {produkTerfilter.map((produk) => (
            <KartuProduk key={produk.id} produk={produk} />
          ))}
        </div>
      )}
    </div>
  );
}

