import { NextConfig } from 'next';
import path from 'path';
import {
  DEFAULT_MAX_UPLOAD_SIZE_BYTES,
  parsePositiveIntEnv
} from './src/utils/env';

const maxUploadSizeBytes = parsePositiveIntEnv(
  process.env.MAX_UPLOAD_SIZE,
  DEFAULT_MAX_UPLOAD_SIZE_BYTES
);
const serverActionOverheadBytes = 1024 * 1024;

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
      bodySizeLimit: maxUploadSizeBytes + serverActionOverheadBytes
    }
  },
  output: 'standalone'
};

export default config;
