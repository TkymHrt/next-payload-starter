"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Sponsor {
  id: number;
  name: string;
  logo?: { url?: string | null } | null;
  url?: string | null;
}

interface SponsorCarouselProps {
  sponsors: Sponsor[];
  speed?: number; // pixels per second
}

export function SponsorCarousel({
  sponsors,
  speed = 50,
}: SponsorCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Filter sponsors with logos
  const sponsorsWithLogo = sponsors.filter((s) => s.logo?.url);

  useEffect(() => {
    if (sponsorsWithLogo.length === 0) return;

    const container = containerRef.current;
    if (!container) return;

    // Calculate the width of one set of sponsors
    const firstChild = container.firstElementChild as HTMLElement;
    if (!firstChild) return;

    const setWidth = firstChild.offsetWidth;

    let animationFrame: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      if (!isPaused) {
        const delta = (currentTime - lastTime) / 1000;
        setTranslateX((prev) => {
          const next = prev - speed * delta;
          // Reset when one full set has scrolled
          if (Math.abs(next) >= setWidth) {
            return next + setWidth;
          }
          return next;
        });
      }
      lastTime = currentTime;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [speed, isPaused, sponsorsWithLogo.length]);

  if (sponsorsWithLogo.length === 0) {
    return null;
  }

  // Duplicate sponsors for seamless loop
  const duplicatedSponsors = [...sponsorsWithLogo, ...sponsorsWithLogo];

  return (
    <div
      className="overflow-hidden py-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex"
        ref={containerRef}
        style={{ transform: `translateX(${translateX}px)` }}
      >
        <div className="flex shrink-0 gap-8">
          {duplicatedSponsors.map((sponsor, index) => {
            const content = (
              <div className="flex h-16 w-32 items-center justify-center rounded-lg bg-white p-2 shadow-sm">
                {sponsor.logo?.url && (
                  <Image
                    alt={sponsor.name}
                    className="max-h-12 w-auto object-contain"
                    height={48}
                    src={sponsor.logo.url}
                    width={120}
                  />
                )}
              </div>
            );

            if (sponsor.url) {
              return (
                <Link
                  className="transition-transform hover:scale-105"
                  href={sponsor.url}
                  key={`${sponsor.id}-${index}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div className="shrink-0" key={`${sponsor.id}-${index}`}>
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
