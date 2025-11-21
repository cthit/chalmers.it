import { NextConfig } from 'next';
import path from 'path';

const config: NextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@use "@/styles/variables.scss" as *;`
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb'
    }
  },
  output: 'standalone'
};

export default config;
