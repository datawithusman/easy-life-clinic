import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-forest-950">
      <Navbar />
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-ivory/5 bg-forest-950 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">

            {/* Brand */}
            <div className="md:col-span-5">
              <p className="font-display text-3xl text-ivory font-light mb-3 leading-tight">
                Easy Life<br />
                <span className="text-gold-400">Aesthetic Clinic</span>
              </p>
              <p className="text-ivory/40 text-sm mb-1">Dr. Zakia Noor — MBBS (FJMU)</p>
              <p className="text-ivory/30 text-sm">Aesthetic Physician · Lahore, Pakistan</p>

              <div className="mt-6 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-ivory/30 text-xs">Accepting bookings Thu–Sat</span>
              </div>
            </div>

            {/* Hours */}
            <div className="md:col-span-3">
              <p className="text-gold-500 text-xs tracking-[0.25em] uppercase font-semibold mb-5">Clinic Hours</p>
              <div className="space-y-2">
                <p className="text-ivory/55 text-sm">Thursday, Friday, Saturday</p>
                <p className="text-ivory/55 text-sm">6:30 PM – 8:30 PM</p>
                <p className="text-ivory/25 text-xs mt-3">By appointment only</p>
              </div>
            </div>

            {/* Links */}
            <div className="md:col-span-2">
              <p className="text-gold-500 text-xs tracking-[0.25em] uppercase font-semibold mb-5">Navigation</p>
              <div className="space-y-2.5">
                <Link href="/treatments" className="block text-sm text-ivory/50 hover:text-ivory transition-colors duration-200">Treatments</Link>
                <Link href="/about" className="block text-sm text-ivory/50 hover:text-ivory transition-colors duration-200">About</Link>
                <Link href="/contact" className="block text-sm text-ivory/50 hover:text-ivory transition-colors duration-200">Contact</Link>
                <Link href="/book" className="block text-sm text-gold-400 hover:text-gold-300 transition-colors duration-200 font-medium">Book Now</Link>
              </div>
            </div>

            {/* Instagram */}
            <div className="md:col-span-2">
              <p className="text-gold-500 text-xs tracking-[0.25em] uppercase font-semibold mb-5">Follow Us</p>
              <a
                href="https://www.instagram.com/doctor_zakk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-ivory/50 hover:text-ivory text-sm transition-colors duration-200 group"
              >
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-colors text-xs font-bold text-purple-300">IG</span>
                @doctor_zakk
              </a>
              <p className="text-ivory/20 text-xs mt-2.5">575K+ Followers</p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-ivory/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-ivory/20 text-xs">
              © {new Date().getFullYear()} Easy Life Aesthetic Clinic. All rights reserved.
            </p>
            <p className="text-ivory/15 text-xs">Lahore, Pakistan</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
