import { Facebook, Instagram, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SocialLink {
  platform: "twitter" | "instagram" | "facebook";
  url: string;
}

interface FooterLink {
  label: string;
  url: string;
}

interface FooterProps {
  logoUrl?: string | null;
  siteName?: string;
  address?: string | null;
  socialLinks?: SocialLink[] | null;
  footerLinks?: FooterLink[] | null;
  copyright?: string | null;
}

const socialIcons = {
  twitter: Twitter,
  instagram: Instagram,
  facebook: Facebook,
};

export function Footer({
  logoUrl,
  siteName = "第45回技大祭",
  address,
  socialLinks,
  footerLinks,
  copyright = "© 2026 技大祭実行委員会",
}: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          {logoUrl ? (
            <Image
              alt={siteName}
              className="h-12 w-auto brightness-0 invert"
              height={60}
              src={logoUrl}
              width={180}
            />
          ) : (
            <span className="font-bold text-2xl">{siteName}</span>
          )}
        </div>

        {/* SNS Links */}
        {socialLinks && socialLinks.length > 0 && (
          <div className="mb-8 flex justify-center gap-6">
            {socialLinks.map((link) => {
              const Icon = socialIcons[link.platform];
              return (
                <a
                  aria-label={link.platform}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                  href={link.url}
                  key={link.platform}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        )}

        {/* Footer Links */}
        {footerLinks && footerLinks.length > 0 && (
          <nav className="mb-8 flex flex-wrap justify-center gap-4 text-sm">
            {footerLinks.map((link) => (
              <Link
                className="text-gray-300 transition-colors hover:text-white"
                href={link.url}
                key={link.url}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Address */}
        {address && (
          <address className="mb-8 whitespace-pre-line text-center text-gray-400 text-sm not-italic">
            {address}
          </address>
        )}

        {/* Copyright */}
        <p className="text-center text-gray-500 text-sm">{copyright}</p>
      </div>
    </footer>
  );
}
