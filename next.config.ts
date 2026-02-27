
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "standalone", // Disabled standalone mode
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dashboard-sdgs.kemendesa.go.id",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
