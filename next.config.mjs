import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const config = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@use "@/styles/variables.scss" as *;`
  },
  output: 'standalone',
  experimental: {
    instrumentationHook: true
  }
};

export default config;
