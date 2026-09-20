"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Archive } from "lucide-react";

export function ArchiveButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      disabled={busy}
      onClick={async () => {
        if (!confirm("Archive this product? It will be hidden from the storefront.")) return;
        setBusy(true);
        await fetch(`/api/products/${productId}`, { method: "DELETE" });
        router.refresh();
      }}
      className="inline-flex h-9 items-center gap-1 border border-black/15 px-3 text-xs font-black uppercase text-black/60 hover:text-black disabled:opacity-50"
    >
      <Archive size={14} /> {busy ? "Archiving..." : "Archive"}
    </button>
  );
}
