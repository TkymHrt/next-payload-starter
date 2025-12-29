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
  images: {
    remotePatterns: getRemotePatterns(),
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
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
