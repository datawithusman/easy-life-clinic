import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendBookingConfirmationEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["ASSISTANT", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const data = await req.json();
  await sendBookingConfirmationEmail(data);
  return NextResponse.json({ success: true });
}
