import type { ReactNode } from 'react';

/** Root "/" only. In production CloudFront redirects "/" before this page is ever served. */
export default function RootRedirectLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
