"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export type CampaignSlide = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaLabel: string;
  ctaHref: string;
};

const AUTO_ADVANCE_MS = 6000;

export function CampaignCarousel({ slides }: { slides: CampaignSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % slides.length) + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, slides.length]);

  if (slides.length === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="RISE campaigns"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative overflow-hidden bg-[#0a0a0a]"
    >
      <div className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/50">Campaigns</p>
            <h2 className="mt-2 text-2xl font-black uppercase sm:text-3xl">Season drops</h2>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <button
              aria-label="Previous campaign"
              onClick={() => goTo(index - 1)}
              className="glass tap-scale grid size-11 place-items-center rounded-full text-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              aria-label="Next campaign"
              onClick={() => goTo(index + 1)}
              className="glass tap-scale grid size-11 place-items-center rounded-full text-white"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="relative mt-8 h-[70svh] min-h-[420px] w-full sm:h-[80svh]">
        {slides.map((slide, slideIndex) => (
          <div
            key={slide.id}
            aria-hidden={slideIndex !== index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              slideIndex === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              fill
              sizes="100vw"
              priority={slideIndex === 0}
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 px-4 pb-12 sm:px-6 sm:pb-14 lg:px-8">
              <div className="glass-strong mx-auto max-w-md rounded-[20px] p-7 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">{slide.subtitle}</p>
                <h3 className="mt-3 text-xl font-black uppercase leading-[1.05] sm:text-2xl lg:text-3xl">
                  {slide.title}
                </h3>
                <Link
                  href={slide.ctaHref}
                  className="tap-scale mt-6 inline-flex h-11 items-center gap-2 rounded-[20px] bg-white px-5 text-xs font-black uppercase tracking-[0.18em] text-black transition hover:bg-zinc-200"
                >
                  {slide.ctaLabel} <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-6 sm:px-6 lg:px-8">
        {slides.map((slide, slideIndex) => (
          <button
            key={slide.id}
            aria-label={`Go to campaign ${slideIndex + 1}`}
            aria-current={slideIndex === index}
            onClick={() => goTo(slideIndex)}
            className={`h-1.5 rounded-full transition-all ${
              slideIndex === index ? "w-8 bg-white" : "w-3 bg-white/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
