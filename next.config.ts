import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // The reported Texas event was promoted to an official evidence brief.
    // Preserve its old permalink rather than resurrecting superseded wording.
    return ["", "/en"].map((prefix) => ({
      source: `${prefix}/rumors/texas-data-center-interconnection-audit-2026`,
      destination: `${prefix}/policy/us-texas-data-center-audit-2026`,
      permanent: true,
    }));
  },
};

export default nextConfig;
