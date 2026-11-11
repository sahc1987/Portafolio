import localFont from 'next/font/local';

// Self-hosted (SECURITY.md: no third-party fonts at runtime). Latin covers all Spanish characters.
export const inter = localFont({
  src: '../styles/fonts/inter-latin-var.woff2',
  variable: '--font-inter',
  weight: '100 900',
  display: 'swap',
});

export const jetbrainsMono = localFont({
  src: '../styles/fonts/jetbrains-mono-latin-var.woff2',
  variable: '--font-jetbrains',
  weight: '100 800',
  display: 'swap',
});
