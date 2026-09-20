"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Check, Heart, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { useWishlist } from "@/components/providers/wishlist-provider";
import { formatCurrency, formatDate } from "@/lib/format";
import { ProductGrid } from "@/components/storefront/product-card";
import type { ProductCardData } from "@/lib/types";

function ProductGallery({ images, name }: { images: { url: string; alt: string | null }[]; name: string }) {
  const [active, setActive] = useState(0);
  const [loadedMap, setLoadedMap] = useState<Record<number, boolean>>({});
  const trackRef = useRef<HTMLDivElement>(null);

  function onScroll() {
    const el = trackRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActive(index);
  }

  function goTo(index: number) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth rounded-[20px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible"
      >
        {images.map((image, index) => (
          <div
            key={image.url + index}
            className="relative aspect-[4/5] w-full shrink-0 snap-center overflow-hidden rounded-[20px] bg-zinc-950 sm:shrink"
          >
            {!loadedMap[index] ? (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-zinc-800 to-zinc-900" />
            ) : null}
            <Image
              src={image.url}
              alt={image.alt || `${name} view ${index + 1}`}
              fill
              sizes="(min-width: 1024px) 34vw, 100vw"
              priority={index === 0}
              onLoad={() => setLoadedMap((m) => ({ ...m, [index]: true }))}
              className={`object-cover transition-opacity duration-300 ${loadedMap[index] ? "opacity-100" : "opacity-0"}`}
            />
          </div>
        ))}
      </div>
      {images.length > 1 ? (
        <div className="mt-3 flex items-center justify-center gap-1.5 sm:hidden">
          {images.map((_, index) => (
            <button
              key={index}
              aria-label={`View image ${index + 1}`}
              onClick={() => goTo(index)}
              className={`h-1.5 rounded-full transition-all ${index === active ? "w-6 bg-white" : "w-1.5 bg-white/30"}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

type ReviewData = { id: string; rating: number; title: string; body: string; author: string; createdAt: string };

export function ProductDetail({
  product,
  description,
  features,
  reviews,
  related,
}: {
  product: ProductCardData;
  description: string;
  features: string[];
  reviews: ReviewData[];
  related: ProductCardData[];
}) {
  const [size, setSize] = useState(product.variants[0]?.size ?? "OS");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [ctaInView, setCtaInView] = useState(true);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const [localReviews, setLocalReviews] = useState(reviews);
  const [reviewForm, setReviewForm] = useState({ author: "", title: "", body: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const selectedVariant = product.variants.find((v) => v.size === size);
  const stock = selectedVariant?.stock ?? 0;
  const wishlisted = isWishlisted(product.id);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setCtaInView(entry.isIntersecting), {
      rootMargin: "-1px 0px 0px 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function handleAddToBag() {
    if (stock === 0) return;
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url ?? "/images/product-hoodie.jpeg",
        color: product.color,
      },
      size,
      quantity,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  async function submitReview(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setReviewError(null);
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(reviewForm),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Could not submit review");
      setLocalReviews((current) => [body.data, ...current]);
      setReviewForm({ author: "", title: "", body: "", rating: 5 });
    } catch (error) {
      setReviewError(error instanceof Error ? error.message : "Could not submit review");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 pt-24 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <ProductGallery images={product.images} name={product.name} />
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-white/45">
            {product.category} / {product.color}
          </p>
          <h1 className="mt-4 text-3xl font-black uppercase leading-none sm:text-4xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <p className="text-xl font-black">{formatCurrency(product.price)}</p>
            {product.compareAt ? (
              <p className="text-base text-white/38 line-through">{formatCurrency(product.compareAt)}</p>
            ) : null}
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-white/65">
            <Star size={15} className="fill-white" /> {product.avgRating.toFixed(1)} / {product.reviewCount} reviews
          </div>
          <p className="mt-5 text-base leading-7 text-white/68">{description}</p>
          <div className="mt-7">
            <div className="mb-3 flex items-center justify-between text-sm font-bold uppercase tracking-[0.18em]">
              <span>Size</span>
              <span className="text-white/45">
                {stock === 0 ? "Out of stock" : stock > 20 ? "In stock" : `Low stock (${stock} left)`}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.size}
                  onClick={() => setSize(variant.size)}
                  disabled={variant.stock === 0}
                  className={`tap-scale h-11 rounded-[20px] text-sm font-black disabled:cursor-not-allowed disabled:opacity-30 ${
                    size === variant.size ? "bg-white text-black" : "glass text-white"
                  }`}
                >
                  {variant.size}
                </button>
              ))}
            </div>
          </div>
          <div ref={ctaRef} className="mt-5 grid grid-cols-[128px_1fr] gap-3">
            <div className="glass grid h-11 grid-cols-3 rounded-[20px]">
              <button aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus className="mx-auto" size={16} />
              </button>
              <span className="grid place-items-center text-sm font-black">{quantity}</span>
              <button aria-label="Increase quantity" onClick={() => setQuantity(Math.min(stock || 1, quantity + 1))}>
                <Plus className="mx-auto" size={16} />
              </button>
            </div>
            <button
              disabled={stock === 0}
              onClick={handleAddToBag}
              className={`tap-scale flex h-11 items-center justify-center gap-2 rounded-[20px] text-sm font-black uppercase tracking-[0.18em] transition disabled:opacity-40 ${
                added ? "bg-white text-black" : "bg-white text-black"
              }`}
            >
              {stock === 0 ? (
                "Out of stock"
              ) : added ? (
                <>
                  <Check size={17} /> Added to bag
                </>
              ) : (
                "Add to bag"
              )}
            </button>
          </div>
          <button
            onClick={() => toggle(product.id)}
            aria-pressed={wishlisted}
            className={`tap-scale mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-[20px] text-sm font-black uppercase tracking-[0.18em] ${
              wishlisted ? "bg-white text-black" : "glass text-white"
            }`}
          >
            <Heart size={17} className={wishlisted ? "fill-current" : ""} />{" "}
            {wishlisted ? "Saved to wishlist" : "Add to wishlist"}
          </button>
          <div className="mt-8 grid gap-3 border-t border-white/10 pt-6">
            {features.map((feature) => (
              <div key={feature} className="flex items-center justify-between border-b border-white/10 pb-3 text-sm">
                <span>{feature}</span>
                <span className="text-white/35">RISE spec</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div
        aria-hidden={ctaInView}
        className={`safe-x fixed inset-x-0 bottom-20 z-30 px-3 transition-all duration-300 lg:hidden ${
          ctaInView ? "pointer-events-none translate-y-4 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <div className="glass-strong mx-auto flex w-full max-w-md items-center gap-3 rounded-[20px] p-2.5 pl-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold uppercase tracking-[0.1em] text-white/55">{product.name}</p>
            <p className="text-sm font-black">{formatCurrency(product.price)}</p>
          </div>
          <button
            disabled={stock === 0}
            onClick={handleAddToBag}
            className="tap-scale flex h-11 shrink-0 items-center justify-center gap-2 rounded-[20px] bg-white px-5 text-xs font-black uppercase tracking-[0.14em] text-black disabled:opacity-40"
          >
            {added ? (
              <>
                <Check size={15} /> Added
              </>
            ) : (
              <>
                <ShoppingBag size={15} /> Add to bag
              </>
            )}
          </button>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-black uppercase">Reviews</h2>
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="grid gap-4">
            {localReviews.length === 0 ? (
              <p className="text-white/50">Be the first to review this product.</p>
            ) : (
              localReviews.map((review) => (
                <div key={review.id} className="glass rounded-[20px] p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-black">{review.title}</p>
                    <span className="inline-flex items-center gap-1 text-sm">
                      <Star size={14} className="fill-white" /> {review.rating}
                    </span>
                  </div>
                  <p className="mt-3 leading-7 text-white/65">{review.body}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.14em] text-white/40">
                    {review.author} / {formatDate(review.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>
          <form onSubmit={submitReview} className="glass h-fit rounded-[20px] p-5">
            <h3 className="text-base font-black uppercase">Write a review</h3>
            <div className="mt-4 grid gap-3">
              <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-white/50">
                Your name
                <input
                  required
                  value={reviewForm.author}
                  onChange={(e) => setReviewForm((f) => ({ ...f, author: e.target.value }))}
                  className="h-11 rounded-[20px] rounded-[20px] border border-white/15 bg-transparent px-3 text-sm text-white outline-none"
                />
              </label>
              <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-white/50">
                Rating
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm((f) => ({ ...f, rating: Number(e.target.value) }))}
                  className="h-11 rounded-[20px] rounded-[20px] border border-white/15 bg-transparent px-3 text-sm text-white outline-none"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n} className="bg-black">
                      {n} stars
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-white/50">
                Headline
                <input
                  required
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
                  className="h-11 rounded-[20px] rounded-[20px] border border-white/15 bg-transparent px-3 text-sm text-white outline-none"
                />
              </label>
              <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-white/50">
                Review
                <textarea
                  required
                  rows={4}
                  value={reviewForm.body}
                  onChange={(e) => setReviewForm((f) => ({ ...f, body: e.target.value }))}
                  className="rounded-[20px] rounded-[20px] border border-white/15 bg-transparent px-3 py-2 text-sm text-white outline-none"
                />
              </label>
              {reviewError ? <p className="text-sm text-red-400">{reviewError}</p> : null}
              <button
                type="submit"
                disabled={submitting}
                className="tap-scale h-11 rounded-[20px] bg-white text-sm font-black uppercase tracking-[0.16em] text-black disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit review"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {related.length ? (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-2xl font-black uppercase">Related products</h2>
          <ProductGrid products={related} />
        </section>
      ) : null}
    </>
  );
}
