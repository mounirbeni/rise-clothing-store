"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", orderNumber: "", message: "" });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", orderNumber: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="grid gap-4 border border-white/10 p-5">
        <p className="text-2xl font-black uppercase">Message sent</p>
        <p className="leading-7 text-white/62">
          Thanks for reaching out. The RISE support team responds within one business day.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="h-11 w-fit border border-white/15 px-5 text-sm font-black uppercase tracking-[0.14em]"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4 border border-white/10 p-5">
      <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.14em] text-white/55">
        Name
        <input
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="h-12 border border-white/15 bg-transparent px-3 text-base text-white outline-none"
        />
      </label>
      <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.14em] text-white/55">
        Email
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="h-12 border border-white/15 bg-transparent px-3 text-base text-white outline-none"
        />
      </label>
      <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.14em] text-white/55">
        Order number (optional)
        <input
          value={form.orderNumber}
          onChange={(e) => setForm((f) => ({ ...f, orderNumber: e.target.value }))}
          className="h-12 border border-white/15 bg-transparent px-3 text-base text-white outline-none"
        />
      </label>
      <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.14em] text-white/55">
        Message
        <textarea
          required
          rows={6}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          className="border border-white/15 bg-transparent p-3 text-base text-white outline-none"
        />
      </label>
      {status === "error" ? <p className="text-sm text-red-400">Something went wrong. Please try again.</p> : null}
      <button
        disabled={status === "sending"}
        className="h-12 bg-white text-sm font-black uppercase tracking-[0.18em] text-black disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
