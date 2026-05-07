import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { subDays, startOfDay, endOfDay, format } from "date-fns";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30);

  const bookings = await prisma.booking.findMany({
    where: {
      createdAt: { gte: startOfDay(thirtyDaysAgo) },
      status: { notIn: ["CANCELLED"] },
    },
    select: { date: true, serviceType: true, status: true },
  });

  // Bookings per day
  const dailyMap: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const day = subDays(now, i);
    dailyMap[format(day, "MMM d")] = 0;
  }
  bookings.forEach((b) => {
    const key = format(b.date, "MMM d");
    if (key in dailyMap) dailyMap[key]++;
  });

  const dailyData = Object.entries(dailyMap).map(([date, count]) => ({ date, count }));

  // Service breakdown
  const serviceMap: Record<string, number> = { SKIN: 0, HAIR: 0, BOTH: 0 };
  bookings.forEach((b) => { serviceMap[b.serviceType]++; });

  const serviceData = [
    { name: "Skin Care", value: serviceMap.SKIN },
    { name: "Hair Care", value: serviceMap.HAIR },
    { name: "Skin + Hair", value: serviceMap.BOTH },
  ];

  const settings = await prisma.clinicSettings.findFirst();
  const skinFee = settings?.skinFee || 4000;
  const hairFee = settings?.hairFee || 4000;
  const bothFee = settings?.bothFee || 8000;

  const revenueEstimate = bookings
    .filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED")
    .reduce((sum, b) => {
      if (b.serviceType === "SKIN") return sum + skinFee;
      if (b.serviceType === "HAIR") return sum + hairFee;
      return sum + bothFee;
    }, 0);

  return NextResponse.json({ dailyData, serviceData, revenueEstimate, totalBookings: bookings.length });
}
