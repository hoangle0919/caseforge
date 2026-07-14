import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the workspace root — without this, Turbopack walks up from cwd and
    // can pick a stray lockfile in the home directory as the root instead.
    root: path.join(__dirname),
  },
};

export default nextConfig;
