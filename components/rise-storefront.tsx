"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  Heart,
  Home,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { categories, products, type RiseProduct } from "@/lib/rise-data";
import { formatCurrency } from "@/lib/format";

type BagItem = RiseProduct & {
  size: string;
  quantity: number;
};

const mobileNavItems: { icon: LucideIcon; label: string; href?: string }[] = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Search, label: "Search", href: "/shop" },
  { icon: ShoppingBag, label: "Bag" },
  { icon: Heart, label: "Saved", href: "/account" },
  { icon: User, label: "Account", href: "/account" },
];

export function SiteHeader({
  onBagOpen,
  bagCount = 0,
}: {
  onBagOpen?: () => void;
  bagCount?: number;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ["Shop", "/shop"],
    ["Collection", "/collection"],
    ["Story", "/story"],
    ["Journal", "/journal"],
    ["Admin", "/admin"],
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-black/72 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className="grid size-10 place-items-center border border-white/10 text-white lg:hidden"
        >
          <Menu size={19} />
        </button>
        <Link href="/" className="text-xl font-black tracking-[0.28em]">
          RISE
        </Link>
        <div className="hidden items-center gap-8 text-sm font-semibold uppercase tracking-[0.18em] text-white/70 lg:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-white">
              {label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Link
            aria-label="Search"
            href="/shop"
            className="hidden size-10 place-items-center text-white/80 transition hover:bg-white/10 hover:text-white sm:grid"
          >
            <Search size={19} />
          </Link>
          <Link
            aria-label="Account"
            href="/account"
            className="hidden size-10 place-items-center text-white/80 transition hover:bg-white/10 hover:text-white sm:grid"
          >
            <User size={19} />
          </Link>
          <button
            aria-label="Open shopping bag"
            onClick={onBagOpen}
            className="relative grid size-10 place-items-center text-white/90 transition hover:bg-white/10"
          >
            <ShoppingBag size={19} />
            {bagCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-white text-[11px] font-black text-black">
                {bagCount}
              </span>
            ) : null}
          </button>
        </div>
      </nav>
      {menuOpen ? (
        <div className="fixed inset-0 z-50 bg-black lg:hidden">
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
            <span className="font-black tracking-[0.28em]">RISE</span>
            <button
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="grid size-10 place-items-center border border-white/10"
            >
              <X size={19} />
            </button>
          </div>
          <div className="grid gap-1 p-4">
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-white/10 py-5 text-3xl font-black uppercase"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

export function MobileNav({ onBagOpen }: { onBagOpen?: () => void }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-white/10 bg-black/88 px-2 py-2 backdrop-blur-xl lg:hidden">
      {mobileNavItems.map(({ icon: Icon, label, href }) => {
        const content = (
          <>
            <Icon size={18} />
            {label}
          </>
        );
        const className =
          "flex h-12 flex-col items-center justify-center gap-1 text-[11px] font-bold text-white/70";

        return href ? (
          <Link key={label} href={href} className={className}>
            {content}
          </Link>
        ) : (
          <button key={label} onClick={onBagOpen} className={className}>
            {content}
          </button>
        );
      })}
    </div>
  );
}

export function StorefrontHome() {
  const bag = useBag();
  const featured = products.slice(0, 4);

  return (
    <main className="min-h-screen bg-[#050505] pb-20 text-[#f7f7f2] lg:pb-0">
      <SiteHeader onBagOpen={() => bag.setBagOpen(true)} bagCount={bag.count} />
      <section className="relative min-h-[94svh] overflow-hidden">
        <Image
          src="/images/hero.jpeg"
          alt="RISE athlete wearing black performance clothing"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/48" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#050505] to-transparent" />
        <div className="relative z-10 mx-auto flex min-h-[94svh] max-w-7xl items-end px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.28em] text-white/72">
              Fall training collection
            </p>
            <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.88] sm:text-7xl lg:text-8xl">
              More Than Yesterday
            </h1>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="inline-flex h-12 items-center justify-center gap-2 bg-white px-6 text-sm font-black uppercase tracking-[0.18em] text-black transition hover:bg-zinc-200"
              >
                Shop drop <ChevronRight size={17} />
              </Link>
              <Link
                href="/collection"
                className="inline-flex h-12 items-center justify-center border border-white/25 px-6 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
              >
                View campaign
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-white/50">
              New arrivals
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase sm:text-5xl">
              Built for motion
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em]"
          >
            All products <ChevronRight size={16} />
          </Link>
        </div>
        <ProductGrid products={featured} addToBag={bag.addToBag} />
      </section>

      <section className="grid min-h-[620px] lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative min-h-[420px]">
          <Image
            src="/images/campaign.jpeg"
            alt="RISE black and white campaign scene"
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex items-center bg-[#101010] px-4 py-12 sm:px-10 lg:px-14">
          <div className="max-w-lg">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-white/45">
              Discipline collection
            </p>
            <h2 className="mt-4 text-4xl font-black uppercase leading-none sm:text-6xl">
              Quiet gear for loud effort
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/65">
              RISE is designed around sharp silhouettes, heavy contrast, and durable layers that
              move from training to street without losing the discipline of the brand.
            </p>
            <Link
              href="/collection"
              className="mt-8 inline-flex h-12 items-center justify-center bg-white px-6 text-sm font-black uppercase tracking-[0.18em] text-black"
            >
              Explore collection
            </Link>
          </div>
        </div>
      </section>

      <BrandPillars />
      <SiteFooter />
      <MobileNav onBagOpen={() => bag.setBagOpen(true)} />
      <CartDrawer {...bag} />
    </main>
  );
}

export function ShopPage() {
  const bag = useBag();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [sort, setSort] = useState("featured");

  const filtered = useMemo(() => {
    const matches = products.filter((product) => {
      const byCategory = category === "All" || product.category === category;
      const byQuery = [product.name, product.category, product.color].some((value) =>
        value.toLowerCase().includes(query.toLowerCase()),
      );
      return byCategory && byQuery;
    });

    return [...matches].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "stock") return b.stock - a.stock;
      return b.rating - a.rating;
    });
  }, [category, query, sort]);

  return (
    <main className="min-h-screen bg-[#050505] pb-20 text-[#f7f7f2] lg:pb-0">
      <SiteHeader onBagOpen={() => bag.setBagOpen(true)} bagCount={bag.count} />
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-28 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-white/45">
              Catalog
            </p>
            <h1 className="mt-3 text-5xl font-black uppercase leading-none sm:text-7xl">
              Performance clothing
            </h1>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_180px] lg:w-[520px]">
            <label className="flex h-12 items-center gap-3 border border-white/15 px-4">
              <Search size={18} className="text-white/45" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search RISE"
                className="w-full bg-transparent text-sm outline-none placeholder:text-white/35"
              />
            </label>
            <label className="relative flex h-12 items-center border border-white/15 px-4">
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="w-full appearance-none bg-transparent text-sm outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price low</option>
                <option value="price-desc">Price high</option>
                <option value="stock">Stock</option>
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-4" />
            </label>
          </div>
        </div>
        <div className="my-6 flex gap-2 overflow-x-auto pb-1">
          {["All", ...categories].map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`h-10 shrink-0 border px-4 text-xs font-black uppercase tracking-[0.16em] ${
                category === item
                  ? "border-white bg-white text-black"
                  : "border-white/15 text-white/65"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mb-5 flex items-center justify-between text-sm text-white/50">
          <span>{filtered.length} products</span>
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal size={16} /> Filters live
          </span>
        </div>
        {filtered.length ? (
          <ProductGrid products={filtered} addToBag={bag.addToBag} />
        ) : (
          <EmptyState title="No product found" text="Try another category or search term." />
        )}
      </section>
      <SiteFooter />
      <MobileNav onBagOpen={() => bag.setBagOpen(true)} />
      <CartDrawer {...bag} />
    </main>
  );
}

export function ProductDetail({ product }: { product: RiseProduct }) {
  const bag = useBag();
  const [size, setSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);

  return (
    <main className="min-h-screen bg-[#050505] pb-20 text-[#f7f7f2] lg:pb-0">
      <SiteHeader onBagOpen={() => bag.setBagOpen(true)} bagCount={bag.count} />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 pt-24 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {product.images.map((image, index) => (
            <div key={image} className="relative aspect-[4/5] overflow-hidden bg-zinc-950">
              <Image
                src={image}
                alt={`${product.name} view ${index + 1}`}
                fill
                sizes="(min-width: 1024px) 34vw, 100vw"
                priority={index === 0}
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-white/45">
            {product.category} / {product.color}
          </p>
          <h1 className="mt-4 text-5xl font-black uppercase leading-none sm:text-6xl">
            {product.name}
          </h1>
          <div className="mt-5 flex items-center gap-3">
            <p className="text-2xl font-black">{formatCurrency(product.price)}</p>
            {product.compareAt ? (
              <p className="text-lg text-white/38 line-through">{formatCurrency(product.compareAt)}</p>
            ) : null}
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-white/65">
            <Star size={16} className="fill-white" /> {product.rating} / {product.reviews} reviews
          </div>
          <p className="mt-6 text-lg leading-8 text-white/68">{product.description}</p>
          <div className="mt-7">
            <div className="mb-3 flex items-center justify-between text-sm font-bold uppercase tracking-[0.18em]">
              <span>Size</span>
              <span className="text-white/45">{product.stock > 30 ? "In stock" : "Low stock"}</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((item) => (
                <button
                  key={item}
                  onClick={() => setSize(item)}
                  className={`h-12 border text-sm font-black ${
                    size === item ? "border-white bg-white text-black" : "border-white/15 text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5 grid grid-cols-[128px_1fr] gap-3">
            <div className="grid h-12 grid-cols-3 border border-white/15">
              <button aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus className="mx-auto" size={16} />
              </button>
              <span className="grid place-items-center text-sm font-black">{quantity}</span>
              <button aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="mx-auto" size={16} />
              </button>
            </div>
            <button
              onClick={() => {
                for (let i = 0; i < quantity; i += 1) bag.addToBag(product, size);
              }}
              className="h-12 bg-white text-sm font-black uppercase tracking-[0.18em] text-black"
            >
              Add to bag
            </button>
          </div>
          <button className="mt-3 flex h-12 w-full items-center justify-center gap-2 border border-white/15 text-sm font-black uppercase tracking-[0.18em]">
            <Heart size={17} /> Add to wishlist
          </button>
          <div className="mt-8 grid gap-3 border-t border-white/10 pt-6">
            {product.features.map((feature) => (
              <div key={feature} className="flex items-center justify-between border-b border-white/10 pb-3 text-sm">
                <span>{feature}</span>
                <span className="text-white/35">RISE spec</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-3xl font-black uppercase">Related products</h2>
        <ProductGrid products={products.filter((item) => item.id !== product.id).slice(0, 4)} addToBag={bag.addToBag} />
      </section>
      <MobileNav onBagOpen={() => bag.setBagOpen(true)} />
      <CartDrawer {...bag} />
    </main>
  );
}

export function ProductGrid({
  products: items,
  addToBag,
}: {
  products: RiseProduct[];
  addToBag: (product: RiseProduct, size?: string) => void;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} addToBag={addToBag} />
      ))}
    </div>
  );
}

