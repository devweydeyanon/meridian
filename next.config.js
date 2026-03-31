/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Serve static banking pages at clean URLs
      { source: '/', destination: '/static/index.html' },
      { source: '/business', destination: '/static/business.html' },
      { source: '/corporate', destination: '/static/corporate.html' },
      { source: '/login', destination: '/static/login.html' },
      { source: '/contact', destination: '/static/contact.html' },
      { source: '/help', destination: '/static/help.html' },
      { source: '/faqs', destination: '/static/faqs.html' },
      { source: '/branches', destination: '/static/branches.html' },
      { source: '/security', destination: '/static/security.html' },
      { source: '/privacy', destination: '/static/privacy.html' },
      { source: '/terms', destination: '/static/terms.html' },
      { source: '/enroll', destination: '/static/enroll.html' },
      { source: '/open-account', destination: '/static/open-account.html' },
      { source: '/forgot-password', destination: '/static/forgot-password.html' },
      // Personal banking
      { source: '/personal/:path*', destination: '/static/personal/:path*' },
      // Business banking
      { source: '/business/:path*', destination: '/static/business/:path*' },
      // Corporate
      { source: '/corporate/:path*', destination: '/static/corporate/:path*' },
      // Insights/blog
      { source: '/insights/:path*', destination: '/static/insights/:path*' },
    ];
  },
};

module.exports = nextConfig;
