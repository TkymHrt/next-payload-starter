"use client";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { focusRing } from "@/lib/react-aria-utils";

const navItems = [
  { label: "トップ", href: "/" },
  { label: "挨拶", href: "/greeting" },
  { label: "アクセス", href: "/access" },
  { label: "マップ", href: "/map" },
  { label: "イベント", href: "/events" },
  { label: "展示・体験", href: "/exhibitions" },
  { label: "食品販売", href: "/food" },
  { label: "物品販売", href: "/goods" },
  { label: "企業ブース", href: "/corporate" },
  { label: "協賛一覧", href: "/sponsors" },
];

const menuButton = tv({
  extend: focusRing,
  base: "flex h-10 w-10 items-center justify-center rounded-lg bg-white/80 backdrop-blur-sm transition-colors hover:bg-white",
});

const navLink = tv({
  base: "block rounded-lg px-4 py-3 font-medium text-gray-800 text-lg transition-colors hover:bg-gray-100",
});

interface HeaderProps {
  logoUrl?: string | null;
  siteName?: string;
}

export function Header({ logoUrl, siteName = "第45回技大祭" }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 p-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link
          className="flex items-center gap-2 rounded-lg bg-white/80 px-3 py-2 backdrop-blur-sm transition-colors hover:bg-white"
          href="/"
        >
          {logoUrl ? (
            <Image
              alt={siteName}
              className="h-8 w-auto"
              height={40}
              src={logoUrl}
              width={120}
            />
          ) : (
            <span className="font-bold text-gray-800 text-lg">{siteName}</span>
          )}
        </Link>

        {/* Hamburger Menu */}
        <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
          <Button aria-label="メニューを開く" className={menuButton()}>
            <Menu className="h-6 w-6 text-gray-800" />
          </Button>
          <ModalOverlay
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
            isDismissable
          >
            <Modal className="fixed top-0 right-0 bottom-0 w-80 transform bg-white shadow-2xl transition-transform">
              <Dialog className="flex h-full flex-col outline-none">
                {({ close }) => (
                  <>
                    <div className="flex items-center justify-between border-b p-4">
                      <span className="font-bold text-lg">{siteName}</span>
                      <Button
                        aria-label="メニューを閉じる"
                        className={menuButton()}
                        onPress={close}
                      >
                        <X className="h-6 w-6 text-gray-800" />
                      </Button>
                    </div>
                    <nav className="flex-1 overflow-y-auto p-4">
                      <ul className="space-y-1">
                        {navItems.map((item) => (
                          <li key={item.href}>
                            <Link
                              className={navLink()}
                              href={item.href}
                              onClick={close}
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </>
                )}
              </Dialog>
            </Modal>
          </ModalOverlay>
        </DialogTrigger>
      </div>
    </header>
  );
}