function ProductCard({
  product,
  addToBag,
}: {
  product: RiseProduct;
  addToBag: (product: RiseProduct, size?: string) => void;
}) {
  const [size, setSize] = useState(product.sizes[0]);

  return (
    <article className="group">
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-zinc-900">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 bg-black/60 px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] backdrop-blur">
          {product.stock < 35 ? "Low stock" : product.collection}
        </span>
      </Link>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <Link href={`/product/${product.slug}`} className="font-bold hover:underline">
            {product.name}
          </Link>
          <p className="mt-1 text-sm text-white/50">
            {product.category} / {product.color}
          </p>
        </div>
        <p className="font-bold">{formatCurrency(product.price)}</p>
      </div>
      <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
        <label className="relative flex h-11 items-center border border-white/15 px-3">
          <select
            aria-label={`Select size for ${product.name}`}
            value={size}
            onChange={(event) => setSize(event.target.value)}
            className="w-full appearance-none bg-transparent text-sm font-bold outline-none"
          >
            {product.sizes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <ChevronDown size={15} className="pointer-events-none absolute right-3" />
        </label>
        <button
          aria-label={`Save ${product.name}`}
          className="grid size-11 place-items-center border border-white/15 text-white transition hover:bg-white hover:text-black"
        >
          <Heart size={17} />
        </button>
      </div>
      <button
        onClick={() => addToBag(product, size)}
        className="mt-2 flex h-11 w-full items-center justify-center gap-2 border border-white/18 text-sm font-black uppercase tracking-[0.16em] transition hover:bg-white hover:text-black"
      >
        Add to bag
      </button>
    </article>
  );
}

function useBag() {
  const [bagOpen, setBagOpen] = useState(false);
  const [bag, setBag] = useState<BagItem[]>([]);
  const total = useMemo(() => bag.reduce((sum, item) => sum + item.price * item.quantity, 0), [bag]);
  const count = useMemo(() => bag.reduce((sum, item) => sum + item.quantity, 0), [bag]);

  function addToBag(product: RiseProduct, size = product.sizes[0]) {
    setBag((items) => {
      const match = items.find((item) => item.id === product.id && item.size === size);
      if (match) {
        return items.map((item) =>
          item.id === product.id && item.size === size ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...items, { ...product, size, quantity: 1 }];
    });
    setBagOpen(true);
  }

  function updateQuantity(productId: string, size: string, delta: number) {
    setBag((items) =>
      items
        .map((item) =>
          item.id === productId && item.size === size ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  return { bag, bagOpen, setBagOpen, total, count, addToBag, updateQuantity };
}

function CartDrawer({
  bag,
  bagOpen,
  setBagOpen,
  total,
  updateQuantity,
}: ReturnType<typeof useBag>) {
  return (
    <>
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-[#090909] shadow-2xl transition duration-300 ${
          bagOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <h2 className="text-lg font-black uppercase tracking-[0.18em]">Bag</h2>
          <button
            aria-label="Close shopping bag"
            onClick={() => setBagOpen(false)}
            className="grid size-10 place-items-center text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {bag.length === 0 ? (
            <EmptyState
              icon={<ShoppingBag size={34} className="text-white/35" />}
              title="Your bag is empty"
              text="Choose a size, add a piece, and the checkout summary will appear here."
            />
          ) : (
            <div className="space-y-5">
              {bag.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                  <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-zinc-900">
                    <Image src={item.images[0]} alt={item.name} fill sizes="96px" className="object-cover" />
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
                        className="grid size-9 place-items-center border border-white/15"
                      >
                        <Minus size={15} />
                      </button>
                      <button
                        aria-label={`Add one ${item.name}`}
                        onClick={() => updateQuantity(item.id, item.size, 1)}
                        className="grid size-9 place-items-center border border-white/15"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-white/10 p-5">
          <div className="mb-4 flex justify-between text-lg font-black">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <Link
            href="/checkout"
            className={`grid h-12 place-items-center bg-white text-sm font-black uppercase tracking-[0.18em] text-black ${
              !bag.length ? "pointer-events-none opacity-40" : ""
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
          className="fixed inset-0 z-40 hidden bg-black/55 lg:block"
        />
      ) : null}
    </>
  );
}

export function BrandPillars() {
  return (
    <section className="mx-auto grid max-w-7xl gap-5 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8 lg:py-24">
      {[
        ["01", "Performance weight", "Heavy enough to hold shape. Flexible enough for daily movement."],
        ["02", "Monochrome identity", "A strict black and white system keeps the product, body, and message in focus."],
        ["03", "Drop rhythm", "Small seasonal capsules built around training, recovery, and the outdoors."],
      ].map(([number, title, text]) => (
        <div key={number} className="border-t border-white/15 pt-6">
          <p className="text-sm font-black text-white/35">{number}</p>
          <h3 className="mt-8 text-2xl font-black uppercase">{title}</h3>
          <p className="mt-4 leading-7 text-white/60">{text}</p>
        </div>
      ))}
    </section>
  );
}

export function EmptyState({
  title,
  text,
  icon,
}: {
  title: string;
  text: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center border border-white/10 p-8 text-center">
      {icon}
      <p className="mt-4 text-lg font-bold">{title}</p>
      <p className="mt-2 max-w-xs text-sm leading-6 text-white/45">{text}</p>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 px-4 py-10 pb-28 sm:px-6 lg:px-8 lg:pb-10">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_2fr]">
        <div>
          <p className="text-3xl font-black tracking-[0.28em]">RISE</p>
          <p className="mt-3 text-sm uppercase tracking-[0.18em] text-white/45">
            Worldwide performance clothing
          </p>
        </div>
        <div className="grid gap-3 text-sm uppercase tracking-[0.16em] text-white/56 sm:grid-cols-3">
          <Link href="/faq">FAQ</Link>
          <Link href="/shipping-returns">Shipping & Returns</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
