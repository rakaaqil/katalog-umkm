"use client";

import { useState, useEffect } from "react";
import { toko } from "@/lib/toko";

export default function PwaInstallPrompt() {
  const [tampil, setTampil] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // 1. Cek apakah sudah berjalan di mode standalone (sudah ter-install)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      return;
    }

    // 2. Cek apakah user sudah menutup prompt pada sesi ini
    if (sessionStorage.getItem("pwa_install_dismissed") === "true") {
      return;
    }

    // 3. Tangkap event beforeinstallprompt (Android / Chrome / Edge)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTampil(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 4. Deteksi perangkat iOS (Safari tidak mendukung beforeinstallprompt)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    if (isIosDevice) {
      setIsIos(true);
      // Tampilkan popup di iOS setelah 1.5 detik
      const timer = setTimeout(() => {
        if (sessionStorage.getItem("pwa_install_dismissed") !== "true") {
          setTampil(true);
        }
      }, 1500);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      };
    }

    // 5. Fallback timer jika browser mobile mendukung PWA
    const fallbackTimer = setTimeout(() => {
      if (sessionStorage.getItem("pwa_install_dismissed") !== "true") {
        setTampil(true);
      }
    }, 2000);

    return () => {
      clearTimeout(fallbackTimer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  async function handleInstallClick() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setTampil(false);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      setShowIosGuide(true);
    } else {
      // Panduan manual jika event otomatis belum tertangkap
      alert(
        "Untuk memasang di ponsel:\nKetuk menu browser (ikon titik tiga di kanan atas) lalu pilih 'Instal Aplikasi' atau 'Tambahkan ke Layar Utama'."
      );
      tutupPrompt();
    }
  }

  function tutupPrompt() {
    setTampil(false);
    sessionStorage.setItem("pwa_install_dismissed", "true");
  }

  if (!tampil) return null;

  return (
    <aside
      role="dialog"
      aria-labelledby="pwa-prompt-title"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="relative rounded-2xl border border-garis bg-latar p-4 shadow-2xl sm:p-5">
        {/* Tombol silang */}
        <button
          onClick={tutupPrompt}
          className="absolute right-3 top-3 rounded-full p-1 text-teks-lembut hover:bg-permukaan hover:text-teks"
          aria-label="Tutup rekomendasi instalasi"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <div className="flex items-start gap-3.5">
          <img
            src="/icons/icon-192.png"
            alt={toko.nama}
            className="h-12 w-12 shrink-0 rounded-xl border border-garis object-cover shadow-sm"
          />
          <div className="flex-1 pr-4">
            <h4 id="pwa-prompt-title" className="text-base font-bold leading-tight text-teks">
              Pasang {toko.nama}
            </h4>
            <p className="mt-1 text-xs text-teks-lembut">
              Pasang di layar utama HP untuk belanja produk lebih cepat, mudah, dan hemat kuota!
            </p>
          </div>
        </div>

        {/* Petunjuk khusus pengguna iOS */}
        {showIosGuide ? (
          <div className="mt-3.5 rounded-xl border border-garis bg-permukaan p-3 text-xs text-teks">
            <p className="font-semibold text-utama">Cara pasang di iPhone / iPad:</p>
            <ol className="mt-1.5 list-decimal pl-4 space-y-1 text-teks-lembut">
              <li>
                Ketuk tombol <strong>Bagikan (Share)</strong>{" "}
                <span className="inline-block align-middle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                </span>{" "}
                di bilah bawah Safari.
              </li>
              <li>
                Gulir ke bawah dan pilih <strong>"Tambahkan ke Layar Utama"</strong> (<em>Add to Home Screen</em>).
              </li>
              <li>
                Ketuk <strong>"Tambah"</strong> di sudut kanan atas.
              </li>
            </ol>
            <button
              onClick={tutupPrompt}
              className="mt-3 w-full rounded-lg bg-utama py-1.5 text-xs font-semibold text-white"
            >
              Saya Mengerti
            </button>
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-utama px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-utama-gelap"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Pasang Aplikasi
            </button>
            <button
              onClick={tutupPrompt}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-teks-lembut hover:bg-permukaan hover:text-teks"
            >
              Nanti Saja
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

