/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // @isa/shared ships TypeScript source; let Next compile it.
  transpilePackages: ["@isa/shared"],
  // The shared package uses ESM `.js` import specifiers (correct for Node/tsx),
  // so teach webpack to resolve `./x.js` -> `./x.ts`.
  webpack: (config) => {
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js"],
      ".jsx": [".tsx", ".jsx"],
    };
    return config;
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Add the CMS media host(s) here once known (S3/R2 public URL).
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  // Legacy isaspa.in URL preservation is driven by the CMS `redirects` table;
  // wire dynamic redirects via middleware or a generated list at build time.
  async redirects() {
    return [];
  },
};

module.exports = nextConfig;
