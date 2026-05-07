import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  let settings = await prisma.clinicSettings.findFirst();
  if (!settings) {
    settings = await prisma.clinicSettings.create({ data: {} });
  }
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const data = await req.json();
  let settings = await prisma.clinicSettings.findFirst();

  if (!settings) {
    settings = await prisma.clinicSettings.create({ data });
  } else {
    settings = await prisma.clinicSettings.update({ where: { id: settings.id }, data });
  }

  return NextResponse.json(settings);
}
