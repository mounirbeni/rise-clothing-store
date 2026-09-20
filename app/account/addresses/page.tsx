import { redirect } from "next/navigation";
import { MapPin, Trash2 } from "lucide-react";
import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Saved addresses" };

export default async function Page() {
  const session = await getSession();
  if (!session || session.role !== "customer") redirect("/account/login");

  const addresses = await prisma.address.findMany({
    where: { userId: session.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <StorefrontShell>
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-white/45">Account</p>
        <h1 className="mt-4 text-3xl font-black uppercase leading-none sm:text-4xl">Saved addresses</h1>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="grid gap-4">
            {addresses.length === 0 ? (
              <EmptyState
                icon={<MapPin size={34} className="text-white/35" />}
                title="No addresses saved"
                text="Add a shipping address to speed up checkout."
              />
            ) : (
              addresses.map((address) => (
                <div key={address.id} className="grid gap-2 glass rounded-[20px] p-5 sm:grid-cols-[1fr_auto]">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-black">{address.label}</p>
                      {address.isDefault ? (
                        <span className="border border-white/20 px-2 py-1 text-xs font-black uppercase">Default</span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/60">
                      {address.fullName}
                      <br />
                      {address.line1}
                      {address.line2 ? `, ${address.line2}` : ""}
                      <br />
                      {address.city}, {address.region} {address.postal}
                      <br />
                      {address.country}
                    </p>
                  </div>
                  <form action={`/api/account/addresses/${address.id}`} method="post">
                    <button
                      aria-label={`Delete ${address.label} address`}
                      className="flex h-10 items-center gap-2 rounded-[20px] border border-white/15 px-3 text-xs font-black uppercase tracking-[0.12em] text-white/60 hover:text-white"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </form>
                </div>
              ))
            )}
          </div>
          <form action="/api/account/addresses" method="post" className="h-fit glass rounded-[20px] p-5">
            <h2 className="text-lg font-black uppercase">Add address</h2>
            <div className="mt-4 grid gap-3">
              {[
                ["label", "Label (e.g. Home)"],
                ["fullName", "Full name"],
                ["line1", "Address line"],
                ["city", "City"],
                ["region", "State / Region"],
                ["postal", "Postal code"],
                ["country", "Country"],
                ["phone", "Phone"],
              ].map(([name, placeholder]) => (
                <input
                  key={name}
                  name={name}
                  required={name !== "phone"}
                  placeholder={placeholder}
                  className="h-11 rounded-[20px] border border-white/15 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/35"
                />
              ))}
              <label className="flex items-center gap-2 text-sm text-white/60">
                <input type="checkbox" name="isDefault" className="size-4" /> Set as default address
              </label>
              <button className="tap-scale h-11 rounded-[20px] bg-white text-sm font-black uppercase tracking-[0.16em] text-black">
                Save address
              </button>
            </div>
          </form>
        </div>
      </section>
    </StorefrontShell>
  );
}
