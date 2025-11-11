import { NextConfig } from 'next';
import path from 'path';

const config: NextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@use "@/styles/variables.scss" as *;`
  },
  output: 'standalone'
};

export default config;
