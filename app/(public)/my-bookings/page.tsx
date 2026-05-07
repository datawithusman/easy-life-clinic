"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar, Clock, Loader2, ExternalLink } from "lucide-react";
import QueueBadge from "@/components/QueueBadge";

interface Booking {
  id: string;
  queueNumber: number;
  status: string;
  serviceType: string;
  consultType: string;
  date: string;
  paymentProofUrl: string | null;
  notes: string | null;
  createdAt: string;
}

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  PENDING:   { label: "Pending Verification", cls: "badge-pending" },
  CONFIRMED: { label: "Confirmed ✓",          cls: "badge-confirmed" },
  CANCELLED: { label: "Cancelled",             cls: "badge-cancelled" },
  SKIPPED:   { label: "Skipped",               cls: "badge-skipped" },
  COMPLETED: { label: "Completed",             cls: "badge-completed" },
};

const SERVICE_LABEL: Record<string, string> = {
  SKIN: "Skin Care",
  HAIR: "Hair Care",
  BOTH: "Skin + Hair",
};

export default function MyBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?redirect=/my-bookings");
    if (status === "authenticated") {
      fetch("/api/bookings/mine")
        .then((r) => r.json())
        .then((data) => { setBookings(Array.isArray(data) ? data : []); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">My Bookings</h1>
        <p className="text-gray-500">میری بکنگز — {session?.user.name}</p>
      </div>

      {bookings.length === 0 ? (
        <div className="card text-center py-16">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No bookings yet</p>
          <p className="text-gray-400 text-sm mb-6">آپ نے ابھی تک کوئی appointment book نہیں کی</p>
          <a href="/book" className="btn-primary inline-block">Book Your First Appointment</a>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => {
            const s = STATUS_LABEL[b.status] || { label: b.status, cls: "badge-pending" };
            return (
              <div key={b.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <QueueBadge number={b.queueNumber} size="md" />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-bold text-gray-900">{SERVICE_LABEL[b.serviceType]}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {b.consultType === "ONLINE" ? "Online" : "In-Person"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{format(new Date(b.date), "EEEE, d MMMM yyyy")}</span>
                      </div>
                      {b.notes && (
                        <p className="text-xs text-gray-400 italic">&ldquo;{b.notes}&rdquo;</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={s.cls}>{s.label}</span>
                    <p className="text-xs text-gray-400 mt-2">
                      Booked {format(new Date(b.createdAt), "d MMM yyyy")}
                    </p>
                  </div>
                </div>

                {/* Status-specific messages */}
                {b.status === "PENDING" && (
                  <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 text-sm text-amber-800">
                    ⏳ Payment verification pending. You&apos;ll receive a WhatsApp once confirmed.
                  </div>
                )}
                {b.status === "CONFIRMED" && (
                  <div className="mt-3 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-sm text-green-800">
                    ✓ Appointment confirmed! Please arrive 20 minutes before your queue number. Doctor starts at 7:30 PM.
                  </div>
                )}
                {b.status === "CANCELLED" && (
                  <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-sm text-red-700">
                    This booking was cancelled. Please re-book if needed.
                  </div>
                )}

                {b.paymentProofUrl && !b.paymentProofUrl.startsWith("/demo") && (
                  <div className="mt-3 flex items-center gap-2">
                    <a
                      href={b.paymentProofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary-600 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> View payment screenshot
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 text-center">
        <a href="/book" className="btn-outline inline-block">+ Book Another Appointment</a>
      </div>
    </div>
  );
}
