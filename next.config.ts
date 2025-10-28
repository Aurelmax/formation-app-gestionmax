import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Configuration pour déploiement rapide
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Mode standalone pour conteneurisation (désactivé pour Vercel)
  // output: 'standalone', // Uncomment for Docker/self-hosted deployments
  // Désactiver React strict mode pour éviter les doubles rendus
  reactStrictMode: false,
  // Headers pour permettre la persistance des cookies de session Payload
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: 'http://localhost:3010' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS,PUT,DELETE,PATCH' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, Cookie' },
        ],
      },
      {
        source: '/admin/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: 'http://localhost:3010' },
        ],
      },
    ]
  },
}

export default withPayload(nextConfig)
