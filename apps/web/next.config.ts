import type { NextConfig } from 'next';

const config: NextConfig = {
  transpilePackages: ['@postgen/core', '@postgen/ai', '@postgen/shared'],
  serverExternalPackages: ['sharp', '@resvg/resvg-js', 'simple-git'],
};

export default config;
