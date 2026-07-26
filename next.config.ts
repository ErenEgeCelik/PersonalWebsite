import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // /research and /trades were folded into the home page and the papers.
      { source: "/research", destination: "/", permanent: true },
      { source: "/trades", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
