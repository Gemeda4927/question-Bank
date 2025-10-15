const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  compress: true,

  env: {
    NEXT_PUBLIC_APP_NAME: 'ExamB',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
}

export default nextConfig
