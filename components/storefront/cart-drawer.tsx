"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { formatCurrency } from "@/lib/format";
import { EmptyState } from "@/components/ui/empty-state";

export function CartDrawer() {
  const { lines, bagOpen, setBagOpen, subtotal, updateQuantity, removeItem } = useCart();

  return (
    <>
      <aside
        role="dialog"
        aria-label="Shopping bag"
        aria-hidden={!bagOpen}
        className={`panel-strong safe-bottom fixed inset-x-0 bottom-0 z-50 flex max-h-[85svh] w-full flex-col rounded-t-[20px] text-[#f7f7f2] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:inset-x-auto lg:inset-y-0 lg:right-0 lg:max-h-none lg:w-full lg:max-w-md lg:translate-y-0 lg:rounded-none lg:border-l lg:border-white/10 ${
          bagOpen ? "translate-y-0 lg:translate-x-0" : "translate-y-full lg:translate-x-full"
        }`}
      >
        <div className="flex justify-center pb-1 pt-2.5 lg:hidden">
          <span className="h-1.5 w-10 rounded-full bg-white/25" />
        </div>
        <div className="flex h-14 items-center justify-between border-b border-white/10 px-5">
          <h2 className="text-lg font-black uppercase tracking-[0.18em]">Bag</h2>
          <button
            aria-label="Close shopping bag"
            onClick={() => setBagOpen(false)}
            className="tap-scale grid size-10 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {lines.length === 0 ? (
            <EmptyState
              icon={<ShoppingBag size={34} className="text-white/35" />}
              title="Your bag is empty"
              text="Choose a size, add a piece, and the checkout summary will appear here."
            />
          ) : (
            <div className="space-y-5">
              {lines.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                  <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-[20px] bg-zinc-900">
                    <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between gap-3">
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="font-bold">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                      <p className="mt-1 text-sm text-white/45">
                        Size {item.size} / Qty {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        aria-label={`Remove one ${item.name}`}
                        onClick={() => updateQuantity(item.id, item.size, -1)}
                        className="glass tap-scale grid size-9 place-items-center rounded-full"
                      >
                        <Minus size={15} />
                      </button>
                      <button
                        aria-label={`Add one ${item.name}`}
                        onClick={() => updateQuantity(item.id, item.size, 1)}
                        className="glass tap-scale grid size-9 place-items-center rounded-full"
                      >
                        <Plus size={15} />
                      </button>
                      <button
                        aria-label={`Remove ${item.name} from bag`}
                        onClick={() => removeItem(item.id, item.size)}
                        className="ml-auto text-xs font-bold uppercase tracking-[0.12em] text-white/45 hover:text-white"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="safe-bottom border-t border-white/10 p-5">
          <div className="mb-4 flex justify-between text-lg font-black">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <Link
            href="/checkout"
            onClick={() => setBagOpen(false)}
            className={`tap-scale grid h-12 place-items-center rounded-[20px] bg-white text-sm font-black uppercase tracking-[0.18em] text-black ${
              !lines.length ? "pointer-events-none opacity-40" : ""
            }`}
          >
            Checkout
          </Link>
        </div>
      </aside>
      {bagOpen ? (
        <button
          aria-label="Close bag overlay"
          onClick={() => setBagOpen(false)}
          className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm"
        />
      ) : null}
    </>
  );
}
