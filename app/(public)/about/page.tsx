import Link from "next/link";
import { Award, GraduationCap, Instagram, Star, CheckCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">About Dr. Zakia Noor</h1>
        <p className="text-gray-500">Aesthetic Physician & Skin Specialist</p>
      </div>

      {/* Profile */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-32 h-32 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
            <span className="text-5xl">👩‍⚕️</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary-600 mb-1">Dr. Zakia Noor</h2>
            <p className="text-gray-600 font-medium mb-3">MBBS (FJMU) | Aesthetic & Cosmetic Physician</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full border border-primary-200">FJMU Graduate</span>
              <span className="bg-accent-50 text-accent-700 text-xs font-semibold px-3 py-1 rounded-full border border-accent-200">CPD-UK Certified</span>
              <span className="bg-yellow-50 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full border border-yellow-200">575K+ Followers</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Dr. Zakia Noor is a qualified Aesthetic Physician based in Lahore, Pakistan.
              With formal medical education from Fatima Jinnah Medical University (FJMU) and
              CPD certification from the UK, she specializes in advanced skin and hair treatments
              using evidence-based, safe techniques tailored for South Asian skin types.
            </p>
          </div>
        </div>
      </div>

      {/* Qualifications */}
      <div className="card mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary-600" />
          Qualifications & Training
        </h3>
        <div className="space-y-3">
          {[
            { title: "MBBS", desc: "Fatima Jinnah Medical University (FJMU), Lahore" },
            { title: "CPD Certification", desc: "Continuing Professional Development — United Kingdom" },
            { title: "Laser & Aesthetics Training", desc: "Advanced aesthetic procedures and laser treatments" },
            { title: "Dermal Fillers & Botox", desc: "Certified in cosmetic injectable procedures" },
          ].map((q) => (
            <div key={q.title} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-gray-800 text-sm">{q.title}</p>
                <p className="text-gray-500 text-sm">{q.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Specialties */}
      <div className="card mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary-600" />
          Specialties
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            "Laser Hair Removal", "Carbon Laser Facial", "PRP Hair Treatment",
            "Hydra Facial", "Chemical Peels", "Dermal Fillers",
            "Anti-Aging Treatments", "Acne Scar Treatment", "Mole Removal"
          ].map((s) => (
            <div key={s} className="bg-primary-50 rounded-lg px-3 py-2 text-sm text-primary-700 font-medium text-center">
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* Instagram */}
      <div className="card mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
        <div className="flex items-center gap-4">
          <Instagram className="w-10 h-10 text-purple-600" />
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">Follow on Instagram</h3>
            <p className="text-sm text-gray-600">See treatment results, tips and updates</p>
          </div>
          <a
            href="https://www.instagram.com/doctor_zakk"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-purple-700 transition-colors"
          >
            @doctor_zakk
          </a>
        </div>
      </div>

      <div className="text-center">
        <Link href="/book" className="btn-primary inline-block text-lg px-10 py-4">
          Book a Consultation
        </Link>
      </div>
    </div>
  );
}
