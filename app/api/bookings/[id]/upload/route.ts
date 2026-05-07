import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const allowed = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  let publicUrl = `/demo-upload/${params.id}-${file.name}`;

  // Try Supabase upload — silently skip if credentials are placeholders
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  if (supabaseUrl && !supabaseUrl.includes("placeholder")) {
    try {
      const { getSupabaseAdmin } = await import("@/lib/supabase");
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = file.name.split(".").pop();
      const path = `payment-proofs/${params.id}.${ext}`;

      const adminClient = getSupabaseAdmin();
      const { error } = await adminClient.storage
        .from("clinic-uploads")
        .upload(path, buffer, { upsert: true, contentType: file.type });

      if (!error) {
        const { data } = adminClient.storage.from("clinic-uploads").getPublicUrl(path);
        publicUrl = data.publicUrl;
      }
    } catch {
      // Fall through to demo URL
    }
  }

  await prisma.booking.update({
    where: { id: params.id },
    data: { paymentProofUrl: publicUrl },
  });

  return NextResponse.json({ url: publicUrl });
}
