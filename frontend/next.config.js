const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 您的Next.js配置
  // 移除过时的appDir配置
};

const sentryWebpackPluginOptions = {
  // 额外的Sentry配置选项
  silent: true, // 抑制构建时的Sentry日志
  org: "your-org-name",
  project: "eattoday-frontend",
};

// 确保Sentry配置正确导出
module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions); 