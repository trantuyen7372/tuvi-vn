function contentSecurityPolicy({nonce,development=false,https=false}={}) {
  const scripts=nonce ? `'self' 'nonce-${nonce}' 'strict-dynamic'` : "'self' 'unsafe-inline'";
  return [
    "default-src 'self'",
    `script-src ${scripts}${development?" 'unsafe-eval'":''}`,
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    `connect-src 'self'${development?' ws:':''}`,
    "object-src 'none'", "base-uri 'none'", "form-action 'self'", "frame-ancestors 'none'",
    ...(https?['upgrade-insecure-requests']:[]),
  ].join('; ');
}
module.exports={contentSecurityPolicy};
