"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart, Minus, Plus, Star } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { useWishlist } from "@/components/providers/wishlist-provider";
import { formatCurrency, formatDate } from "@/lib/format";
import { ProductGrid } from "@/components/storefront/product-card";
import type { ProductCardData } from "@/lib/types";

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
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const [localReviews, setLocalReviews] = useState(reviews);
  const [reviewForm, setReviewForm] = useState({ author: "", title: "", body: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const selectedVariant = product.variants.find((v) => v.size === size);
  const stock = selectedVariant?.stock ?? 0;
  const wishlisted = isWishlisted(product.id);

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
        <div className="grid gap-4 sm:grid-cols-2">
          {product.images.map((image, index) => (
            <div key={image.url + index} className="relative aspect-[4/5] overflow-hidden bg-zinc-950">
              <Image
                src={image.url}
                alt={image.alt || `${product.name} view ${index + 1}`}
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
          <h1 className="mt-4 text-5xl font-black uppercase leading-none sm:text-6xl">{product.name}</h1>
          <div className="mt-5 flex items-center gap-3">
            <p className="text-2xl font-black">{formatCurrency(product.price)}</p>
            {product.compareAt ? (
              <p className="text-lg text-white/38 line-through">{formatCurrency(product.compareAt)}</p>
            ) : null}
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-white/65">
            <Star size={16} className="fill-white" /> {product.avgRating.toFixed(1)} / {product.reviewCount} reviews
          </div>
          <p className="mt-6 text-lg leading-8 text-white/68">{description}</p>
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
                  className={`h-12 border text-sm font-black disabled:cursor-not-allowed disabled:opacity-30 ${
                    size === variant.size ? "border-white bg-white text-black" : "border-white/15 text-white"
                  }`}
                >
                  {variant.size}
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
              <button aria-label="Increase quantity" onClick={() => setQuantity(Math.min(stock || 1, quantity + 1))}>
                <Plus className="mx-auto" size={16} />
              </button>
            </div>
            <button
              disabled={stock === 0}
              onClick={() =>
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
                )
              }
              className="h-12 bg-white text-sm font-black uppercase tracking-[0.18em] text-black disabled:opacity-40"
            >
              {stock === 0 ? "Out of stock" : "Add to bag"}
            </button>
          </div>
          <button
            onClick={() => toggle(product.id)}
            aria-pressed={wishlisted}
            className={`mt-3 flex h-12 w-full items-center justify-center gap-2 border text-sm font-black uppercase tracking-[0.18em] ${
              wishlisted ? "border-white bg-white text-black" : "border-white/15"
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

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-3xl font-black uppercase">Reviews</h2>
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="grid gap-4">
            {localReviews.length === 0 ? (
              <p className="text-white/50">Be the first to review this product.</p>
            ) : (
              localReviews.map((review) => (
                <div key={review.id} className="border border-white/10 p-5">
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
          <form onSubmit={submitReview} className="h-fit border border-white/10 p-5">
            <h3 className="text-lg font-black uppercase">Write a review</h3>
            <div className="mt-4 grid gap-3">
              <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-white/50">
                Your name
                <input
                  required
                  value={reviewForm.author}
                  onChange={(e) => setReviewForm((f) => ({ ...f, author: e.target.value }))}
                  className="h-11 border border-white/15 bg-transparent px-3 text-sm text-white outline-none"
                />
              </label>
              <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-white/50">
                Rating
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm((f) => ({ ...f, rating: Number(e.target.value) }))}
                  className="h-11 border border-white/15 bg-transparent px-3 text-sm text-white outline-none"
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
                  className="h-11 border border-white/15 bg-transparent px-3 text-sm text-white outline-none"
                />
              </label>
              <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-white/50">
                Review
                <textarea
                  required
                  rows={4}
                  value={reviewForm.body}
                  onChange={(e) => setReviewForm((f) => ({ ...f, body: e.target.value }))}
                  className="border border-white/15 bg-transparent px-3 py-2 text-sm text-white outline-none"
                />
              </label>
              {reviewError ? <p className="text-sm text-red-400">{reviewError}</p> : null}
              <button
                type="submit"
                disabled={submitting}
                className="h-11 bg-white text-sm font-black uppercase tracking-[0.16em] text-black disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit review"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {related.length ? (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-black uppercase">Related products</h2>
          <ProductGrid products={related} />
        </section>
      ) : null}
    </>
  );
}
