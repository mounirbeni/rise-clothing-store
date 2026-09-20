"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const AUTO_ADVANCE_MS = 5000;

export function HeroCarousel({ images, children }: { images: string[]; children: React.ReactNode }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="relative min-h-[82svh] overflow-hidden lg:min-h-[88svh]">
      {images.map((src, imageIndex) => (
        <div
          key={src}
          aria-hidden={imageIndex !== index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            imageIndex === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt="RISE performance clothing campaign"
            fill
            priority={imageIndex === 0}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-black/5" />
      <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#050505] to-transparent" />
      {children}
      {images.length > 1 ? (
        <div className="absolute bottom-6 right-4 z-10 flex items-center gap-2 sm:right-6 lg:right-8">
          {images.map((src, dotIndex) => (
            <button
              key={src}
              aria-label={`Show hero image ${dotIndex + 1}`}
              aria-current={dotIndex === index}
              onClick={() => setIndex(dotIndex)}
              className={`h-1.5 rounded-full transition-all ${
                dotIndex === index ? "w-8 bg-white" : "w-3 bg-white/35"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
