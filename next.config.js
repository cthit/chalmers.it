/** @type {import('next').NextConfig} */
require("next-logger")
const path = require('path')

const nextConfig = {
    sassOptions: {
      includePaths: [path.join(__dirname, 'styles')],
    },
}

module.exports = nextConfig
