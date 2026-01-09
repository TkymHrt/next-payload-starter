import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { getPayload } from "payload";
import type React from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollToTop } from "@/components/ScrollToTop";
import config from "@/payload.config";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: true,
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "第45回技大祭",
  description: "第45回技大祭の公式ウェブサイトです。",
  openGraph: {
    title: "第45回技大祭",
    description: "第45回技大祭の公式ウェブサイトです。",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1e40af",
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  // Fetch site config - cast to any until types are regenerated
  const siteConfig = (await payload.findGlobal({
    slug: "site-config" as const,
    depth: 1,
  })) as {
    siteName?: string | null;
    logo?: { url?: string | null } | number | null;
    address?: string | null;
    socialLinks?: Array<{
      platform?: string | null;
      url?: string | null;
    }> | null;
    footerLinks?: Array<{ label?: string | null; url?: string | null }> | null;
    copyright?: string | null;
  };

  const logoUrl =
    typeof siteConfig.logo === "object" && siteConfig.logo?.url
      ? siteConfig.logo.url
      : null;

  const socialLinks = siteConfig.socialLinks?.map((link) => ({
    platform: link.platform as "twitter" | "instagram" | "facebook",
    url: link.url || "",
  }));

  const footerLinks = siteConfig.footerLinks?.map((link) => ({
    label: link.label || "",
    url: link.url || "",
  }));

  return (
    <html className={notoSansJP.variable} lang="ja">
      <body className="flex min-h-screen flex-col">
        <Header logoUrl={logoUrl} siteName={siteConfig.siteName || undefined} />
        <main className="flex-1 pt-20">{children}</main>
        <Footer
          address={siteConfig.address}
          copyright={siteConfig.copyright}
          footerLinks={footerLinks}
          logoUrl={logoUrl}
          siteName={siteConfig.siteName || undefined}
          socialLinks={socialLinks}
        />
        <ScrollToTop />
      </body>
    </html>
  );
}
