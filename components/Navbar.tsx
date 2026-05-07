"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, Stethoscope, LogOut, User } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary-500 p-1.5 rounded-lg">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-primary-600 text-sm leading-tight">Easy Life</p>
              <p className="text-xs text-gray-500 leading-tight">Aesthetic Clinic</p>
            </div>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-gray-600 hover:text-primary-600 font-medium">Home</Link>
            <Link href="/treatments" className="text-sm text-gray-600 hover:text-primary-600 font-medium">Treatments</Link>
            <Link href="/about" className="text-sm text-gray-600 hover:text-primary-600 font-medium">About</Link>
            <Link href="/contact" className="text-sm text-gray-600 hover:text-primary-600 font-medium">Contact</Link>
            {session?.user.role === "PATIENT" && (
              <Link href="/my-bookings" className="text-sm text-primary-600 font-medium">My Bookings</Link>
            )}
            {session?.user.role === "ASSISTANT" && (
              <Link href="/assistant" className="text-sm text-primary-600 font-semibold">Assistant Panel</Link>
            )}
            {session?.user.role === "ADMIN" && (
              <>
                <Link href="/assistant" className="text-sm text-primary-600 font-semibold">Assistant</Link>
                <Link href="/admin" className="text-sm text-accent-600 font-semibold">Admin</Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {session.user.name?.split(" ")[0]}
                </span>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-danger-DEFAULT"
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-600 hover:text-primary-600 font-medium">Login</Link>
                <Link href="/book" className="btn-primary text-sm py-2 px-4">Book Now</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 space-y-2 border-t border-gray-100 pt-3">
            <Link href="/" className="block px-2 py-2 text-sm text-gray-700" onClick={() => setOpen(false)}>Home</Link>
            <Link href="/treatments" className="block px-2 py-2 text-sm text-gray-700" onClick={() => setOpen(false)}>Treatments</Link>
            <Link href="/about" className="block px-2 py-2 text-sm text-gray-700" onClick={() => setOpen(false)}>About</Link>
            <Link href="/contact" className="block px-2 py-2 text-sm text-gray-700" onClick={() => setOpen(false)}>Contact</Link>
            {session?.user.role === "PATIENT" && (
              <Link href="/my-bookings" className="block px-2 py-2 text-sm text-primary-600 font-medium" onClick={() => setOpen(false)}>My Bookings</Link>
            )}
            {session?.user.role === "ASSISTANT" && (
              <Link href="/assistant" className="block px-2 py-2 text-sm font-semibold text-primary-600" onClick={() => setOpen(false)}>Assistant Panel</Link>
            )}
            {session?.user.role === "ADMIN" && (
              <>
                <Link href="/assistant" className="block px-2 py-2 text-sm font-semibold text-primary-600" onClick={() => setOpen(false)}>Assistant</Link>
                <Link href="/admin" className="block px-2 py-2 text-sm font-semibold text-accent-600" onClick={() => setOpen(false)}>Admin Panel</Link>
              </>
            )}
            {session ? (
              <button onClick={() => signOut()} className="block w-full text-left px-2 py-2 text-sm text-red-500">Sign out</button>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link href="/login" className="flex-1 text-center btn-outline text-sm py-2" onClick={() => setOpen(false)}>Login</Link>
                <Link href="/book" className="flex-1 text-center btn-primary text-sm py-2" onClick={() => setOpen(false)}>Book Now</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
