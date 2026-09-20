"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export function BrandSettingsForm({
  settings,
  canEdit,
}: {
  settings: { brandName: string; supportEmail: string; currency: string; stripeLiveMode: boolean; taxInclusive: boolean };
  canEdit: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    const body = await res.json();
    setSaving(false);
    if (!res.ok) return setError(body.error ?? "Could not save settings");
    router.refresh();
  }

  return (
    <form onSubmit={save} className="grid gap-3">
      <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.1em] text-black/50">
        Brand name
        <input
          disabled={!canEdit}
          value={form.brandName}
          onChange={(e) => setForm((f) => ({ ...f, brandName: e.target.value }))}
          className="h-10 border border-black/15 px-3 text-sm outline-none disabled:bg-black/5"
        />
      </label>
      <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.1em] text-black/50">
        Support email
        <input
          disabled={!canEdit}
          value={form.supportEmail}
          onChange={(e) => setForm((f) => ({ ...f, supportEmail: e.target.value }))}
          className="h-10 border border-black/15 px-3 text-sm outline-none disabled:bg-black/5"
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-black/70">
        <input
          type="checkbox"
          disabled={!canEdit}
          checked={form.stripeLiveMode}
          onChange={(e) => setForm((f) => ({ ...f, stripeLiveMode: e.target.checked }))}
          className="size-4"
        />
        Stripe live mode enabled
      </label>
      <label className="flex items-center gap-2 text-sm text-black/70">
        <input
          type="checkbox"
          disabled={!canEdit}
          checked={form.taxInclusive}
          onChange={(e) => setForm((f) => ({ ...f, taxInclusive: e.target.checked }))}
          className="size-4"
        />
        Prices include tax
      </label>
      {!canEdit ? <p className="text-xs text-black/45">Brand details are locked to the owner role.</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {canEdit ? (
        <button disabled={saving} className="h-10 w-fit bg-black px-4 text-xs font-black uppercase text-white disabled:opacity-50">
          {saving ? "Saving..." : "Save brand settings"}
        </button>
      ) : null}
    </form>
  );
}

