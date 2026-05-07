import { MapPin, Phone, Clock, Calendar, Instagram, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Contact Us</h1>
        <p className="text-gray-500">ہم سے رابطہ کریں</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="card flex items-start gap-4">
            <div className="bg-primary-50 p-3 rounded-xl shrink-0">
              <MapPin className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Clinic Address</h3>
              <p className="text-sm text-gray-600">Easy Life Aesthetic Clinic</p>
              <p className="text-sm text-gray-600">Lahore, Pakistan</p>
            </div>
          </div>

          <div className="card flex items-start gap-4">
            <div className="bg-primary-50 p-3 rounded-xl shrink-0">
              <Clock className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Clinic Hours</h3>
              <div className="space-y-1">
                {[
                  { day: "Thursday", time: "6:30 PM – 8:30 PM" },
                  { day: "Friday", time: "6:30 PM – 8:30 PM" },
                  { day: "Saturday", time: "6:30 PM – 8:30 PM" },
                ].map((h) => (
                  <div key={h.day} className="flex justify-between text-sm">
                    <span className="text-gray-700 font-medium">{h.day}</span>
                    <span className="text-primary-600">{h.time}</span>
                  </div>
                ))}
                <div className="text-xs text-gray-400 pt-1 border-t border-gray-100">
                  Doctor arrives 7:15 PM · Patients seen from 7:30 PM
                </div>
              </div>
            </div>
          </div>

          <div className="card flex items-start gap-4">
            <div className="bg-green-50 p-3 rounded-xl shrink-0">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">WhatsApp</h3>
              <p className="text-sm text-gray-600 mb-2">For inquiries and support</p>
              <a
                href="https://wa.me/92XXXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-green-500 text-white text-sm px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="card flex items-start gap-4">
            <div className="bg-purple-50 p-3 rounded-xl shrink-0">
              <Instagram className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Instagram</h3>
              <p className="text-sm text-gray-600 mb-2">575K+ followers</p>
              <a
                href="https://www.instagram.com/doctor_zakk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-600 font-semibold hover:underline"
              >
                @doctor_zakk
              </a>
            </div>
          </div>
        </div>

        {/* Booking reminder */}
        <div className="card bg-gradient-to-br from-primary-600 to-primary-700 text-white">
          <Calendar className="w-10 h-10 mb-4 text-primary-200" />
          <h3 className="text-xl font-bold mb-3">Book an Appointment</h3>
          <p className="text-primary-100 text-sm mb-6 leading-relaxed">
            Bookings are only available Thursday, Friday & Saturday between 6:30 PM – 8:30 PM.
            Use our online booking system for instant confirmation.
          </p>
          <div className="space-y-3 text-sm text-primary-100 mb-6">
            <div className="flex items-start gap-2">
              <span className="text-primary-300 mt-0.5">•</span>
              <span>Doctor arrives at 7:15 PM</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary-300 mt-0.5">•</span>
              <span>First-time patients must arrive by 7:00 PM</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary-300 mt-0.5">•</span>
              <span>Arrive 20 minutes before your queue number</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary-300 mt-0.5">•</span>
              <span>Payment via bank transfer / JazzCash (screenshot required)</span>
            </div>
          </div>
          <a href="/book" className="inline-block bg-white text-primary-600 font-bold px-6 py-3 rounded-md hover:bg-primary-50 transition-colors text-sm w-full text-center">
            Book Now
          </a>
        </div>
      </div>
    </div>
  );
}
