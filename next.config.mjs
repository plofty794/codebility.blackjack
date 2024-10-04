/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.deckofcardsapi.com",
      },
    ],
  },
};

export default nextConfig;
