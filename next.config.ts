import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Superseded sections. /work and /writing replaced them; the old
      // detail URLs keep working because the slugs are unchanged.
      // The two crypto-bot entries merged into one project.
      { source: "/work/market-maker", destination: "/work/crypto-mm", permanent: true },
      { source: "/work/binary-mm", destination: "/work/crypto-mm", permanent: true },
      { source: "/case-studies", destination: "/work", permanent: true },
      { source: "/case-studies/weather-prediction-markets", destination: "/work/weather", permanent: true },
      { source: "/case-studies/world-cup-group-markets", destination: "/work/worldcup", permanent: true },
      { source: "/whitepapers", destination: "/writing", permanent: true },
      { source: "/whitepapers/:slug", destination: "/writing/:slug", permanent: true },
      { source: "/blog", destination: "/writing", permanent: true },
      { source: "/blog/:slug", destination: "/writing/:slug", permanent: true },
      { source: "/research", destination: "/work", permanent: true },
      { source: "/trades", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
