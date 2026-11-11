# Security: Saúl Hernández Portfolio

Status: Complete

## Authentication method

- Site: none. Public, read-only, no accounts, no forms.
- AWS (CDK and deploys): IAM Identity Center (SSO) with MFA; `aws sso login` gives short-lived credentials. No long-lived access keys on disk or in the repo.
- Root account: MFA enabled, never used for daily work.
- GitHub: 2FA on the `sahc1987` account.

## Roles and permissions matrix

| Actor                           | Site | S3 bucket                   | CloudFront         | Route 53 / ACM   | GitHub repo   |
| ------------------------------- | ---- | --------------------------- | ------------------ | ---------------- | ------------- |
| Visitor                         | Read | No direct access (OAC only) | Via HTTPS          | None             | Read (public) |
| Saúl (SSO admin permission set) | Read | Read/write                  | Invalidate, manage | Manage           | Owner         |
| CloudFront (OAC)                | n/a  | `s3:GetObject` only         | n/a                | n/a              | n/a           |
| Root user                       | n/a  | Break-glass only            | Break-glass only   | Break-glass only | n/a           |

## Sensitive data inventory and how it is protected

| Data                                         | Where                                     | Protection                                                                         |
| -------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------- |
| Email                                        | Page, CV PDFs                             | Public by choice; `mailto:` link                                                   |
| Phone (WhatsApp)                             | WhatsApp button `wa.me/<number>`, CV PDFs | Public by choice; accepted spam risk; number never shown as plain text on the page |
| LinkedIn / GitHub URLs                       | Page                                      | Public                                                                             |
| Home address                                 | Nowhere                                   | Never published; location stays "San Salvador, El Salvador"                        |
| CentralDesk details                          | Case study text                           | No URL, no screenshots, no store data, no customer data, no internal names         |
| AWS account ID, bucket name, distribution ID | CDK outputs                               | Not committed; read from stack outputs at deploy time                              |
| CV PDF metadata                              | PDFs                                      | Author/title metadata checked before upload; no tracked changes or comments        |

## Secrets management

- The site has no secrets. `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is public by design.
- AWS credentials come only from SSO sessions.
- `.env*` git-ignored; `.env.example` committed with placeholders.
- GitHub secret scanning and push protection on.

## Input validation

- No user input reaches the site (no forms, no query params used).
- Content is validated at build time: `tsc` on the `Content` type plus the content test (see DATABASE.md).
- All outbound links are `https:` (except `mailto:`); external links use `rel="noopener noreferrer"`.

## Rate limiting and abuse

- CloudFront absorbs traffic; no origin compute to exhaust.
- S3 bucket blocks all public access; only CloudFront OAC can read.
- No AWS WAF (cost not justified for a static site).
- AWS Budget alarm at USD 5/month (created in CDK), email to Saúl at 80% actual and 100% forecast.

## Logging and monitoring

- Umami: page views and CTA click events, cookieless, no IP stored by Umami.
- No CloudFront access logs (not selected).
- Never logged or tracked: email contents, WhatsApp messages, visitor identity, full IP addresses, query strings.

## HTTP security headers (CloudFront response headers policy)

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- CSP is split in two because Next's static export emits inline scripts:
  - Per page, a `<meta http-equiv="Content-Security-Policy">` written at build time (`site/scripts/csp-hashes.mjs`): `default-src 'self'; script-src 'self' 'sha256-…'` (one hash per inline script, plus the Umami origin only when analytics is on); `style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'` (+ Umami); `object-src 'none'; base-uri 'self'; form-action 'none'; upgrade-insecure-requests`. No `unsafe-inline` for scripts (tested).
  - CloudFront header: `frame-ancestors 'none'; base-uri 'self'; form-action 'none'; object-src 'none'` (directives a meta tag cannot carry), plus `X-Frame-Options: DENY`.
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- HTTPS only (viewer protocol policy redirect-to-https); TLS 1.2 minimum.

## Dependency scanning

- Dependabot alerts on the repo.
- `npm audit --omit=dev` runs inside `npm run deploy`; high or critical findings stop the deploy.
- As few dependencies as possible (Next, React, Tailwind, CDK, test tools).

## Compliance needs

- No personal data collected from visitors; cookieless analytics, so no cookie banner.
- Content honesty rules: no claims that are not on the CV, no passed-certification claims, no percentage metrics, Hospital App labeled as a learning project.

## Incident response basics

- Defacement or wrong content: redeploy last good git commit; or restore S3 objects within the 7-day version window; invalidate CloudFront.
- Leaked AWS credentials: revoke SSO sessions in IAM Identity Center, review CloudTrail, rotate anything touched.
- Domain or certificate problem: check Route 53 registration auto-renew and ACM validation records.
- Spam through WhatsApp: remove the button with a content change and redeploy.
