"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, LogOut, User, Sparkles } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-forest-950/85 backdrop-blur-md border-b border-gold-500/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-[0_0_16px_rgba(201,169,104,0.35)] group-hover:shadow-[0_0_24px_rgba(201,169,104,0.5)] transition-shadow duration-300">
              <Sparkles className="w-4 h-4 text-forest-950" />
            </div>
            <div>
              <p className="font-display font-semibold text-ivory text-sm leading-tight tracking-wide">Easy Life</p>
              <p className="text-[10px] text-gold-500 leading-tight tracking-[0.18em] uppercase">Aesthetic Clinic</p>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-ivory/60 hover:text-ivory transition-colors duration-200 font-medium">Home</Link>
            <Link href="/treatments" className="text-sm text-ivory/60 hover:text-ivory transition-colors duration-200 font-medium">Treatments</Link>
            <Link href="/about" className="text-sm text-ivory/60 hover:text-ivory transition-colors duration-200 font-medium">About</Link>
            <Link href="/contact" className="text-sm text-ivory/60 hover:text-ivory transition-colors duration-200 font-medium">Contact</Link>
            {session?.user.role === "PATIENT" && (
              <Link href="/my-bookings" className="text-sm text-gold-400 hover:text-gold-300 font-semibold transition-colors duration-200">My Bookings</Link>
            )}
            {session?.user.role === "ASSISTANT" && (
              <Link href="/assistant" className="text-sm text-gold-400 hover:text-gold-300 font-semibold transition-colors duration-200">Assistant Panel</Link>
            )}
            {session?.user.role === "ADMIN" && (
              <>
                <Link href="/assistant" className="text-sm text-gold-400 hover:text-gold-300 font-semibold transition-colors duration-200">Assistant</Link>
                <Link href="/admin" className="text-sm text-accent-300 hover:text-accent-200 font-semibold transition-colors duration-200">Admin</Link>
              </>
            )}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-ivory/45 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {session.user.name?.split(" ")[0]}
                </span>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1.5 text-sm text-ivory/40 hover:text-ivory/70 transition-colors duration-200"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign out
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm text-ivory/55 hover:text-ivory transition-colors duration-200 font-medium">
                  Login
                </Link>
                <Link
                  href="/book"
                  className="bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-sm px-5 py-2.5 rounded-full transition-all duration-300 hover:shadow-[0_0_24px_rgba(201,169,104,0.45)] tracking-wide"
                >
                  Book Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-ivory/70 hover:text-ivory transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-6 space-y-1 border-t border-ivory/8 pt-4">
            <Link href="/" className="block px-3 py-2.5 text-sm text-ivory/70 hover:text-ivory hover:bg-ivory/5 rounded-xl transition-colors" onClick={() => setOpen(false)}>Home</Link>
            <Link href="/treatments" className="block px-3 py-2.5 text-sm text-ivory/70 hover:text-ivory hover:bg-ivory/5 rounded-xl transition-colors" onClick={() => setOpen(false)}>Treatments</Link>
            <Link href="/about" className="block px-3 py-2.5 text-sm text-ivory/70 hover:text-ivory hover:bg-ivory/5 rounded-xl transition-colors" onClick={() => setOpen(false)}>About</Link>
            <Link href="/contact" className="block px-3 py-2.5 text-sm text-ivory/70 hover:text-ivory hover:bg-ivory/5 rounded-xl transition-colors" onClick={() => setOpen(false)}>Contact</Link>
            {session?.user.role === "PATIENT" && (
              <Link href="/my-bookings" className="block px-3 py-2.5 text-sm text-gold-400 font-semibold hover:bg-gold-500/10 rounded-xl transition-colors" onClick={() => setOpen(false)}>My Bookings</Link>
            )}
            {session?.user.role === "ASSISTANT" && (
              <Link href="/assistant" className="block px-3 py-2.5 text-sm text-gold-400 font-semibold hover:bg-gold-500/10 rounded-xl transition-colors" onClick={() => setOpen(false)}>Assistant Panel</Link>
            )}
            {session?.user.role === "ADMIN" && (
              <>
                <Link href="/assistant" className="block px-3 py-2.5 text-sm text-gold-400 font-semibold hover:bg-gold-500/10 rounded-xl transition-colors" onClick={() => setOpen(false)}>Assistant</Link>
                <Link href="/admin" className="block px-3 py-2.5 text-sm text-accent-300 font-semibold hover:bg-accent-500/10 rounded-xl transition-colors" onClick={() => setOpen(false)}>Admin Panel</Link>
              </>
            )}
            {session ? (
              <button
                onClick={() => signOut()}
                className="block w-full text-left px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors mt-2"
              >
                Sign out
              </button>
            ) : (
              <div className="flex gap-3 pt-4">
                <Link href="/login" className="flex-1 text-center border border-ivory/20 text-ivory/70 text-sm py-2.5 rounded-full hover:bg-ivory/5 transition-colors" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link href="/book" className="flex-1 text-center bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-sm py-2.5 rounded-full transition-colors" onClick={() => setOpen(false)}>
                  Book Now
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
