import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    bankAccount: process.env.PAYMENT_BANK_ACCOUNT || "Contact clinic for account details",
    jazzCash: process.env.PAYMENT_JAZZCASH || "Contact clinic",
    accountName: process.env.PAYMENT_ACCOUNT_NAME || "Easy Life Aesthetic Clinic",
  });
}
