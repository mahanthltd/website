import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A self-contained server under .next/standalone (server.js plus only the
  // node_modules it actually imports) so docker/web.Dockerfile's runtime
  // stage can carry that instead of the whole dependency tree.
  output: "standalone",
  poweredByHeader: false,
};

export default nextConfig;
