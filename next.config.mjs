import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
export default {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  },
  output: 'standalone',
  experimental: {
    instrumentationHook: true
  }
};
