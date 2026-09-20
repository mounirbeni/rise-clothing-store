"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

const SPRING = { type: "spring" as const, damping: 32, stiffness: 340 };

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
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            aria-label="Close"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 90 || info.velocity.y > 600) onClose();
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={SPRING}
            className="panel-strong safe-bottom fixed inset-x-0 bottom-0 z-[70] flex max-h-[80svh] w-full flex-col rounded-t-[20px] text-[#f7f7f2] sm:inset-x-auto sm:bottom-8 sm:left-1/2 sm:max-h-[75svh] sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:rounded-[20px]"
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
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
