"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format, addDays, isBefore, startOfDay, getDay } from "date-fns";
import { ChevronRight, ChevronLeft, Check, Upload, X, Loader2 } from "lucide-react";
import QueueBadge from "@/components/QueueBadge";

type ServiceType = "SKIN" | "HAIR" | "BOTH";
type ConsultType = "IN_PERSON" | "ONLINE";

interface BookingData {
  serviceType: ServiceType | null;
  consultType: ConsultType;
  date: Date | null;
  notes: string;
}

interface Settings {
  skinFee: number;
  hairFee: number;
  bothFee: number;
  openDays: string;
}

function getStepTitle(step: number) {
  return ["Select Service", "Consult Type", "Select Date", "Your Details", "Payment", "Confirmation"][step - 1];
}

function isClinicDay(date: Date) {
  const day = getDay(date);
  return day === 4 || day === 5 || day === 6; // Thu, Fri, Sat
}

export default function BookPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState<BookingData>({
    serviceType: null, consultType: "IN_PERSON", date: null, notes: "",
  });
  const [settings, setSettings] = useState<Settings>({ skinFee: 4000, hairFee: 4000, bothFee: 8000, openDays: "Thursday,Friday,Saturday" });
  const [availabilities, setAvailabilities] = useState<Record<string, boolean>>({});
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<{ id: string; queueNumber: number } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setSettings).catch(() => {});
  }, []);

  useEffect(() => {
    if (step === 3) loadAvailabilities();
  }, [step]);

  async function loadAvailabilities() {
    const dates: Record<string, boolean> = {};
    const today = new Date();
    for (let i = 0; i <= 60; i++) {
      const d = addDays(today, i);
      if (isClinicDay(d) && !isBefore(d, startOfDay(today))) {
        const key = format(d, "yyyy-MM-dd");
        try {
          const res = await fetch(`/api/availability/${key}`);
          const data = await res.json();
          dates[key] = data.isFull;
        } catch {
          dates[key] = false;
        }
      }
    }
    setAvailabilities(dates);
  }

  function getFee() {
    if (!booking.serviceType) return 0;
    if (booking.serviceType === "SKIN") return settings.skinFee;
    if (booking.serviceType === "HAIR") return settings.hairFee;
    return settings.bothFee;
  }

  const canNext = () => {
    if (step === 1) return !!booking.serviceType;
    if (step === 2) return !!booking.consultType;
    if (step === 3) return !!booking.date;
    if (step === 4) return true;
    if (step === 5) return !!paymentFile;
    return false;
  };

  async function handleSubmit() {
    if (!session) { router.push("/login?redirect=/book"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType: booking.serviceType,
          consultType: booking.consultType,
          date: booking.date?.toISOString(),
          notes: booking.notes,
        }),
      });

      if (!res.ok) throw new Error("Booking failed");
      const created = await res.json();
      setCreatedBooking(created);

      // Upload payment proof
      if (paymentFile) {
        const fd = new FormData();
        fd.append("file", paymentFile);
        await fetch(`/api/bookings/${created.id}/upload`, { method: "POST", body: fd });
      }

      setStep(6);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin w-8 h-8 text-primary-500" /></div>;
  }

  if (!session && step < 4) {
    // allow browsing steps 1-3, gate at step 4
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Progress */}
      {step < 6 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold text-gray-900">Book Appointment</h1>
            <span className="text-sm text-gray-500">Step {step} of 5</span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className={`flex-1 h-1.5 rounded-full transition-colors ${s <= step ? "bg-primary-500" : "bg-gray-200"}`} />
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2 font-medium">{getStepTitle(step)}</p>
        </div>
      )}

      {/* Step 1 — Service Type */}
      {step === 1 && (
        <div className="space-y-4">
          {[
            { type: "SKIN" as ServiceType, label: "Skin Care", urdu: "جِلد کا علاج", icon: "🌿", fee: settings.skinFee },
            { type: "HAIR" as ServiceType, label: "Hair Care", urdu: "بالوں کا علاج", icon: "💫", fee: settings.hairFee },
            { type: "BOTH" as ServiceType, label: "Skin + Hair", urdu: "جِلد + بال", icon: "✨", fee: settings.bothFee },
          ].map((s) => (
            <button
              key={s.type}
              onClick={() => setBooking({ ...booking, serviceType: s.type })}
              className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                booking.serviceType === s.type
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 bg-white hover:border-primary-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{s.icon}</span>
                  <div>
                    <p className="font-bold text-gray-900">{s.label}</p>
                    <p className="text-sm text-gray-500">{s.urdu}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-600">PKR {s.fee.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">per session</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Step 2 — Consult Type */}
      {step === 2 && (
        <div className="space-y-4">
          {[
            { type: "IN_PERSON" as ConsultType, label: "In-Person", urdu: "کلینک آ کر", icon: "🏥", desc: "Visit the clinic in Lahore" },
            { type: "ONLINE" as ConsultType, label: "Online Consultation", urdu: "آن لائن", icon: "💻", desc: "Consult from the comfort of home" },
          ].map((c) => (
            <button
              key={c.type}
              onClick={() => setBooking({ ...booking, consultType: c.type })}
              className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                booking.consultType === c.type
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 bg-white hover:border-primary-200"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{c.icon}</span>
                <div>
                  <p className="font-bold text-gray-900">{c.label}</p>
                  <p className="text-sm text-gray-500">{c.urdu} — {c.desc}</p>
                </div>
              </div>
            </button>
          ))}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
            Both options carry the same fee: <strong>PKR {getFee().toLocaleString()}</strong>
          </div>
        </div>
      )}

      {/* Step 3 — Date */}
      {step === 3 && (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Clinic is open <strong>Thursday, Friday & Saturday</strong> only. Select an available date:
          </p>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 60 }).map((_, i) => {
              const d = addDays(new Date(), i);
              if (!isClinicDay(d) || isBefore(d, startOfDay(new Date()))) return null;
              const key = format(d, "yyyy-MM-dd");
              const isFull = availabilities[key];
              const isSelected = booking.date && format(booking.date, "yyyy-MM-dd") === key;
              return (
                <button
                  key={key}
                  disabled={!!isFull}
                  onClick={() => setBooking({ ...booking, date: d })}
                  className={`p-3 rounded-xl border-2 text-center transition-all text-sm ${
                    isSelected ? "border-primary-500 bg-primary-50 text-primary-700 font-bold"
                    : isFull ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                    : "border-gray-200 bg-white hover:border-primary-300"
                  }`}
                >
                  <div className="font-semibold">{format(d, "EEE")}</div>
                  <div>{format(d, "d MMM")}</div>
                  {isFull && <div className="text-xs text-red-400 mt-1">Full</div>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 4 — Patient Details */}
      {step === 4 && (
        <div className="space-y-4">
          {!session && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
              Please <a href="/login?redirect=/book" className="font-semibold underline">login</a> or <a href="/register" className="font-semibold underline">register</a> to continue booking.
            </div>
          )}
          {session && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input className="input-field bg-gray-50" value={session.user.name || ""} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input className="input-field bg-gray-50" value={session.user.email || ""} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input className="input-field bg-gray-50" value={session.user.phone || ""} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (optional)</label>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder="Any specific concern or note for the doctor..."
                  value={booking.notes}
                  onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* Step 5 — Payment */}
      {step === 5 && (
        <div className="space-y-6">
          <div className="card border-primary-200 bg-primary-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Total Fee</p>
                <p className="text-3xl font-extrabold text-primary-600">PKR {getFee().toLocaleString()}</p>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>{booking.serviceType === "SKIN" ? "Skin Care" : booking.serviceType === "HAIR" ? "Hair Care" : "Skin + Hair"}</p>
                <p>{booking.consultType === "ONLINE" ? "Online" : "In-Person"}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4">Payment Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Bank Transfer</span>
                <span className="text-gray-800">Account: XXXX-XXXX-XXXX</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">JazzCash</span>
                <span className="text-gray-800">+92XXX-XXXXXXX</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 font-medium">Account Name</span>
                <span className="text-gray-800">Dr. Zakia Noor</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Transfer the exact amount and upload the screenshot below. Your booking will be confirmed after our team verifies payment.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Payment Screenshot *
            </label>
            {paymentFile ? (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                <Check className="w-5 h-5 text-green-600 shrink-0" />
                <span className="text-sm text-green-700 flex-1 truncate">{paymentFile.name}</span>
                <button onClick={() => setPaymentFile(null)} className="text-gray-400 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-primary-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600">Click to upload payment screenshot</span>
                <span className="text-xs text-gray-400">JPG, PNG, PDF accepted</span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="hidden"
                  onChange={(e) => setPaymentFile(e.target.files?.[0] || null)}
                />
              </label>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
          )}
        </div>
      )}

      {/* Step 6 — Confirmation */}
      {step === 6 && createdBooking && (
        <div className="text-center py-8">
          <div className="flex justify-center mb-6">
            <QueueBadge number={createdBooking.queueNumber} size="lg" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Booking Submitted!</h2>
          <p className="text-green-600 font-semibold mb-6">بکنگ موصول ہو گئی ہے</p>

          <div className="card text-left mb-6">
            <div className="space-y-3 text-sm">
              {[
                ["Queue Number", `#${createdBooking.queueNumber}`],
                ["Date", booking.date ? format(booking.date, "EEEE, d MMMM yyyy") : ""],
                ["Service", booking.serviceType === "SKIN" ? "Skin Care" : booking.serviceType === "HAIR" ? "Hair Care" : "Skin + Hair"],
                ["Type", booking.consultType === "ONLINE" ? "Online" : "In-Person"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-semibold text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 text-left mb-6">
            <p className="font-semibold mb-2">آپ کی بکنگ pending ہے</p>
            <p>Payment verify ہونے کے بعد آپ کو WhatsApp اور Email پر confirmation ملے گی۔</p>
            <p className="mt-2">Your booking is pending verification. You will receive a WhatsApp confirmation once our team verifies your payment.</p>
          </div>

          <a href="/" className="btn-primary inline-block">Back to Home</a>
        </div>
      )}

      {/* Navigation */}
      {step < 6 && (
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-md hover:border-gray-300"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}
          <button
            onClick={() => {
              if (!session && step >= 3) { router.push("/login?redirect=/book"); return; }
              if (step === 5) { handleSubmit(); return; }
              setStep(step + 1);
            }}
            disabled={!canNext() || loading}
            className="flex-1 btn-primary flex items-center justify-center gap-2 py-3"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
            ) : step === 5 ? (
              <><Check className="w-4 h-4" /> Submit Booking</>
            ) : (
              <>Next <ChevronRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
