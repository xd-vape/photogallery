/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/api/images/**/asset",
        search: "?variant=thumbnail",
      },
      {
        pathname: "/api/images/**/asset",
        search: "?variant=display",
      },
    ],
  },
};

export default nextConfig;
