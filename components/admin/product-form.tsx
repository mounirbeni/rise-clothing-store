"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { ImageUploader, type ImageValue } from "@/components/admin/image-uploader";
import { CATEGORIES } from "@/lib/data/products";

export type ProductFormValue = {
  id?: string;
  name: string;
  description: string;
  category: string;
  collection: string;
  color: string;
  price: number;
  compareAt: number | null;
  featured: boolean;
  status: string;
  images: ImageValue[];
  variants: { size: string; stock: number }[];
};

const emptyProduct: ProductFormValue = {
  name: "",
  description: "",
  category: CATEGORIES[0],
  collection: "",
  color: "",
  price: 0,
  compareAt: null,
  featured: false,
  status: "active",
  images: [],
  variants: [{ size: "M", stock: 0 }],
};

export function ProductForm({ initial }: { initial?: ProductFormValue }) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormValue>(initial ?? emptyProduct);
  const [priceInput, setPriceInput] = useState(initial ? String(initial.price / 100) : "");
  const [compareInput, setCompareInput] = useState(initial?.compareAt ? String(initial.compareAt / 100) : "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(initial?.id);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      ...form,
      price: Math.round(parseFloat(priceInput || "0") * 100),
      compareAt: compareInput ? Math.round(parseFloat(compareInput) * 100) : null,
    };

    try {
      const res = await fetch(isEdit ? `/api/products/${initial!.id}` : "/api/products", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Could not save product");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save product");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-6">
      <div className="grid gap-4 border border-black/10 bg-white p-5 sm:grid-cols-2">
        <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-black/50">
          Name
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="h-11 border border-black/15 px-3 text-sm outline-none"
          />
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-black/50">
          Collection
          <input
            required
            value={form.collection}
            onChange={(e) => setForm((f) => ({ ...f, collection: e.target.value }))}
            className="h-11 border border-black/15 px-3 text-sm outline-none"
          />
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-black/50">
          Category
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="h-11 border border-black/15 px-3 text-sm outline-none"
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-black/50">
          Color
          <input
            required
            value={form.color}
            onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
            className="h-11 border border-black/15 px-3 text-sm outline-none"
          />
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-black/50">
          Price (USD)
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
            className="h-11 border border-black/15 px-3 text-sm outline-none"
          />
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-black/50">
          Compare-at price (optional)
          <input
            type="number"
            min="0"
            step="0.01"
            value={compareInput}
            onChange={(e) => setCompareInput(e.target.value)}
            className="h-11 border border-black/15 px-3 text-sm outline-none"
          />
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-black/50">
          Status
          <select
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            className="h-11 border border-black/15 px-3 text-sm outline-none"
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <label className="flex items-center gap-2 self-end pb-2 text-sm font-bold uppercase tracking-[0.1em] text-black/60">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
            className="size-4"
          />
          Feature on homepage
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-black/50 sm:col-span-2">
          Description
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="border border-black/15 px-3 py-2 text-sm outline-none"
          />
        </label>
      </div>

      <div className="border border-black/10 bg-white p-5">
        <h3 className="text-sm font-black uppercase tracking-[0.14em]">Images</h3>
        <div className="mt-4">
          <ImageUploader value={form.images} onChange={(images) => setForm((f) => ({ ...f, images }))} />
        </div>
      </div>

      <div className="border border-black/10 bg-white p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-[0.14em]">Sizes & inventory</h3>
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, variants: [...f.variants, { size: "", stock: 0 }] }))}
            className="inline-flex h-9 items-center gap-1 border border-black/15 px-3 text-xs font-black uppercase"
          >
            <Plus size={14} /> Add size
          </button>
        </div>
        <div className="mt-4 grid gap-2">
          {form.variants.map((variant, index) => (
            <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <input
                required
                placeholder="Size (e.g. M)"
                value={variant.size}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    variants: f.variants.map((v, i) => (i === index ? { ...v, size: e.target.value } : v)),
                  }))
                }
                className="h-11 border border-black/15 px-3 text-sm outline-none"
              />
              <input
                required
                type="number"
                min="0"
                placeholder="Stock"
                value={variant.stock}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    variants: f.variants.map((v, i) => (i === index ? { ...v, stock: Number(e.target.value) } : v)),
                  }))
                }
                className="h-11 border border-black/15 px-3 text-sm outline-none"
              />
              <button
                type="button"
                aria-label={`Remove size ${variant.size}`}
                onClick={() => setForm((f) => ({ ...f, variants: f.variants.filter((_, i) => i !== index) }))}
                className="grid size-11 place-items-center border border-black/15 text-black/50 hover:text-black"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex gap-3">
        <button
          disabled={submitting || form.images.length === 0}
          className="h-12 bg-black px-6 text-sm font-black uppercase tracking-[0.16em] text-white disabled:opacity-50"
        >
          {submitting ? "Saving..." : isEdit ? "Save changes" : "Create product"}
        </button>
      </div>
    </form>
  );
}
