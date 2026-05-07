import Link from "next/link";
import { Stethoscope } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="bg-primary-500 p-2 rounded-xl">
          <Stethoscope className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="font-extrabold text-primary-700 text-lg leading-tight">Easy Life Aesthetic Clinic</p>
          <p className="text-xs text-gray-500">Dr. Zakia Noor, Lahore</p>
        </div>
      </Link>
      {children}
    </div>
  );
}
