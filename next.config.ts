import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@deck.gl/react", "@deck.gl/core", "@deck.gl/layers"],
};

export default nextConfig;
