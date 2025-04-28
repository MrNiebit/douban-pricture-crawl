import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img1.doubanio.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img2.doubanio.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img9.doubanio.com',
        pathname: '/**',
      },
    ],
  }
};

export default nextConfig;
