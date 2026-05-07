import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

const MAX_SLOTS = 8;

export async function GET(
  _req: NextRequest,
  { params }: { params: { date: string } }
) {
  const date = new Date(params.date);
  if (isNaN(date.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const count = await prisma.booking.count({
    where: {
      date: { gte: startOfDay(date), lte: endOfDay(date) },
      status: { notIn: ["CANCELLED"] },
    },
  });

  return NextResponse.json({
    date: params.date,
    booked: count,
    available: Math.max(0, MAX_SLOTS - count),
    isFull: count >= MAX_SLOTS,
  });
}
