"use client";

import { useState, useEffect } from "react";
import {
  Settings, Zap, Bell, Users, BarChart2, Plus, Trash2, Edit3,
  Check, X, Save, Loader2, ChevronDown, ChevronUp
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface Treatment {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: string;
  isActive: boolean;
  expiresAt: string | null;
}

interface ClinicSettings {
  skinFee: number;
  hairFee: number;
  bothFee: number;
  openDays: string;
  openTime: string;
  closeTime: string;
  slotDuration: number;
  discountPct: number;
  discountLabel: string | null;
}

interface User { id: string; name: string; email: string; phone: string; role: string; }

const tabs = [
  { id: "settings", label: "Settings", icon: Settings },
  { id: "treatments", label: "Treatments", icon: Zap },
  { id: "announcements", label: "Announcements", icon: Bell },
  { id: "users", label: "Users", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
];

const PIE_COLORS = ["#0E7C6E", "#5A3FA8", "#B8680A"];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("settings");
  const [clinicSettings, setClinicSettings] = useState<ClinicSettings | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<{ dailyData: { date: string; count: number }[]; serviceData: { name: string; value: number }[]; revenueEstimate: number; totalBookings: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const [newTreatment, setNewTreatment] = useState({ name: "", description: "", price: "", category: "Skin" });
  const [editTreatment, setEditTreatment] = useState<Treatment | null>(null);

  const [newAnn, setNewAnn] = useState({ title: "", message: "", type: "info", expiresAt: "" });

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setClinicSettings).catch(() => {});
    fetch("/api/treatments").then((r) => r.json()).then(setTreatments).catch(() => {});
    fetch("/api/announcements").then((r) => r.json()).then(setAnnouncements).catch(() => {});
    fetch("/api/users").then((r) => r.json()).then(setUsers).catch(() => {});
    fetch("/api/analytics").then((r) => r.json()).then(setAnalytics).catch(() => {});
  }, []);

  async function saveSettings() {
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clinicSettings),
      });
      setMsg("Settings saved!");
      setTimeout(() => setMsg(""), 3000);
    } catch { setMsg("Error saving settings"); }
    setSaving(false);
  }

  async function addTreatment() {
    if (!newTreatment.name || !newTreatment.price) return;
    const res = await fetch("/api/treatments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newTreatment, price: Number(newTreatment.price) }),
    });
    const t = await res.json();
    setTreatments([...treatments, t]);
    setNewTreatment({ name: "", description: "", price: "", category: "Skin" });
  }

  async function saveTreatment() {
    if (!editTreatment) return;
    const res = await fetch(`/api/treatments/${editTreatment.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editTreatment),
    });
    const updated = await res.json();
    setTreatments(treatments.map((t) => (t.id === updated.id ? updated : t)));
    setEditTreatment(null);
  }

  async function toggleTreatment(id: string, isActive: boolean) {
    await fetch(`/api/treatments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    setTreatments(treatments.map((t) => t.id === id ? { ...t, isActive } : t));
  }

  async function deleteTreatment(id: string) {
    if (!confirm("Delete this treatment?")) return;
    await fetch(`/api/treatments/${id}`, { method: "DELETE" });
    setTreatments(treatments.filter((t) => t.id !== id));
  }

  async function addAnnouncement() {
    if (!newAnn.title || !newAnn.message) return;
    const res = await fetch("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newAnn, expiresAt: newAnn.expiresAt || null }),
    });
    const a = await res.json();
    setAnnouncements([...announcements, a]);
    setNewAnn({ title: "", message: "", type: "info", expiresAt: "" });
  }

  async function toggleAnnouncement(id: string, isActive: boolean) {
    await fetch(`/api/announcements/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    setAnnouncements(announcements.map((a) => a.id === id ? { ...a, isActive } : a));
  }

  async function deleteAnnouncement(id: string) {
    if (!confirm("Delete this announcement?")) return;
    await fetch(`/api/announcements/${id}`, { method: "DELETE" });
    setAnnouncements(announcements.filter((a) => a.id !== id));
  }

  async function updateUserRole(userId: string, role: string) {
    await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    });
    setUsers(users.map((u) => u.id === userId ? { ...u, role } : u));
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Admin Panel</h1>
        <p className="text-gray-500 text-sm">Full control over clinic settings and data</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id ? "bg-primary-500 text-white" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* === SETTINGS TAB === */}
      {activeTab === "settings" && clinicSettings && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="font-bold text-gray-900 mb-4">Consultation Fees</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { key: "skinFee", label: "Skin Care Fee (PKR)" },
                { key: "hairFee", label: "Hair Care Fee (PKR)" },
                { key: "bothFee", label: "Skin + Hair Fee (PKR)" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  <input
                    type="number"
                    value={clinicSettings[f.key as keyof ClinicSettings] as number}
                    onChange={(e) => setClinicSettings({ ...clinicSettings, [f.key]: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="font-bold text-gray-900 mb-4">Clinic Schedule</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { key: "openTime", label: "Opening Time", type: "time" },
                { key: "closeTime", label: "Closing Time", type: "time" },
                { key: "slotDuration", label: "Slot Duration (mins)", type: "number" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    value={clinicSettings[f.key as keyof ClinicSettings] as string | number}
                    onChange={(e) => setClinicSettings({ ...clinicSettings, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value })}
                    className="input-field"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Open Days</label>
              <div className="flex flex-wrap gap-2">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                  const selected = clinicSettings.openDays.includes(day);
                  return (
                    <button
                      key={day}
                      onClick={() => {
                        const days = clinicSettings.openDays.split(",").filter(Boolean);
                        const updated = selected ? days.filter((d) => d !== day) : [...days, day];
                        setClinicSettings({ ...clinicSettings, openDays: updated.join(",") });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        selected ? "bg-primary-500 text-white border-primary-500" : "border-gray-200 text-gray-600"
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="font-bold text-gray-900 mb-4">Discount / Promotion</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount % (0 = disabled)</label>
                <input
                  type="number"
                  min={0} max={100}
                  value={clinicSettings.discountPct}
                  onChange={(e) => setClinicSettings({ ...clinicSettings, discountPct: Number(e.target.value) })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Label</label>
                <input
                  type="text"
                  placeholder="e.g. Eid Special — 20% Off"
                  value={clinicSettings.discountLabel || ""}
                  onChange={(e) => setClinicSettings({ ...clinicSettings, discountLabel: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {msg && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-sm">{msg}</div>}

          <button onClick={saveSettings} disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save All Settings
          </button>
        </div>
      )}

      {/* === TREATMENTS TAB === */}
      {activeTab === "treatments" && (
        <div className="space-y-6">
          {/* Add Treatment */}
          <div className="card">
            <h2 className="font-bold text-gray-900 mb-4">Add New Treatment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Name</label>
                <input className="input-field" placeholder="e.g. Hydra Facial" value={newTreatment.name}
                  onChange={(e) => setNewTreatment({ ...newTreatment, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="input-field" value={newTreatment.category}
                  onChange={(e) => setNewTreatment({ ...newTreatment, category: e.target.value })}>
                  {["Skin", "Hair", "Laser", "Aesthetic", "Both"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (PKR)</label>
                <input className="input-field" type="number" placeholder="6000" value={newTreatment.price}
                  onChange={(e) => setNewTreatment({ ...newTreatment, price: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="input-field" rows={2} placeholder="Short description..."
                  value={newTreatment.description}
                  onChange={(e) => setNewTreatment({ ...newTreatment, description: e.target.value })} />
              </div>
            </div>
            <button onClick={addTreatment} className="btn-primary mt-4 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Treatment
            </button>
          </div>

          {/* Treatments List */}
          <div className="card p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">All Treatments ({treatments.length})</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {treatments.map((t) => (
                <div key={t.id} className="px-6 py-4">
                  {editTreatment?.id === t.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input className="input-field text-sm" value={editTreatment.name}
                          onChange={(e) => setEditTreatment({ ...editTreatment, name: e.target.value })} />
                        <input className="input-field text-sm" type="number" value={editTreatment.price}
                          onChange={(e) => setEditTreatment({ ...editTreatment, price: Number(e.target.value) })} />
                      </div>
                      <textarea className="input-field text-sm" rows={2} value={editTreatment.description}
                        onChange={(e) => setEditTreatment({ ...editTreatment, description: e.target.value })} />
                      <div className="flex gap-2">
                        <button onClick={saveTreatment} className="flex items-center gap-1 bg-green-500 text-white text-sm px-3 py-1.5 rounded-md">
                          <Check className="w-3 h-3" /> Save
                        </button>
                        <button onClick={() => setEditTreatment(null)} className="text-sm px-3 py-1.5 rounded-md border border-gray-200">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900">{t.name}</p>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t.category}</span>
                          {!t.isActive && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Inactive</span>}
                        </div>
                        <p className="text-sm text-gray-500 mb-1">{t.description}</p>
                        <p className="text-sm font-bold text-primary-600">PKR {t.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => toggleTreatment(t.id, !t.isActive)}
                          className={`text-xs px-2 py-1 rounded-md border ${t.isActive ? "border-orange-200 text-orange-600" : "border-green-200 text-green-600"}`}>
                          {t.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button onClick={() => setEditTreatment(t)} className="text-gray-400 hover:text-primary-600">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteTreatment(t.id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* === ANNOUNCEMENTS TAB === */}
      {activeTab === "announcements" && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="font-bold text-gray-900 mb-4">Create Announcement</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input className="input-field" placeholder="Announcement title" value={newAnn.title}
                    onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select className="input-field" value={newAnn.type}
                    onChange={(e) => setNewAnn({ ...newAnn, type: e.target.value })}>
                    <option value="info">Info (Blue)</option>
                    <option value="warning">Warning (Amber)</option>
                    <option value="emergency">Emergency (Red)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea className="input-field" rows={3} placeholder="Announcement message..."
                  value={newAnn.message} onChange={(e) => setNewAnn({ ...newAnn, message: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (optional)</label>
                <input type="datetime-local" className="input-field" value={newAnn.expiresAt}
                  onChange={(e) => setNewAnn({ ...newAnn, expiresAt: e.target.value })} />
              </div>
              <button onClick={addAnnouncement} className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" /> Post Announcement
              </button>
            </div>
          </div>

          <div className="card p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">All Announcements</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {announcements.length === 0 && (
                <div className="px-6 py-8 text-center text-gray-400 text-sm">No announcements</div>
              )}
              {announcements.map((a) => (
                <div key={a.id} className="px-6 py-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">{a.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        a.type === "emergency" ? "bg-red-100 text-red-700" :
                        a.type === "warning" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                      }`}>{a.type}</span>
                      {!a.isActive && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Hidden</span>}
                    </div>
                    <p className="text-sm text-gray-600">{a.message}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => toggleAnnouncement(a.id, !a.isActive)}
                      className={`text-xs px-2 py-1 rounded-md border ${a.isActive ? "border-orange-200 text-orange-600" : "border-green-200 text-green-600"}`}>
                      {a.isActive ? "Hide" : "Show"}
                    </button>
                    <button onClick={() => deleteAnnouncement(a.id)} className="text-gray-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* === USERS TAB === */}
      {activeTab === "users" && (
        <div className="card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Registered Users ({users.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Name", "Email", "Phone", "Role", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">{u.name}</td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3 text-gray-600">{u.phone}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        u.role === "ADMIN" ? "bg-accent-100 text-accent-700" :
                        u.role === "ASSISTANT" ? "bg-primary-100 text-primary-700" : "bg-gray-100 text-gray-600"
                      }`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {u.role === "PATIENT" && (
                          <button onClick={() => updateUserRole(u.id, "ASSISTANT")}
                            className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-md hover:bg-primary-100">
                            Promote to Assistant
                          </button>
                        )}
                        {u.role === "ASSISTANT" && (
                          <button onClick={() => updateUserRole(u.id, "PATIENT")}
                            className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-md hover:bg-red-100">
                            Remove Assistant
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* === ANALYTICS TAB === */}
      {activeTab === "analytics" && analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Total Bookings (30d)", value: analytics.totalBookings },
              { label: "Revenue Estimate (PKR)", value: `PKR ${analytics.revenueEstimate.toLocaleString()}` },
            ].map((s) => (
              <div key={s.label} className="card">
                <p className="text-3xl font-extrabold text-primary-600">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="card">
            <h2 className="font-bold text-gray-900 mb-4">Bookings per Day (Last 30 Days)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.dailyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#0E7C6E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h2 className="font-bold text-gray-900 mb-4">Service Breakdown</h2>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie data={analytics.serviceData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                    {analytics.serviceData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {analytics.serviceData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[i] }} />
                    <span className="text-sm text-gray-700">{d.name}</span>
                    <span className="font-bold text-gray-900">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
