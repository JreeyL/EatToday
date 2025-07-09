const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js configuration
  // Removed deprecated appDir configuration
};

const sentryWebpackPluginOptions = {
  // Additional Sentry configuration options
  silent: true, // Suppress Sentry logs during build
  org: "your-org-name",
  project: "eattoday-frontend",
};

// Ensure Sentry configuration is properly exported
module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions); 