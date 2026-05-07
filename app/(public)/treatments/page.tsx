"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Sparkles } from "lucide-react";

interface Treatment {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

const categories = ["All", "Skin", "Hair", "Laser", "Aesthetic", "Both"];

const categoryDot: Record<string, string> = {
  Skin: "bg-emerald-400",
  Hair: "bg-violet-400",
  Laser: "bg-sky-400",
  Aesthetic: "bg-rose-400",
  Both: "bg-teal-400",
  Other: "bg-gray-500",
};

const categoryGlow: Record<string, string> = {
  Skin: "group-hover:shadow-[0_0_30px_rgba(52,211,153,0.08)]",
  Hair: "group-hover:shadow-[0_0_30px_rgba(167,139,250,0.08)]",
  Laser: "group-hover:shadow-[0_0_30px_rgba(56,189,248,0.08)]",
  Aesthetic: "group-hover:shadow-[0_0_30px_rgba(251,113,133,0.08)]",
  Both: "group-hover:shadow-[0_0_30px_rgba(45,212,191,0.08)]",
  Other: "group-hover:shadow-[0_0_30px_rgba(201,169,104,0.08)]",
};

export default function TreatmentsPage() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/treatments")
      .then((r) => r.json())
      .then((data) => { setTreatments(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = treatments.filter((t) => {
    const matchCat = activeCategory === "All" || t.category === activeCategory;
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="bg-forest-950 min-h-screen">

      {/* ─── Page Header ─── */}
      <div className="relative py-24 px-4 sm:px-6 overflow-hidden border-b border-ivory/5">
        {/* Orb */}
        <div
          className="absolute top-0 left-1/4 w-[500px] h-[350px] bg-primary-600/15 blur-[120px] rounded-full pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 right-1/4 w-[350px] h-[250px] bg-accent-600/10 blur-[100px] rounded-full pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-6xl mx-auto">
          <p className="text-gold-500 text-xs tracking-[0.3em] uppercase font-semibold mb-5">Dr. Zakia Noor</p>
          <h1
            className="font-display font-light text-ivory leading-[0.9] mb-5"
            style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)" }}
          >
            Our <em className="text-gold-400 not-italic">Treatments</em>
          </h1>
          <p className="text-ivory/40 text-sm max-w-sm leading-relaxed">
            Advanced aesthetic treatments designed for South Asian skin — evidence‑based, safe, and tailored for you.
          </p>
        </div>
      </div>

      {/* ─── Controls ─── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-4">

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory/30 pointer-events-none" />
          <input
            type="text"
            placeholder="Search treatments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-ivory/4 border border-ivory/10 focus:border-gold-500/40 text-ivory placeholder-ivory/25 rounded-full px-5 py-3.5 pl-11 text-sm outline-none transition-colors duration-200 focus:bg-ivory/6"
          />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-250 ${
                activeCategory === cat
                  ? "bg-gold-500 text-forest-950 shadow-[0_0_20px_rgba(201,169,104,0.35)]"
                  : "border border-ivory/12 text-ivory/45 hover:border-ivory/30 hover:text-ivory/75 hover:bg-ivory/4"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Cards ─── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="gold-border-card p-6 animate-pulse">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-ivory/15" />
                  <div className="h-2.5 bg-ivory/10 rounded w-16" />
                </div>
                <div className="h-5 bg-ivory/10 rounded w-3/4 mb-3" />
                <div className="h-3 bg-ivory/6 rounded mb-2" />
                <div className="h-3 bg-ivory/6 rounded w-4/5 mb-2" />
                <div className="h-3 bg-ivory/6 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <Sparkles className="w-10 h-10 text-gold-500/35 mx-auto mb-5" />
            <p className="text-ivory/40 text-lg font-medium">No treatments found</p>
            <p className="text-ivory/22 text-sm mt-2">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((t) => {
              const dot = categoryDot[t.category] ?? categoryDot.Other;
              const glow = categoryGlow[t.category] ?? categoryGlow.Other;
              return (
                <div
                  key={t.id}
                  className={`gold-border-card p-6 group flex flex-col transition-all duration-350 ${glow}`}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2 mb-5">
                    <div className="flex items-center gap-2 pt-0.5">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                      <span className="text-[11px] font-bold text-ivory/40 uppercase tracking-[0.14em]">{t.category}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-display text-xl text-gold-400 font-light leading-none">
                        PKR {t.price.toLocaleString()}
                      </p>
                      <p className="text-ivory/22 text-[11px] mt-1">per session</p>
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="text-ivory font-bold mb-2.5 leading-snug group-hover:text-gold-300 transition-colors duration-250">
                    {t.name}
                  </h3>

                  {/* Desc */}
                  <p className="text-ivory/45 text-sm leading-relaxed flex-1">
                    {t.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── Bottom CTA ─── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center border-t border-ivory/5 pt-20">
          <p
            className="font-display text-ivory/50 font-light italic mb-8"
            style={{ fontSize: "clamp(1.6rem, 4vw, 2.5rem)" }}
          >
            Ready to begin your journey?
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-2.5 bg-gold-500 hover:bg-gold-400 text-forest-950 font-black px-10 py-4 rounded-full text-sm tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_36px_rgba(201,169,104,0.45)] active:scale-[0.98]"
          >
            Book Appointment
          </Link>
        </div>
      </div>
    </div>
  );
}
