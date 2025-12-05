/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'images.unsplash.com',
      'lh3.googleusercontent.com',
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  webpack: (config, { isServer }) => {
    // Fix for Firebase/undici private fields issue
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        undici: false,
      }
    }
    
    // Ignore undici in client bundle
    config.externals = config.externals || []
    if (!isServer) {
      config.externals.push({
        'undici': 'commonjs undici',
      })
    }
    
    return config
  },
}

module.exports = nextConfig