import { toko } from "@/lib/toko";

export default function manifest() {
  return {
    name: toko.nama,
    short_name: toko.nama.length > 15 ? toko.nama.slice(0, 15) : toko.nama,
    description: toko.tagline || "Katalog produk UMKM online",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1f6b4f",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };
}

