"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Check, X, SkipForward, Eye, RefreshCw, Calendar, GripVertical, Save, AlertTriangle } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import QueueBadge from "@/components/QueueBadge";

interface Booking {
  id: string;
  queueNumber: number;
  status: string;
  serviceType: string;
  consultType: string;
  date: string;
  paymentProofUrl: string | null;
  notes: string | null;
  user: { name: string; email: string; phone: string };
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "badge-pending",
  CONFIRMED: "badge-confirmed",
  CANCELLED: "badge-cancelled",
  SKIPPED: "badge-skipped",
  COMPLETED: "badge-completed",
};

export default function AssistantPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "reorder">("list");
  const [reorderList, setReorderList] = useState<Booking[]>([]);
  const [savingOrder, setSavingOrder] = useState(false);
  const [orderSaved, setOrderSaved] = useState(false);

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "PENDING").length,
    confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
    skipped: bookings.filter((b) => b.status === "SKIPPED").length,
  };

  async function loadBookings() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ date: selectedDate });
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      const res = await fetch(`/api/bookings?${params}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setBookings(list);
      setReorderList(list.filter((b: Booking) => b.status === "CONFIRMED"));
    } catch {
      setBookings([]);
    }
    setLoading(false);
  }

  useEffect(() => { loadBookings(); }, [selectedDate, statusFilter]);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    try {
      await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setSelected(null);
      await loadBookings();
    } catch {
      alert("Failed to update");
    }
    setUpdating(null);
  }

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    const items = Array.from(reorderList);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setReorderList(items);
    setOrderSaved(false);
  }

  async function saveReorder() {
    setSavingOrder(true);
    try {
      await fetch("/api/bookings/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: reorderList.map((b) => b.id) }),
      });
      setOrderSaved(true);
      await loadBookings();
    } catch {
      alert("Failed to save order");
    }
    setSavingOrder(false);
  }

  const serviceLabel = (s: string) =>
    s === "SKIN" ? "Skin" : s === "HAIR" ? "Hair" : "Skin+Hair";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Assistant Panel</h1>
        <p className="text-gray-500 text-sm">Manage bookings and verify payments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Bookings", value: stats.total, color: "bg-blue-50 text-blue-700" },
          { label: "Pending Payment", value: stats.pending, color: "bg-yellow-50 text-yellow-700" },
          { label: "Confirmed", value: stats.confirmed, color: "bg-green-50 text-green-700" },
          { label: "Skipped", value: stats.skipped, color: "bg-gray-50 text-gray-700" },
        ].map((s) => (
          <div key={s.label} className={`card ${s.color} border-0`}>
            <p className="text-3xl font-extrabold">{s.value}</p>
            <p className="text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters + View Toggle */}
      <div className="flex flex-wrap gap-3 mb-6 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field py-2 px-3 text-sm w-auto"
            />
          </div>
          {view === "list" && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field py-2 px-3 text-sm w-auto"
            >
              {["ALL", "PENDING", "CONFIRMED", "CANCELLED", "SKIPPED", "COMPLETED"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          )}
          <button onClick={loadBookings} className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView("list")}
            className={`text-sm px-4 py-2 rounded-lg font-medium border transition-colors ${view === "list" ? "bg-primary-500 text-white border-primary-500" : "border-gray-200 text-gray-600"}`}
          >
            Bookings List
          </button>
          <button
            onClick={() => setView("reorder")}
            className={`text-sm px-4 py-2 rounded-lg font-medium border transition-colors flex items-center gap-1 ${view === "reorder" ? "bg-amber-500 text-white border-amber-500" : "border-gray-200 text-gray-600"}`}
          >
            <GripVertical className="w-4 h-4" /> Reorder Queue
          </button>
        </div>
      </div>

      {/* === BOOKINGS LIST VIEW === */}
      {view === "list" && (
        <>
          {loading ? (
            <div className="card text-center py-10 text-gray-400">Loading...</div>
          ) : bookings.length === 0 ? (
            <div className="card text-center py-10 text-gray-400">
              <p className="text-lg">No bookings for this date/filter</p>
            </div>
          ) : (
            <div className="card p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {["Queue", "Patient", "Phone", "Service", "Type", "Status", "Payment", "Actions"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3"><QueueBadge number={b.queueNumber} size="sm" /></td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-900">{b.user.name}</p>
                          <p className="text-xs text-gray-400">{b.user.email}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{b.user.phone}</td>
                        <td className="px-4 py-3 text-gray-600">{serviceLabel(b.serviceType)}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{b.consultType === "ONLINE" ? "Online" : "In-Person"}</td>
                        <td className="px-4 py-3">
                          <span className={STATUS_COLORS[b.status] || "badge-pending"}>{b.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          {b.paymentProofUrl && !b.paymentProofUrl.startsWith("/demo") ? (
                            <a href={b.paymentProofUrl} target="_blank" rel="noopener noreferrer"
                              className="text-primary-600 text-xs hover:underline flex items-center gap-1">
                              <Eye className="w-3 h-3" /> View
                            </a>
                          ) : b.paymentProofUrl ? (
                            <span className="text-xs text-gray-400">Demo upload</span>
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => setSelected(b)}
                            className="text-xs bg-primary-50 text-primary-700 px-3 py-1.5 rounded-md hover:bg-primary-100">
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* === QUEUE REORDER VIEW === */}
      {view === "reorder" && (
        <div>
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-1">Emergency Queue Reorder</p>
              <p>Drag and drop confirmed patients to reorder them. Click Save to apply. Only use in emergency situations.</p>
            </div>
          </div>

          {reorderList.length === 0 ? (
            <div className="card text-center py-10 text-gray-400">
              No confirmed bookings to reorder for this date.
            </div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="queue">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2 mb-4">
                    {reorderList.map((b, index) => (
                      <Draggable key={b.id} draggableId={b.id} index={index}>
                        {(prov, snapshot) => (
                          <div
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            className={`card flex items-center gap-4 transition-shadow ${snapshot.isDragging ? "shadow-xl ring-2 ring-primary-400" : ""}`}
                          >
                            <div {...prov.dragHandleProps} className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing">
                              <GripVertical className="w-5 h-5" />
                            </div>
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-500 text-white font-bold text-sm shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{b.user.name}</p>
                              <p className="text-xs text-gray-500">{serviceLabel(b.serviceType)} · {b.user.phone}</p>
                            </div>
                            <span className="text-xs text-gray-400">Was #{b.queueNumber}</span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}

          {reorderList.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={saveReorder}
                disabled={savingOrder}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {savingOrder ? "Saving..." : "Save New Order"}
              </button>
              {orderSaved && (
                <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                  <Check className="w-4 h-4" /> Order saved successfully!
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Booking Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Booking Details</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <QueueBadge number={selected.queueNumber} size="md" />
                <div>
                  <p className="font-bold text-gray-900 text-lg">{selected.user.name}</p>
                  <p className="text-sm text-gray-500">{selected.user.email}</p>
                  <p className="text-sm text-gray-500">{selected.user.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Date", format(new Date(selected.date), "EEE, d MMM yyyy")],
                  ["Service", serviceLabel(selected.serviceType)],
                  ["Type", selected.consultType === "ONLINE" ? "Online" : "In-Person"],
                  ["Status", selected.status],
                ].map(([l, v]) => (
                  <div key={l} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">{l}</p>
                    <p className="font-semibold text-gray-900">{v}</p>
                  </div>
                ))}
              </div>

              {selected.notes && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-blue-600 mb-1">Patient Notes</p>
                  <p className="text-sm text-blue-800">{selected.notes}</p>
                </div>
              )}

              {selected.paymentProofUrl && !selected.paymentProofUrl.startsWith("/demo") && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Payment Screenshot</p>
                  <a href={selected.paymentProofUrl} target="_blank" rel="noopener noreferrer">
                    <img src={selected.paymentProofUrl} alt="Payment proof"
                      className="w-full rounded-xl border border-gray-200 hover:opacity-90"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </a>
                </div>
              )}
              {selected.paymentProofUrl?.startsWith("/demo") && (
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-500 text-center">
                  Demo upload — file not stored in cloud
                </div>
              )}

              <div className="flex gap-3 pt-2">
                {selected.status === "PENDING" && (
                  <>
                    <button disabled={updating === selected.id}
                      onClick={() => updateStatus(selected.id, "CONFIRMED")}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
                      <Check className="w-4 h-4" /> Confirm
                    </button>
                    <button disabled={updating === selected.id}
                      onClick={() => updateStatus(selected.id, "CANCELLED")}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3 rounded-xl border border-red-200 transition-colors disabled:opacity-50">
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </>
                )}
                {selected.status === "CONFIRMED" && (
                  <>
                    <button disabled={updating === selected.id}
                      onClick={() => updateStatus(selected.id, "SKIPPED")}
                      className="flex-1 flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold py-3 rounded-xl border border-amber-200 transition-colors disabled:opacity-50">
                      <SkipForward className="w-4 h-4" /> Mark Skipped
                    </button>
                    <button disabled={updating === selected.id}
                      onClick={() => updateStatus(selected.id, "COMPLETED")}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
                      <Check className="w-4 h-4" /> Complete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
