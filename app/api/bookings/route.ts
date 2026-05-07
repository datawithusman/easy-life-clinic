import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["ASSISTANT", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const dateParam = searchParams.get("date");
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};
  if (dateParam) {
    const date = new Date(dateParam);
    where.date = { gte: startOfDay(date), lte: endOfDay(date) };
  }
  if (status) where.status = status;

  const bookings = await prisma.booking.findMany({
    where,
    include: { user: { select: { name: true, email: true, phone: true } } },
    orderBy: { queueNumber: "asc" },
  });

  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { serviceType, consultType, date, notes } = await req.json();

    if (!serviceType || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const bookingDate = new Date(date);

    // Count confirmed bookings for that date to assign queue number
    const confirmed = await prisma.booking.count({
      where: {
        date: { gte: startOfDay(bookingDate), lte: endOfDay(bookingDate) },
        status: { not: "CANCELLED" },
      },
    });

    const queueNumber = confirmed + 1;

    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        serviceType,
        consultType: consultType || "IN_PERSON",
        date: bookingDate,
        queueNumber,
        notes,
        status: "PENDING",
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
