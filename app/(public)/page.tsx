import Link from "next/link";
import { Calendar, Clock, MapPin, Star, ArrowRight, Phone, Instagram } from "lucide-react";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import { prisma } from "@/lib/prisma";

async function getSettings() {
  try {
    let settings = await prisma.clinicSettings.findFirst();
    if (!settings) settings = await prisma.clinicSettings.create({ data: {} });
    return settings;
  } catch {
    return { skinFee: 4000, hairFee: 4000, bothFee: 8000, discountPct: 0, discountLabel: null };
  }
}

export default async function HomePage() {
  const settings = await getSettings();

  return (
    <div>
      {/* Discount Banner */}
      {settings.discountPct > 0 && settings.discountLabel && (
        <div className="bg-warning-DEFAULT text-white text-center py-2 px-4 text-sm font-medium">
          🎉 {settings.discountLabel} — {settings.discountPct}% Off on all services!
        </div>
      )}

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1.5 rounded-full text-sm mb-6">
              <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span>575K+ Instagram Followers</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Easy Life<br />
              <span className="text-primary-100">Aesthetic Clinic</span>
            </h1>
            <p className="text-xl text-primary-100 mb-2 font-medium">Dr. Zakia Noor — Aesthetic Physician</p>
            <p className="text-primary-200 mb-8 text-sm">FJMU | CPD-UK Certified | Lahore, Pakistan</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/book" className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 font-bold px-8 py-4 rounded-md hover:bg-primary-50 transition-colors text-base">
                <Calendar className="w-5 h-5" />
                Book Appointment
              </Link>
              <Link href="/treatments" className="inline-flex items-center justify-center gap-2 border-2 border-white/60 text-white font-semibold px-8 py-4 rounded-md hover:bg-white/10 transition-colors text-base">
                View Treatments <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
        <AnnouncementBanner />
      </div>

      {/* Clinic Info */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card flex items-start gap-4">
            <div className="bg-primary-50 p-3 rounded-xl">
              <Calendar className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Clinic Days</h3>
              <p className="text-sm text-gray-600">Thursday, Friday &amp; Saturday</p>
            </div>
          </div>
          <div className="card flex items-start gap-4">
            <div className="bg-primary-50 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Clinic Hours</h3>
              <p className="text-sm text-gray-600">6:30 PM – 8:30 PM</p>
              <p className="text-xs text-gray-400">By appointment only</p>
            </div>
          </div>
          <div className="card flex items-start gap-4">
            <div className="bg-primary-50 p-3 rounded-xl">
              <MapPin className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Location</h3>
              <p className="text-sm text-gray-600">Lahore, Pakistan</p>
              <Link href="/contact" className="text-xs text-primary-600 hover:underline">Get directions →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services & Fees */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Consultation Fees</h2>
            <p className="text-gray-500 text-sm">
              رابطہ کریں — Online اور In-Person دونوں دستیاب ہیں
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Skin Care", labelUrdu: "جِلد کا علاج", fee: settings.skinFee, color: "bg-green-500", icon: "🌿" },
              { label: "Hair Care", labelUrdu: "بالوں کا علاج", fee: settings.hairFee, color: "bg-purple-500", icon: "💫" },
              { label: "Skin + Hair", labelUrdu: "جِلد + بال", fee: settings.bothFee, color: "bg-primary-500", icon: "✨" },
            ].map((s) => (
              <div key={s.label} className="card text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-3">{s.icon}</div>
                <h3 className="text-xl font-bold text-gray-900">{s.label}</h3>
                <p className="text-sm text-gray-500 mb-4">{s.labelUrdu}</p>
                <div className="text-3xl font-extrabold text-primary-600 mb-1">
                  PKR {s.fee.toLocaleString()}
                </div>
                <p className="text-xs text-gray-400 mb-6">per consultation</p>
                <Link href="/book" className="btn-primary w-full block text-center text-sm">
                  Book Now
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-6">
            * Online consultations available at the same fee
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-accent-DEFAULT text-white py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-extrabold mb-4">Ready to Transform Your Skin?</h2>
          <p className="text-accent-100 mb-8">
            اپنی appointment book کریں اور Dr. Zakia سے ملیں۔ Limited slots available.
          </p>
          <Link href="/book" className="inline-flex items-center gap-2 bg-white text-accent-DEFAULT font-bold px-8 py-4 rounded-md hover:bg-accent-50 transition-colors">
            <Calendar className="w-5 h-5" />
            Book Your Appointment
          </Link>
        </div>
      </section>
    </div>
  );
}
