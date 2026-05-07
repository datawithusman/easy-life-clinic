"use client";

import { useEffect, useState } from "react";
import TreatmentCard from "@/components/TreatmentCard";
import Link from "next/link";
import { Search } from "lucide-react";

interface Treatment {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

const categories = ["All", "Skin", "Hair", "Laser", "Aesthetic", "Both"];

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
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Our Treatments</h1>
        <p className="text-gray-500">Advanced aesthetic treatments by Dr. Zakia Noor</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search treatments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-primary-500 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-primary-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-2/3 mb-3"></div>
              <div className="h-3 bg-gray-100 rounded mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-4/5"></div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">No treatments found</p>
          <p className="text-sm mt-1">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t) => (
            <TreatmentCard
              key={t.id}
              name={t.name}
              description={t.description}
              price={t.price}
              category={t.category}
            />
          ))}
        </div>
      )}

      <div className="text-center mt-12">
        <p className="text-gray-600 mb-4">Want to book a consultation?</p>
        <Link href="/book" className="btn-primary inline-block">Book Appointment</Link>
      </div>
    </div>
  );
}
