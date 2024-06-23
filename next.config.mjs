/** @type {import('next').NextConfig} */
const nextConfig = {
    output:"standalone",
    transpilePackages: ['json-diff-ts'],
    serverRuntimeConfig:{

    }
};

export default nextConfig;
