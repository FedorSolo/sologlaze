import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.sologlazes.com.ar",
        pathname: "/cdn/shop/**",
      },
      // TODO: quitar una vez migradas las fotos a Cloudinary/UploadThing (ver PRD, sección 7).
    ],
  },
};

export default nextConfig;
