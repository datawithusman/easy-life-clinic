import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getSupabaseAdmin() {
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function uploadPaymentProof(
  file: File,
  bookingId: string
): Promise<string> {
  const adminClient = getSupabaseAdmin();
  const ext = file.name.split(".").pop();
  const path = `payment-proofs/${bookingId}.${ext}`;

  const { error } = await adminClient.storage
    .from("clinic-uploads")
    .upload(path, file, { upsert: true });

  if (error) throw error;

  const { data } = adminClient.storage
    .from("clinic-uploads")
    .getPublicUrl(path);

  return data.publicUrl;
}