export function ShippingZoneManager({
  zones,
  canEdit,
}: {
  zones: { id: string; name: string; countries: string[]; rate: number; freeOver: number | null }[];
  canEdit: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", countries: "", rate: 12 });
  const [saving, setSaving] = useState(false);

  async function create(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    await fetch("/api/shipping-zones", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        countries: form.countries.split(",").map((c) => c.trim()).filter(Boolean),
        rate: Math.round(form.rate * 100),
      }),
    });
    setSaving(false);
    setForm({ name: "", countries: "", rate: 12 });
    router.refresh();
  }

  async function remove(id: string) {
    await fetch(`/api/shipping-zones/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="grid gap-3">
      {zones.map((zone) => (
        <div key={zone.id} className="flex items-center justify-between border border-black/10 bg-white p-3 text-sm">
          <div>
            <p className="font-black">{zone.name}</p>
            <p className="text-black/50">{zone.countries.join(", ")} / ${(zone.rate / 100).toFixed(2)} flat rate</p>
          </div>
          {canEdit ? (
            <button aria-label={`Remove ${zone.name}`} onClick={() => remove(zone.id)} className="text-black/40 hover:text-black">
              <Trash2 size={16} />
            </button>
          ) : null}
        </div>
      ))}
      {zones.length === 0 ? <p className="text-sm text-black/50">No shipping zones configured.</p> : null}
      {canEdit ? (
        <form onSubmit={create} className="grid grid-cols-[1fr_1fr_100px_auto] gap-2">
          <input
            required
            placeholder="Zone name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="h-10 border border-black/15 px-3 text-sm outline-none"
          />
          <input
            required
            placeholder="Countries (comma sep)"
            value={form.countries}
            onChange={(e) => setForm((f) => ({ ...f, countries: e.target.value }))}
            className="h-10 border border-black/15 px-3 text-sm outline-none"
          />
          <input
            required
            type="number"
            step="0.01"
            value={form.rate}
            onChange={(e) => setForm((f) => ({ ...f, rate: Number(e.target.value) }))}
            className="h-10 border border-black/15 px-3 text-sm outline-none"
          />
          <button disabled={saving} className="inline-flex h-10 items-center gap-1 bg-black px-3 text-xs font-black uppercase text-white disabled:opacity-50">
            <Plus size={14} /> Add
          </button>
        </form>
      ) : null}
    </div>
  );
}

export function TaxRateManager({ rates, canEdit }: { rates: { id: string; region: string; rate: number }[]; canEdit: boolean }) {
  const router = useRouter();
  const [form, setForm] = useState({ region: "", rate: 8 });
  const [saving, setSaving] = useState(false);

  async function create(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    await fetch("/api/tax-rates", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setForm({ region: "", rate: 8 });
    router.refresh();
  }

  async function remove(id: string) {
    await fetch(`/api/tax-rates/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="grid gap-3">
      {rates.map((rate) => (
        <div key={rate.id} className="flex items-center justify-between border border-black/10 bg-white p-3 text-sm">
          <p className="font-black">{rate.region}</p>
          <div className="flex items-center gap-3">
            <span>{rate.rate}%</span>
            {canEdit ? (
              <button aria-label={`Remove ${rate.region}`} onClick={() => remove(rate.id)} className="text-black/40 hover:text-black">
                <Trash2 size={16} />
              </button>
            ) : null}
          </div>
        </div>
      ))}
      {rates.length === 0 ? <p className="text-sm text-black/50">No tax rates configured.</p> : null}
      {canEdit ? (
        <form onSubmit={create} className="grid grid-cols-[1fr_100px_auto] gap-2">
          <input
            required
            placeholder="Region"
            value={form.region}
            onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
            className="h-10 border border-black/15 px-3 text-sm outline-none"
          />
          <input
            required
            type="number"
            step="0.1"
            value={form.rate}
            onChange={(e) => setForm((f) => ({ ...f, rate: Number(e.target.value) }))}
            className="h-10 border border-black/15 px-3 text-sm outline-none"
          />
          <button disabled={saving} className="inline-flex h-10 items-center gap-1 bg-black px-3 text-xs font-black uppercase text-white disabled:opacity-50">
            <Plus size={14} /> Add
          </button>
        </form>
      ) : null}
    </div>
  );
}

export function StaffManager({ staff, currentUserId }: { staff: { id: string; name: string; email: string; role: string }[]; currentUserId: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", role: "staff" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  async function create(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setTempPassword(null);
    const res = await fetch("/api/staff", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    const body = await res.json();
    setSaving(false);
    if (!res.ok) return setError(body.error ?? "Could not add staff member");
    setTempPassword(body.tempPassword);
    setForm({ name: "", email: "", role: "staff" });
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Remove this staff account?")) return;
    await fetch(`/api/staff/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="grid gap-3">
      {staff.map((member) => (
        <div key={member.id} className="flex items-center justify-between border border-black/10 bg-white p-3 text-sm">
          <div>
            <p className="font-black">{member.name}</p>
            <p className="text-black/50">{member.email} / {member.role}</p>
          </div>
          {member.id !== currentUserId ? (
            <button aria-label={`Remove ${member.name}`} onClick={() => remove(member.id)} className="text-black/40 hover:text-black">
              <Trash2 size={16} />
            </button>
          ) : (
            <span className="text-xs uppercase tracking-[0.1em] text-black/40">You</span>
          )}
        </div>
      ))}
      <form onSubmit={create} className="grid grid-cols-[1fr_1fr_120px_auto] gap-2">
        <input
          required
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="h-10 border border-black/15 px-3 text-sm outline-none"
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="h-10 border border-black/15 px-3 text-sm outline-none"
        />
        <select
          value={form.role}
          onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          className="h-10 border border-black/15 px-3 text-sm outline-none"
        >
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
          <option value="owner">Owner</option>
        </select>
        <button disabled={saving} className="inline-flex h-10 items-center gap-1 bg-black px-3 text-xs font-black uppercase text-white disabled:opacity-50">
          <Plus size={14} /> Invite
        </button>
      </form>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {tempPassword ? (
        <p className="text-sm text-emerald-700">
          Account created. Temporary password: <code className="bg-black/5 px-1 font-bold">{tempPassword}</code>
        </p>
      ) : null}
    </div>
  );
}
