import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormTambahProduk from "@/components/FormTambahProduk";
import { createSessionClient } from "@/lib/supabase/server";

export default async function HalamanTambahProduk() {
  const supabase = await createSessionClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Tambah produk</h1>
      <FormTambahProduk />
    </div>
  );
}
