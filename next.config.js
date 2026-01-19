/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http', // Allowed because your error shows http
        hostname: 'backend-sealco.runasp.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'backend-sealco.runasp.net',
        pathname: '/**',
      },
      // Keep your existing patterns below
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '49206',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '49206',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.sealco-leb.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;