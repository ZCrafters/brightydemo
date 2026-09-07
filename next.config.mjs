/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**.tokopedia-static.net" },
      { protocol: "https", hostname: "images.tokopedia.net" },
      { protocol: "https", hostname: "**.ibyteimg.com" },
    ],
  },
  trailingSlash: true,
};
export default nextConfig;
