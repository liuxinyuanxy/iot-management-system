/**
 * @link https://nextjs.org/docs/api-reference/next.config.js/introduction
 */

/** @type {import("next").NextConfig} */
const config = {
  serverRuntimeConfig: {
    // Will only be available on the server side
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    WORKOS_CLIENT_ID: process.env.WORKOS_CLIENT_ID,
    WORKOS_API_KEY: process.env.WORKOS_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    APP_URL: process.env.APP_URL,
  },
  /** We run eslint as a separate task in CI */
  eslint: { ignoreDuringBuilds: !!process.env.CI },
};

module.exports = config;
