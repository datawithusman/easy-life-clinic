"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Stethoscope, LogOut, LayoutDashboard, Settings } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session.user.role === "PATIENT") router.push("/");
  }, [status, session, router]);

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-primary-600 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5" />
            <span className="font-bold text-sm">Easy Life Clinic</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/assistant" className="flex items-center gap-1 hover:text-primary-200 transition-colors">
              <LayoutDashboard className="w-4 h-4" /> Assistant
            </Link>
            {session?.user.role === "ADMIN" && (
              <Link href="/admin" className="flex items-center gap-1 hover:text-primary-200 transition-colors">
                <Settings className="w-4 h-4" /> Admin
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-primary-200">{session?.user.name}</span>
          <span className="bg-primary-500 text-xs px-2 py-0.5 rounded-full">{session?.user.role}</span>
          <button onClick={() => signOut()} className="hover:text-primary-200 flex items-center gap-1">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">{children}</main>
    </div>
  );
}
