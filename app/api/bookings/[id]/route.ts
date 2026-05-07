import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmationWhatsApp, sendBookingRejectionWhatsApp } from "@/lib/twilio";
import { sendBookingConfirmationEmail, sendBookingRejectionEmail } from "@/lib/mailer";
import { formatDate, formatServiceType } from "@/lib/utils";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !["ASSISTANT", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { status, queueNumber } = await req.json();

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { user: true },
  });

  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.booking.update({
    where: { id: params.id },
    data: { status, ...(queueNumber !== undefined ? { queueNumber } : {}) },
    include: { user: true },
  });

  // Send notifications on status change
  if (status === "CONFIRMED") {
    const dateStr = formatDate(booking.date);
    const serviceStr = formatServiceType(booking.serviceType);

    try {
      await Promise.all([
        sendBookingConfirmationWhatsApp({
          patientName: booking.user.name,
          patientPhone: booking.user.phone,
          date: dateStr,
          serviceType: serviceStr,
          queueNumber: booking.queueNumber,
        }),
        sendBookingConfirmationEmail({
          patientName: booking.user.name,
          patientEmail: booking.user.email,
          date: dateStr,
          serviceType: serviceStr,
          queueNumber: booking.queueNumber,
        }),
      ]);
    } catch (err) {
      console.error("Notification error:", err);
    }
  }

  if (status === "CANCELLED") {
    try {
      await Promise.all([
        sendBookingRejectionWhatsApp(booking.user.name, booking.user.phone),
        sendBookingRejectionEmail(booking.user.name, booking.user.email),
      ]);
    } catch (err) {
      console.error("Notification error:", err);
    }
  }

  return NextResponse.json(updated);
}
