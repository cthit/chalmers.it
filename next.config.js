/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
    sassOptions: {
      includePaths: [path.join(__dirname, 'styles')],
    },
    output: "standalone",
    experimental: {
      instrumentationHook: true
    }
}

module.exports = nextConfig
