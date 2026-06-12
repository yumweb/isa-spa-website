/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
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
