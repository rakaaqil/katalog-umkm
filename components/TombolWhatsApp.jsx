"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

function getOpsiVarian(kategori, nama) {
  const kat = (kategori || "").toLowerCase();
  const n = (nama || "").toLowerCase();

  if (kat.includes("minuman") || n.includes("kopi") || n.includes("teh")) {
    return ["Reguler", "Dingin (Es)", "Panas / Hangat", "Less Sugar"];
  }
  if (
    kat.includes("camilan") ||
    kat.includes("bumbu") ||
    n.includes("keripik") ||
    n.includes("sambal")
  ) {
    return ["Original", "Pedas", "Extra Pedas"];
  }
  if (kat.includes("kue") || n.includes("nastar")) {
    return ["Toples 250 g", "Toples 500 g"];
  }
  if (kat.includes("kain") || n.includes("batik")) {
    return ["Standar (2 m)", "Potongan 3 m"];
  }
  if (kat.includes("kerajinan") || n.includes("tas")) {
    return ["Ukuran Sedang", "Ukuran Besar"];
  }

  return ["Standar", "Spesial"];
}

export default function TombolWhatsApp({ produk }) {
  if (!produk) return null;

  const opsiVarian = getOpsiVarian(produk.kategori, produk.nama);
  const [varianDipilih, setVarianDipilih] = useState(opsiVarian[0] || "Standar");
  const [catatanKhusus, setCatatanKhusus] = useState("");
  const [jumlah, setJumlah] = useState(1);

  const totalHarga = (produk.harga || 0) * jumlah;
  const nomor = (toko.nomorWhatsApp || "").replace(/[^0-9]/g, "");

  const varianFinal = catatanKhusus.trim()
    ? `${varianDipilih} (${catatanKhusus.trim()})`
    : varianDipilih;

  const pesan = `Halo, saya ingin memesan:
- Produk: ${produk.nama}
- Varian: ${varianFinal}
- Jumlah: ${jumlah} item
- Total: ${formatRupiah(totalHarga)}

Mohon informasi ketersediaan stoknya. Terima kasih!`;

  const url = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;

  function ubahJumlah(delta) {
    setJumlah((prev) => Math.max(1, prev + delta));
  }

  return (
    <div className="flex flex-col gap-5 border-t border-garis pt-5">
      {/* Pilihan Varian */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-teks">Pilih Varian</label>
        <div className="flex flex-wrap gap-2">
          {opsiVarian.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVarianDipilih(v)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                varianDipilih === v
                  ? "border-utama bg-utama text-white"
                  : "border-garis bg-latar text-teks hover:border-utama hover:text-utama"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Catatan varian lain (opsional)..."
          value={catatanKhusus}
          onChange={(e) => setCatatanKhusus(e.target.value)}
          className="mt-1 w-full rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
      </div>

      {/* Pilihan Jumlah */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-teks">Jumlah Pesanan</label>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-garis bg-latar">
            <button
              type="button"
              onClick={() => ubahJumlah(-1)}
              disabled={jumlah <= 1}
              className="flex h-10 w-10 items-center justify-center text-lg font-bold text-teks hover:bg-permukaan disabled:opacity-30 disabled:hover:bg-transparent"
              aria-label="Kurangi jumlah"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              value={jumlah}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setJumlah(isNaN(val) || val < 1 ? 1 : val);
              }}
              className="h-10 w-14 text-center font-bold text-teks focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              aria-label="Jumlah item"
            />
            <button
              type="button"
              onClick={() => ubahJumlah(1)}
              className="flex h-10 w-10 items-center justify-center text-lg font-bold text-teks hover:bg-permukaan"
              aria-label="Tambah jumlah"
            >
              +
            </button>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-teks-lembut">Total Harga:</span>
            <span className="font-extrabold text-harga">
              {formatRupiah(totalHarga)}
            </span>
          </div>
        </div>
      </div>

      {/* Tombol Pesan via WhatsApp */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-utama px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-utama-gelap sm:w-auto"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
        Pesan via WhatsApp ({formatRupiah(totalHarga)})
      </a>
    </div>
  );
}
