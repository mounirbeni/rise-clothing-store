"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { X } from "lucide-react";

export function CustomerEditor({ customerId, tags, notes }: { customerId: string; tags: string[]; notes: string }) {
  const router = useRouter();
  const [currentTags, setCurrentTags] = useState(tags);
  const [tagInput, setTagInput] = useState("");
  const [noteText, setNoteText] = useState(notes);
  const [saving, setSaving] = useState(false);

  async function save(nextTags = currentTags, nextNotes = noteText) {
    setSaving(true);
    await fetch(`/api/customers/${customerId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ tags: nextTags, notes: nextNotes }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="border border-black/10 bg-white p-5">
      <h3 className="text-sm font-black uppercase tracking-[0.14em]">Tags & notes</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {currentTags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 bg-black px-2 py-1 text-xs font-black uppercase text-white">
            {tag}
            <button
              aria-label={`Remove tag ${tag}`}
              onClick={() => {
                const next = currentTags.filter((t) => t !== tag);
                setCurrentTags(next);
                save(next, noteText);
              }}
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!tagInput.trim()) return;
          const next = [...currentTags, tagInput.trim()];
          setCurrentTags(next);
          setTagInput("");
          save(next, noteText);
        }}
        className="mt-3 flex gap-2"
      >
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="Add tag (e.g. VIP)"
          className="h-10 flex-1 border border-black/15 px-3 text-sm outline-none"
        />
        <button className="h-10 border border-black/15 px-4 text-xs font-black uppercase">Add</button>
      </form>

      <label className="mt-5 grid gap-1 text-xs font-bold uppercase tracking-[0.1em] text-black/50">
        Internal notes
        <textarea
          rows={4}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          className="border border-black/15 px-3 py-2 text-sm outline-none"
        />
      </label>
      <button
        disabled={saving}
        onClick={() => save()}
        className="mt-3 h-10 bg-black px-4 text-xs font-black uppercase tracking-[0.12em] text-white disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save notes"}
      </button>
    </div>
  );
}
