/** @type {import('next').NextConfig} */
require("next-logger")
const path = require('path')

const nextConfig = {
    sassOptions: {
      includePaths: [path.join(__dirname, 'styles')],
    },
    output: "standalone",
    experimental: {
      serverComponentsExternalPackages: ['next-logger', 'pino', 'pino-pretty', 'colorette'],
   }
}

module.exports = nextConfig
