/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Ensure turbopack uses this folder as the workspace root
    root: import.meta.dirname,
  },
};

export default nextConfig;
