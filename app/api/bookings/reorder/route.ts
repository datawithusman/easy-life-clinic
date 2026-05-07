import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/bookings/reorder — accepts { orderedIds: string[] }
// Re-assigns queue numbers in the given order
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["ASSISTANT", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { orderedIds } = await req.json();
  if (!Array.isArray(orderedIds)) {
    return NextResponse.json({ error: "orderedIds must be an array" }, { status: 400 });
  }

  // Reassign queue numbers 1..n in the given order
  await prisma.$transaction(
    orderedIds.map((id: string, index: number) =>
      prisma.booking.update({ where: { id }, data: { queueNumber: index + 1 } })
    )
  );

  return NextResponse.json({ success: true });
}
