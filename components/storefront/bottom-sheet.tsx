"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <button
        aria-hidden={!open}
        aria-label="Close"
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        aria-hidden={!open}
        className={`glass-strong safe-bottom fixed inset-x-0 bottom-0 z-[70] flex max-h-[80svh] w-full flex-col rounded-t-[20px] text-[#f7f7f2] transition-transform duration-300 sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-h-[85svh] sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:rounded-[20px] ${
          open
            ? "translate-y-0 sm:-translate-y-1/2 sm:opacity-100"
            : "translate-y-full sm:-translate-y-[42%] sm:opacity-0"
        }`}
      >
        <div className="flex justify-center pb-1 pt-2.5 sm:hidden">
          <span className="h-1.5 w-10 rounded-full bg-white/25" />
        </div>
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-5">
          <h2 className="text-base font-black uppercase tracking-[0.14em]">{title}</h2>
          <button
            aria-label="Close"
            onClick={onClose}
            className="tap-scale grid size-9 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </>
  );
}
