import { NextConfig } from 'next';
import path from 'path';

const config: NextConfig = {
  agentRules: false,
  compiler: {
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
    }
  },
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
