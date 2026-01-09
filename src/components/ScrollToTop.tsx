"use client";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "react-aria-components";
import { tv } from "tailwind-variants";
import { focusRing } from "@/lib/react-aria-utils";

const scrollButton = tv({
  extend: focusRing,
  base: "fixed right-6 bottom-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:bg-blue-700",
  variants: {
    isVisible: {
      true: "translate-y-0 opacity-100",
      false: "pointer-events-none translate-y-4 opacity-0",
    },
  },
  defaultVariants: {
    isVisible: false,
  },
});

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolled down 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button
      aria-label="トップへ戻る"
      className={scrollButton({ isVisible })}
      onPress={scrollToTop}
    >
      <ArrowUp className="h-6 w-6" />
    </Button>
  );
}
