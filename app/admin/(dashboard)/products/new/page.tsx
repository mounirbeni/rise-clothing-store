import { ProductForm } from "@/components/admin/product-form";

export const metadata = { title: "New product" };

export default function Page() {
  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.18em] text-black/45">Catalog</p>
      <h1 className="mt-2 text-4xl font-black uppercase leading-none">New product</h1>
      <div className="mt-6 max-w-3xl">
        <ProductForm />
      </div>
    </div>
  );
}
