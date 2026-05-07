import Navbar from "@/components/Navbar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="bg-primary-600 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-2">Easy Life Aesthetic Clinic</h3>
              <p className="text-primary-100 text-sm">Dr. Zakia Noor — Aesthetic Physician (FJMU)</p>
              <p className="text-primary-100 text-sm mt-1">Lahore, Pakistan</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Clinic Hours</h4>
              <p className="text-primary-100 text-sm">Thursday, Friday, Saturday</p>
              <p className="text-primary-100 text-sm">6:30 PM – 8:30 PM</p>
              <p className="text-primary-100 text-sm">By appointment only</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Follow Us</h4>
              <a
                href="https://www.instagram.com/doctor_zakk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-100 text-sm hover:text-white"
              >
                @doctor_zakk on Instagram
              </a>
            </div>
          </div>
          <div className="border-t border-primary-500 mt-6 pt-6 text-center text-primary-200 text-xs">
            © {new Date().getFullYear()} Easy Life Aesthetic Clinic. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
