import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Koneksi server untuk publik/pengunjung membaca katalog & detail produk
export function createClient() {
  const rawUrl = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!rawUrl || !secretKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_SECRET_KEY wajib disetel di environment variable."
    );
  }

  // Bersihkan format URL jika ada trailing slash atau /rest/v1
  const url = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");

  return createSupabaseClient(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Koneksi sesi admin menggunakan publishable key dan cookie (@supabase/ssr)
export async function createSessionClient() {
  const rawUrl = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!rawUrl || !publishableKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY wajib disetel di environment variable."
    );
  }

  const url = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
  const cookieStore = await cookies();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll dipanggil dari Server Component
        }
      },
    },
  });
}

export { createClient as createServerClient, createSessionClient as createAuthClient };
