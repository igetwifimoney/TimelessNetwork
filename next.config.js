/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
          domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
    },
    async rewrites() {
          return [
            { source: '/trading', destination: '/trading.html' },
                ]
    },
}

module.exports = nextConfig
