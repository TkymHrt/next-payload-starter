import { withPayload } from "@payloadcms/next/withPayload";

const getRemotePatterns = () => {
  const endpoint = process.env.S3_ENDPOINT;
  if (!endpoint) {
    return [];
  }

  try {
    const url = new URL(endpoint);
    return [
      {
        protocol: url.protocol.replace(":", ""),
        hostname: url.hostname,
        port: url.port || undefined,
        pathname: "/**",
      },
    ];
  } catch (_error) {
    console.warn(
      `⚠️ Invalid S3_ENDPOINT provided: ${endpoint}. Images may not load.`
    );
    return [];
  }
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  output: "standalone",
  reactStrictMode: true,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
  images: {
    remotePatterns: getRemotePatterns(),
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    reactCompiler: true,
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        {
          key: "X-DNS-Prefetch-Control",
          value: "on",
        },
        {
          key: "X-Frame-Options",
          value: "SAMEORIGIN",
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
      ],
    },
  ],
  webpack: (config) => {
    config.resolve.extensionAlias = {
      ".cjs": [".cts", ".cjs"],
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };
    return config;
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
