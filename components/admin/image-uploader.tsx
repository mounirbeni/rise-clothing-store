"use client";

import Image from "next/image";
import { useState } from "react";
import { Trash2, Upload } from "lucide-react";

export type ImageValue = { url: string; alt: string };

export function ImageUploader({ value, onChange }: { value: ImageValue[]; onChange: (next: ImageValue[]) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: formData });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Upload failed");
      onChange([...value, { url: body.url, alt: file.name }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {value.map((image, index) => (
          <div key={image.url + index} className="group relative aspect-square overflow-hidden border border-black/15 bg-white">
            <Image src={image.url} alt={image.alt || "Product"} fill sizes="120px" className="object-cover" />
            <button
              type="button"
              aria-label={`Remove image ${index + 1}`}
              onClick={() => onChange(value.filter((_, i) => i !== index))}
              className="absolute right-1 top-1 grid size-7 place-items-center bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <label className="grid aspect-square cursor-pointer place-items-center border border-dashed border-black/25 text-black/40 hover:border-black/50 hover:text-black/60">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleFile(file);
              event.target.value = "";
            }}
          />
          <span className="flex flex-col items-center gap-1 text-xs font-bold uppercase">
            <Upload size={18} /> {uploading ? "Uploading..." : "Upload"}
          </span>
        </label>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="flex gap-2">
        <input
          placeholder="Or paste an image URL and press Enter"
          className="h-10 flex-1 border border-black/15 bg-white px-3 text-sm outline-none"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              const target = event.currentTarget;
              if (target.value.trim()) {
                onChange([...value, { url: target.value.trim(), alt: "" }]);
                target.value = "";
              }
            }
          }}
        />
      </div>
    </div>
  );
}
