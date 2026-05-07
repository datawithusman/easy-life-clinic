"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Info, X, Bell } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: string;
}

export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/announcements")
      .then((r) => r.json())
      .then(setAnnouncements)
      .catch(() => {});
  }, []);

  const visible = announcements.filter((a) => !dismissed.has(a.id));
  if (!visible.length) return null;

  return (
    <div className="space-y-2">
      {visible.map((ann) => {
        const isEmergency = ann.type === "emergency";
        const isWarning = ann.type === "warning";

        return (
          <div
            key={ann.id}
            className={`flex items-start gap-3 px-4 py-3 rounded-lg border ${
              isEmergency
                ? "bg-red-50 border-red-200 text-red-800"
                : isWarning
                ? "bg-amber-50 border-amber-200 text-amber-800"
                : "bg-blue-50 border-blue-200 text-blue-800"
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isEmergency ? (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              ) : (
                <Info className="w-5 h-5 text-blue-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{ann.title}</p>
              <p className="text-sm mt-0.5 opacity-90">{ann.message}</p>
            </div>
            <button
              onClick={() => setDismissed((s) => { const n = new Set(s); n.add(ann.id); return n; })}
              className="shrink-0 opacity-60 hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
