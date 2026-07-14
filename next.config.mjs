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
      {
        pathname: "/uploads/**",
        search: "",
      },
      {
        pathname: "/images/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
