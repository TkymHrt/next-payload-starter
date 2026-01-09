"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Button } from "react-aria-components";
import { tv } from "tailwind-variants";
import { focusRing } from "@/lib/react-aria-utils";

interface CarouselItem {
  id: number | string;
  image?: { url?: string | null; alt?: string } | null;
  title?: string;
  link?: string;
}

interface MainCarouselProps {
  items: CarouselItem[];
  autoPlayInterval?: number; // milliseconds
}

const navButton = tv({
  extend: focusRing,
  base: "-translate-y-1/2 absolute top-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-sm transition-colors hover:bg-white",
});

const indicator = tv({
  base: "h-2 w-2 rounded-full transition-colors",
  variants: {
    isActive: {
      true: "bg-white",
      false: "bg-white/50",
    },
  },
});

export function MainCarousel({
  items,
  autoPlayInterval = 5000,
}: MainCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (isPaused || items.length <= 1) return;

    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isPaused, items.length, autoPlayInterval, goToNext]);

  if (items.length === 0) {
    return null;
  }

  const currentItem = items[currentIndex];

  return (
    <div
      className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-gray-100"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Image */}
      {currentItem?.image?.url && (
        <Image
          alt={currentItem.image.alt || currentItem.title || ""}
          className="object-cover transition-opacity duration-500"
          fill
          priority
          src={currentItem.image.url}
        />
      )}

      {/* Optional overlay with title */}
      {currentItem?.title && (
        <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-6">
          <h3 className="font-bold text-2xl text-white">{currentItem.title}</h3>
        </div>
      )}

      {/* Navigation Buttons */}
      {items.length > 1 && (
        <>
          <Button
            aria-label="前へ"
            className={navButton({ className: "left-4" })}
            onPress={goToPrev}
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </Button>
          <Button
            aria-label="次へ"
            className={navButton({ className: "right-4" })}
            onPress={goToNext}
          >
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </Button>
        </>
      )}

      {/* Indicators */}
      {items.length > 1 && (
        <div className="-translate-x-1/2 absolute bottom-4 left-1/2 flex gap-2">
          {items.map((_, index) => (
            <button
              aria-label={`スライド ${index + 1}`}
              className={indicator({ isActive: index === currentIndex })}
              key={`indicator-${items[index]?.id || index}`}
              onClick={() => goToIndex(index)}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  );
}
