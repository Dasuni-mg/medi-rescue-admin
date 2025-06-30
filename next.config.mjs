/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true
      },
      {
        source: '/auth',
        destination: '/auth/login',
        permanent: true
      },
      {
        source: '/manage',
        destination: '/home',
        permanent: true
      }
    ];
  },
  distDir: './.next', // Changes the build output directory to `./dist`.
  images: {
    unoptimized: true // Enable image optimization
  },
  output: 'standalone'
};

export default nextConfig;
