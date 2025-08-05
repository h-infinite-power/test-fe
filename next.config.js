/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    API_BASE_URL: process.env.API_BASE_URL || "https://h-infinite-power.store/",
  },
  // 에러 처리를 위한 페이지 설정
  onDemandEntries: {
    // 서버 사이드 페이지 캐시 개발용 설정
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 4,
  },
  // 페이지 리다이렉션 설정
  async redirects() {
    return [
      {
        source: "/root",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
