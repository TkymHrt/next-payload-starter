import type { Metadata, Viewport } from "next";
import { Roboto_Mono } from "next/font/google";
import type React from "react";
import "./styles.css";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: true,
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Payload Blank Template",
  description:
    "A blank template using Payload CMS in a Next.js app with optimized performance.",
  openGraph: {
    title: "Payload Blank Template",
    description:
      "A blank template using Payload CMS in a Next.js app with optimized performance.",
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
  themeColor: "#000000",
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html className={robotoMono.variable} lang="ja">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
