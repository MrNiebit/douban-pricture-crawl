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
        hostname: 'img3.doubanio.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img4.doubanio.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img5.doubanio.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img6.doubanio.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img7.doubanio.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img8.doubanio.com',
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
