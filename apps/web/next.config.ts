import type { NextConfig } from 'next';
import path from 'path';

const config: NextConfig = {
  outputFileTracingRoot: path.resolve(import.meta.dirname, '../../'),
  transpilePackages: ['@postgen/core', '@postgen/ai', '@postgen/shared'],
  serverExternalPackages: ['@resvg/resvg-js', 'sharp', 'simple-git'],
  webpack: (webpackConfig) => {
    webpackConfig.externals = [...(webpackConfig.externals || []), '@resvg/resvg-js', 'sharp'];
    return webpackConfig;
  },
};

export default config;
