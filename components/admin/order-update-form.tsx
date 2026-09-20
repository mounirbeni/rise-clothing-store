"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminRole } from "@/lib/auth";

const statusOptions = ["pending", "paid", "in_fulfillment", "fulfilled", "refunded", "cancelled"];

export function OrderUpdateForm({
  orderId,
  status,
  trackingNumber,
  carrier,
  internalNote,
  role,
}: {
  orderId: string;
  status: string;
  trackingNumber: string;
  carrier: string;
  internalNote: string;
  role: AdminRole;
}) {
  const router = useRouter();
  const [form, setForm] = useState({ status, trackingNumber, carrier, internalNote });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canRefund = role === "owner" || role === "admin";

  async function save(extra?: Record<string, unknown>) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, ...extra }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Update failed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-4 border border-black/10 bg-white p-5">
      <h3 className="text-sm font-black uppercase tracking-[0.14em]">Fulfillment</h3>
      <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.1em] text-black/50">
        Status
        <select
          value={form.status}
          onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
          className="h-11 border border-black/15 px-3 text-sm outline-none"
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option.replace("_", " ")}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.1em] text-black/50">
        Tracking number
        <input
          value={form.trackingNumber}
          onChange={(e) => setForm((f) => ({ ...f, trackingNumber: e.target.value }))}
          className="h-11 border border-black/15 px-3 text-sm outline-none"
        />
      </label>
      <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.1em] text-black/50">
        Carrier
        <input
          value={form.carrier}
          onChange={(e) => setForm((f) => ({ ...f, carrier: e.target.value }))}
          className="h-11 border border-black/15 px-3 text-sm outline-none"
        />
      </label>
      <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.1em] text-black/50">
        Internal / customer note
        <textarea
          rows={3}
          value={form.internalNote}
          onChange={(e) => setForm((f) => ({ ...f, internalNote: e.target.value }))}
          className="border border-black/15 px-3 py-2 text-sm outline-none"
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="flex flex-wrap gap-2">
        <button
          disabled={saving}
          onClick={() => save()}
          className="h-11 bg-black px-5 text-sm font-black uppercase tracking-[0.14em] text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
        {canRefund && form.status !== "refunded" ? (
          <button
            type="button"
            disabled={saving}
            onClick={() => {
              if (confirm("Issue a refund for this order?")) save({ refund: true });
            }}
            className="h-11 border border-black/20 px-5 text-sm font-black uppercase tracking-[0.14em] text-black/70 hover:text-black disabled:opacity-50"
          >
            Issue refund
          </button>
        ) : null}
      </div>
    </div>
  );
}
