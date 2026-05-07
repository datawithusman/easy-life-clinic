import Link from "next/link";
import { Calendar, Clock, MapPin, Star, ArrowRight, Instagram } from "lucide-react";
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
    <div className="bg-forest-950">

      {/* Discount Banner */}
      {settings.discountPct > 0 && settings.discountLabel && (
        <div className="bg-gold-500 text-forest-950 text-center py-2.5 px-4 text-sm font-bold tracking-widest uppercase">
          ✦ {settings.discountLabel} — {settings.discountPct}% Off All Services
        </div>
      )}

      {/* Announcements */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <AnnouncementBanner />
      </div>

      {/* ══════════════════════════════════ HERO ══════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">

        {/* Ambient orbs */}
        <div
          className="absolute -top-20 -left-40 w-[700px] h-[700px] rounded-full bg-primary-600/18 blur-[160px] animate-float pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/3 -right-48 w-[560px] h-[560px] rounded-full bg-accent-600/12 blur-[130px] animate-float-slow pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/4 w-[420px] h-[420px] rounded-full bg-gold-500/6 blur-[110px] animate-float-reverse pointer-events-none"
          aria-hidden="true"
        />

        {/* Grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none grain-overlay opacity-20"
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-28">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2.5 border border-gold-500/25 bg-gold-500/7 px-4 py-2 rounded-full mb-10 animate-fade-up"
          >
            <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
            <span className="text-gold-300 text-xs font-semibold tracking-[0.12em] uppercase">575K+ Followers on Instagram</span>
          </div>

          {/* Heading */}
          <h1
            className="font-display font-light text-ivory leading-[0.88] mb-10 animate-fade-up"
            style={{ fontSize: "clamp(3.5rem, 9vw, 7.5rem)", animationDelay: "0.1s" }}
          >
            Reveal Your<br />
            <em className="text-gold-400 not-italic">True Beauty.</em>
          </h1>

          {/* Doctor */}
          <div className="animate-fade-up" style={{ animationDelay: "0.22s" }}>
            <p className="text-ivory/80 text-lg font-semibold mb-1">Dr. Zakia Noor</p>
            <p className="text-ivory/40 text-xs tracking-[0.22em] uppercase mb-12">
              FJMU · CPD‑UK Certified · Aesthetic Physician · Lahore, Pakistan
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.34s" }}>
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2.5 bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold px-8 py-4 rounded-full text-sm tracking-wide transition-all duration-300 hover:shadow-[0_0_36px_rgba(201,169,104,0.45)] active:scale-[0.98]"
            >
              <Calendar className="w-4 h-4" />
              Book Appointment
            </Link>
            <Link
              href="/treatments"
              className="inline-flex items-center justify-center gap-2 border border-ivory/20 hover:border-ivory/40 text-ivory/75 hover:text-ivory font-medium px-8 py-4 rounded-full text-sm tracking-wide transition-all duration-300 hover:bg-ivory/5"
            >
              View Treatments <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats row */}
          <div
            className="grid grid-cols-3 gap-8 mt-20 pt-8 border-t border-ivory/8 max-w-md animate-fade-up"
            style={{ animationDelay: "0.5s" }}
          >
            {[
              { num: "575K+", label: "Instagram\nFollowers" },
              { num: "5+", label: "Years\nExperience" },
              { num: "FJMU", label: "Medical\nDegree" },
            ].map((s) => (
              <div key={s.num}>
                <p className="font-display text-3xl text-gold-400 font-light leading-none mb-1.5">{s.num}</p>
                <p className="text-ivory/35 text-xs whitespace-pre-line leading-relaxed">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ INFO CARDS ═══════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 -mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Calendar,
              title: "Clinic Days",
              desc: "Thursday, Friday & Saturday",
              sub: null,
              link: null,
            },
            {
              icon: Clock,
              title: "Clinic Hours",
              desc: "6:30 PM – 8:30 PM",
              sub: "By appointment only",
              link: null,
            },
            {
              icon: MapPin,
              title: "Location",
              desc: "Lahore, Pakistan",
              sub: null,
              link: "/contact",
            },
          ].map((item) => (
            <div key={item.title} className="gold-border-card p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/15 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <p className="text-ivory font-semibold mb-1">{item.title}</p>
                <p className="text-ivory/55 text-sm">{item.desc}</p>
                {item.sub && <p className="text-ivory/30 text-xs mt-0.5">{item.sub}</p>}
                {item.link && (
                  <Link href={item.link} className="text-gold-400 hover:text-gold-300 text-xs mt-1.5 block transition-colors">
                    Get directions →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════ PRICING ═════════════════════════════ */}
      <section className="py-28 bg-gradient-to-b from-forest-900/60 to-forest-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Section heading */}
          <div className="text-center mb-16">
            <p className="text-gold-500 text-xs tracking-[0.3em] uppercase font-semibold mb-5">Consultation Fees</p>
            <h2
              className="font-display font-light text-ivory mb-5"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.1 }}
            >
              Your Journey<br />
              <em className="text-gold-400 not-italic">Begins Here</em>
            </h2>
            <p className="text-ivory/35 text-sm">رابطہ کریں — Online اور In‑Person دونوں دستیاب ہیں</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                label: "Skin Care",
                urdu: "جِلد کا علاج",
                fee: settings.skinFee,
                icon: "🌿",
                desc: "Advanced, evidence-based skin treatments tailored for South Asian complexions.",
                featured: false,
              },
              {
                label: "Skin + Hair",
                urdu: "جِلد + بال",
                fee: settings.bothFee,
                icon: "✨",
                desc: "Complete aesthetic care — skin and hair transformation in a single consultation.",
                featured: true,
              },
              {
                label: "Hair Care",
                urdu: "بالوں کا علاج",
                fee: settings.hairFee,
                icon: "💫",
                desc: "Specialist hair treatments for growth, restoration, and lasting shine.",
                featured: false,
              },
            ].map((s) => (
              <div
                key={s.label}
                className={`relative rounded-2xl p-8 flex flex-col transition-all duration-350 ${
                  s.featured
                    ? "bg-gradient-to-b from-gold-500/12 to-gold-500/4 border border-gold-500/40 shadow-[0_0_60px_rgba(201,169,104,0.14)]"
                    : "gold-border-card"
                }`}
              >
                {s.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold-500 text-forest-950 text-[10px] font-black px-5 py-1.5 rounded-full tracking-[0.18em] uppercase shadow-[0_4px_16px_rgba(201,169,104,0.4)]">
                    Most Popular
                  </div>
                )}
                <div className="text-4xl mb-5">{s.icon}</div>
                <h3 className="font-display text-2xl text-ivory font-medium mb-1">{s.label}</h3>
                <p className="text-ivory/35 text-xs mb-5">{s.urdu}</p>
                <p className="text-ivory/55 text-sm leading-relaxed mb-8 flex-1">{s.desc}</p>
                <div className="mb-7">
                  <p className="font-display text-4xl md:text-5xl text-gold-400 font-light leading-none">
                    PKR {s.fee.toLocaleString()}
                  </p>
                  <p className="text-ivory/25 text-xs mt-2">per consultation</p>
                </div>
                <Link
                  href="/book"
                  className={`text-center py-3.5 px-6 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${
                    s.featured
                      ? "bg-gold-500 hover:bg-gold-400 text-forest-950 hover:shadow-[0_0_24px_rgba(201,169,104,0.45)]"
                      : "border border-gold-500/25 text-gold-400 hover:bg-gold-500/10 hover:border-gold-500/55"
                  }`}
                >
                  Book Now
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-ivory/20 text-xs mt-8">
            * Online consultations available at the same fee
          </p>
        </div>
      </section>

      {/* ════════════════════════ INSTAGRAM STRIP ══════════════════════════ */}
      <section className="py-12 border-y border-ivory/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="gold-border-card p-8 flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shrink-0 shadow-lg">
              <Instagram className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-ivory font-bold text-lg mb-1">Follow Dr. Zakia on Instagram</p>
              <p className="text-ivory/45 text-sm">Real results, treatment tips &amp; behind-the-scenes from the clinic</p>
            </div>
            <div className="text-center shrink-0">
              <p className="font-display text-4xl text-gold-400 font-light leading-none">575K+</p>
              <p className="text-ivory/25 text-[11px] tracking-widest uppercase mt-1">Followers</p>
            </div>
            <a
              href="https://www.instagram.com/doctor_zakk"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-7 py-3.5 rounded-full text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
            >
              <Instagram className="w-4 h-4" />
              @doctor_zakk
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ CTA ═══════════════════════════════ */}
      <section className="relative py-36 overflow-hidden">
        {/* Background orb */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary-600/12 blur-[160px] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 pointer-events-none grain-overlay opacity-15"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gold-500 text-xs tracking-[0.3em] uppercase font-semibold mb-7">Limited Slots Available</p>
          <h2
            className="font-display font-light text-ivory mb-8 leading-[0.9]"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}
          >
            Ready to<br />
            <em className="text-gold-400 not-italic">Transform?</em>
          </h2>
          <p className="text-ivory/45 mb-12 text-sm leading-relaxed">
            اپنی appointment book کریں اور Dr. Zakia سے ملیں۔<br />
            Secure your slot before they fill up.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-3 bg-gold-500 hover:bg-gold-400 text-forest-950 font-black px-12 py-5 rounded-full text-sm tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_48px_rgba(201,169,104,0.55)] active:scale-[0.98]"
          >
            <Calendar className="w-4 h-4" />
            Book Appointment
          </Link>
        </div>
      </section>
    </div>
  );
}
