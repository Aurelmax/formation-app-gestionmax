import type { NextConfig } from "next";
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['mongoose'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Désactiver le service worker automatique
  experimental: {
    esmExternals: false,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('mongoose')
    }
    return config
  },
};

export default withPayload(nextConfig);
