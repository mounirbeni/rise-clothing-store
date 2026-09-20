"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

type Discount = { id: string; code: string; description: string; percentOff: number; active: boolean; timesUsed: number };
type Banner = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaLabel: string;
  ctaHref: string;
  active: boolean;
};
type Campaign = { id: string; name: string; subject: string; status: string };

export function DiscountManager({ discounts }: { discounts: Discount[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ code: "", description: "", percentOff: 15 });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function create(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch("/api/discounts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    const body = await res.json();
    setSaving(false);
    if (!res.ok) return setError(body.error ?? "Could not create code");
    setForm({ code: "", description: "", percentOff: 15 });
    router.refresh();
  }

  async function toggle(id: string, active: boolean) {
    await fetch(`/api/discounts/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this discount code?")) return;
    await fetch(`/api/discounts/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        {discounts.map((discount) => (
          <div key={discount.id} className="flex items-center justify-between gap-3 border border-black/10 bg-white p-3 text-sm">
            <div>
              <p className="font-black">
                {discount.code} / {discount.percentOff}% off
              </p>
              <p className="text-black/50">{discount.description} / used {discount.timesUsed}x</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggle(discount.id, discount.active)}
                className={`h-8 border px-3 text-xs font-black uppercase ${discount.active ? "border-black bg-black text-white" : "border-black/20 text-black/50"}`}
              >
                {discount.active ? "Active" : "Inactive"}
              </button>
              <button aria-label={`Delete ${discount.code}`} onClick={() => remove(discount.id)} className="text-black/40 hover:text-black">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {discounts.length === 0 ? <p className="text-sm text-black/50">No discount codes yet.</p> : null}
      </div>
      <form onSubmit={create} className="grid grid-cols-[1fr_1fr_100px_auto] gap-2">
        <input
          required
          placeholder="CODE"
          value={form.code}
          onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
          className="h-10 border border-black/15 px-3 text-sm uppercase outline-none"
        />
        <input
          required
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="h-10 border border-black/15 px-3 text-sm outline-none"
        />
        <input
          required
          type="number"
          min="1"
          max="90"
          value={form.percentOff}
          onChange={(e) => setForm((f) => ({ ...f, percentOff: Number(e.target.value) }))}
          className="h-10 border border-black/15 px-3 text-sm outline-none"
        />
        <button disabled={saving} className="inline-flex h-10 items-center gap-1 bg-black px-3 text-xs font-black uppercase text-white disabled:opacity-50">
          <Plus size={14} /> Add
        </button>
      </form>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

export function BannerManager({ banners }: { banners: Banner[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", subtitle: "", imageUrl: "", ctaLabel: "", ctaHref: "/shop" });
  const [saving, setSaving] = useState(false);

  async function create(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    await fetch("/api/banners", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setForm({ title: "", subtitle: "", imageUrl: "", ctaLabel: "", ctaHref: "/shop" });
    router.refresh();
  }

  async function toggle(id: string, active: boolean) {
    await fetch(`/api/banners/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this banner?")) return;
    await fetch(`/api/banners/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        {banners.map((banner) => (
          <div key={banner.id} className="flex items-center justify-between gap-3 border border-black/10 bg-white p-3 text-sm">
            <div className="flex items-center gap-3">
              {banner.imageUrl ? (
                <img src={banner.imageUrl} alt="" className="size-10 rounded object-cover" />
              ) : null}
              <div>
                <p className="font-black">{banner.title}</p>
                <p className="text-black/50">{banner.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggle(banner.id, banner.active)}
                className={`h-8 border px-3 text-xs font-black uppercase ${banner.active ? "border-black bg-black text-white" : "border-black/20 text-black/50"}`}
              >
                {banner.active ? "Live" : "Hidden"}
              </button>
              <button aria-label={`Delete ${banner.title}`} onClick={() => remove(banner.id)} className="text-black/40 hover:text-black">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {banners.length === 0 ? <p className="text-sm text-black/50">No promotional banners yet.</p> : null}
      </div>
      <form onSubmit={create} className="grid gap-2">
        <div className="grid grid-cols-2 gap-2">
          <input
            required
            placeholder="Banner title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="h-10 border border-black/15 px-3 text-sm outline-none"
          />
          <input
            placeholder="Subtitle"
            value={form.subtitle}
            onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
            className="h-10 border border-black/15 px-3 text-sm outline-none"
          />
        </div>
        <input
          placeholder="Image path (e.g. /images/campaigns/drop.png)"
          value={form.imageUrl}
          onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
          className="h-10 border border-black/15 px-3 text-sm outline-none"
        />
        <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
          <input
            placeholder="CTA label (e.g. Shop now)"
            value={form.ctaLabel}
            onChange={(e) => setForm((f) => ({ ...f, ctaLabel: e.target.value }))}
            className="h-10 border border-black/15 px-3 text-sm outline-none"
          />
          <input
            placeholder="CTA link (e.g. /shop)"
            value={form.ctaHref}
            onChange={(e) => setForm((f) => ({ ...f, ctaHref: e.target.value }))}
            className="h-10 border border-black/15 px-3 text-sm outline-none"
          />
          <button disabled={saving} className="inline-flex h-10 items-center gap-1 bg-black px-3 text-xs font-black uppercase text-white disabled:opacity-50">
            <Plus size={14} /> Add
          </button>
        </div>
      </form>
    </div>
  );
}

export function CampaignManager({ campaigns }: { campaigns: Campaign[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", subject: "", body: "" });
  const [saving, setSaving] = useState(false);

  async function create(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    await fetch("/api/campaigns", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setForm({ name: "", subject: "", body: "" });
    router.refresh();
  }

  async function markSent(id: string) {
    await fetch(`/api/campaigns/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: "sent" }),
    });
    router.refresh();
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="flex items-center justify-between gap-3 border border-black/10 bg-white p-3 text-sm">
            <div>
              <p className="font-black">{campaign.name}</p>
              <p className="text-black/50">{campaign.subject}</p>
            </div>
            {campaign.status === "sent" ? (
              <span className="h-8 border border-black/20 px-3 text-xs font-black uppercase leading-8 text-black/50">Sent</span>
            ) : (
              <button onClick={() => markSent(campaign.id)} className="h-8 border border-black bg-black px-3 text-xs font-black uppercase text-white">
                Mark sent
              </button>
            )}
          </div>
        ))}
        {campaigns.length === 0 ? <p className="text-sm text-black/50">No campaign drafts yet.</p> : null}
      </div>
      <form onSubmit={create} className="grid gap-2">
        <input
          required
          placeholder="Campaign name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="h-10 border border-black/15 px-3 text-sm outline-none"
        />
        <input
          required
          placeholder="Subject line"
          value={form.subject}
          onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
          className="h-10 border border-black/15 px-3 text-sm outline-none"
        />
        <textarea
          required
          placeholder="Draft body"
          rows={3}
          value={form.body}
          onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
          className="border border-black/15 px-3 py-2 text-sm outline-none"
        />
        <button disabled={saving} className="inline-flex h-10 w-fit items-center gap-1 bg-black px-3 text-xs font-black uppercase text-white disabled:opacity-50">
          <Plus size={14} /> Save draft
        </button>
      </form>
    </div>
  );
}
