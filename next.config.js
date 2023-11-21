/** @type {import('next').NextConfig} */
const path = require("path");
// const { i18n } = require('./next-i18next.config')
const nextConfig = {
  images: {
    unoptimized: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  env: {
    API_BASEURL: process.env.API_BASEURL,
    PAPERTRADING_API_BASEURL: process.env.PAPERTRADING_API_BASEURL,
    ENVIRONMENT_LOCALHOST: process.env.ENVIRONMENT_LOCALHOST,
    ENVIRONMENT_STAGING: process.env.ENVIRONMENT_STAGING,
    ENVIRONMENT_CF: process.env.ENVIRONMENT_CF,
    ENVIRONMENT_UAT: process.env.ENVIRONMENT_UAT,
    API_BENZINGA_URL: process.env.API_BENZINGA_URL,
    // assetPrefix: "https://sensamarket.com",
  },
  //i18n,
  output: "export",
  trailingSlash: true,
};
module.exports = nextConfig;
