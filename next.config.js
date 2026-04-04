/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Root pages
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
      { source: '/enroll-credentials', destination: '/static/enroll-credentials.html' },
      { source: '/enroll-security', destination: '/static/enroll-security.html' },
      { source: '/enroll-complete', destination: '/static/enroll-complete.html' },
      { source: '/open-account', destination: '/static/open-account.html' },
      { source: '/open-account-employment', destination: '/static/open-account-employment.html' },
      { source: '/open-account-review', destination: '/static/open-account-review.html' },
      { source: '/open-account-fund', destination: '/static/open-account-fund.html' },
      { source: '/open-account-complete', destination: '/static/open-account-complete.html' },
      { source: '/forgot-password', destination: '/static/forgot-password.html' },
      { source: '/verify-code', destination: '/static/verify-code.html' },
      { source: '/reset-password', destination: '/static/reset-password.html' },
      // Subdirectory pages
      { source: '/personal/:path*', destination: '/static/personal/:path*' },
      { source: '/business/:path*', destination: '/static/business/:path*' },
      { source: '/corporate/:path*', destination: '/static/corporate/:path*' },
      { source: '/insights/:path*', destination: '/static/insights/:path*' },
    ];
  },
};

module.exports = nextConfig;
