import { Mail, MapPin, MessageSquare } from "lucide-react";
import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { ContactForm } from "@/components/storefront/contact-form";

export const metadata = { title: "Contact" };

export default function Page() {
  return (
    <StorefrontShell>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-white/45">Contact</p>
          <h1 className="mt-4 text-5xl font-black uppercase leading-none sm:text-7xl">Talk to RISE</h1>
          <div className="mt-8 grid gap-4 text-white/64">
            <p className="flex items-center gap-3"><Mail size={18} /> support@rise.test</p>
            <p className="flex items-center gap-3"><MapPin size={18} /> 184 Mercer St, New York, NY</p>
            <p className="flex items-center gap-3"><MessageSquare size={18} /> Response target: 1 business day</p>
          </div>
        </div>
        <ContactForm />
      </section>
    </StorefrontShell>
  );
}
