/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', destination: '/chooser.html' },
      ],
      afterFiles: [
        { source: '/trading', destination: '/trading.html' },
        { source: '/account', destination: '/account.html' },
        { source: '/network', destination: '/' },
      ],
      fallback: [],
    }
  },
}

module.exports = nextConfig
