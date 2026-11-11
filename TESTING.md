# Testing: Saúl Hernández Portfolio

Status: Complete

## Test levels

- **Unit**: pure helpers in `lib/`, content rules in `content/`, CloudFront Function logic, React components in isolation.
- **Integration**: CDK stack synth assertions (resources and their settings); content test that loads both locales together.
- **E2E**: Playwright against the built static export (`site/out` served locally), both locales, both themes, mobile and desktop viewports.
- **Accessibility**: axe scan inside the Playwright suite.

## Tools per level

| Level                      | Tools                                                                               |
| -------------------------- | ----------------------------------------------------------------------------------- |
| Unit (site)                | Vitest + @testing-library/react + @testing-library/user-event, jsdom                |
| Unit (CloudFront Function) | Vitest, function code imported as a module                                          |
| Integration (infra)        | Vitest + `aws-cdk-lib/assertions` (`Template.fromStack`) + cdk-nag                  |
| Integration (content)      | Vitest                                                                              |
| E2E                        | Playwright: Desktop Chrome, Pixel 7 (Chromium) and Desktop Safari (WebKit) projects |
| Accessibility              | `@axe-core/playwright`                                                              |

## What must always be tested

- **Content parity**: `en` and `es` have the same project, experience and skill slugs in the same order; no empty strings.
- **Honesty rules**: CentralDesk (`kind: 'internal'`) has no demo or repo link; Hospital App (`kind: 'learning'`) renders the learning badge; no `%` in any project or experience text.
- **CV files**: every `CvFile.path` exists; EN page links the EN PDF, ES page links the ES PDF.
- **Language redirect** (CloudFront Function): `/` with `Accept-Language: es-SV` → `/es/`; `en-US`, missing or unknown → `/en/`; directory paths get `index.html`.
- **Date formatting**: per-locale output, "present" for `end: null`.
- **Components**: case study disclosure toggles `aria-expanded`; language toggle points to the same section in the other locale; theme toggle persists and falls back when storage throws.
- **E2E flows**:
  - Hero CTAs exist and have correct `href`s (mailto, LinkedIn, `wa.me`, CV PDF) and `data-umami-event` names.
  - Every project card opens its case study; Pool App demo link and repo links are present.
  - Switching EN ↔ ES changes `<html lang>`, all section titles and the CV link.
  - Keyboard-only path: skip link, nav, every CTA and disclosure reachable with visible focus.
  - Reduced motion: with `reducedMotion: 'reduce'`, all content is visible immediately.
  - No horizontal scroll at 360px width.
- **Accessibility**: axe scan with WCAG 2.2 A/AA tags on `/en/` and `/es/`, light and dark; any violation fails.
- **Infra**: bucket blocks public access and is versioned with 7-day noncurrent expiry; CloudFront uses OAC, redirect-to-https, TLS 1.2+, the security headers policy (HSTS, CSP, nosniff, referrer, permissions); certificate in `us-east-1`; budget alarm at USD 5; cdk-nag has no unsuppressed errors.

## Coverage target

- 80% (lines, branches, functions, statements) over all unit-testable code: `site/{content,lib,components,scripts}` and `infra/{lib,functions}`, measured by Vitest (`@vitest/coverage-v8`). Below 80% fails `npm test`.
- Next route files (`site/app/**`), the CDK entry point and the local static server are covered by E2E and synth instead of unit coverage.
- E2E coverage is tracked by the flow list above, not by percentage.

## Test data and fixtures

- Unit and integration tests use the real `content/en.ts` and `content/es.ts` (they are the data under test).
- Component tests use small typed fixtures in `tests/fixtures/` built with `satisfies Content` so they can't drift from the type.
- E2E runs against a fresh `next build` output; no network calls: Umami script is blocked with `page.route` and click events asserted through the `data-umami-event` attributes.
- No real AWS calls in tests; CDK tests synth in memory.

## CI pipeline and when tests run

- No CI (current standard). Tests run locally:
  - `npm test`: Vitest unit + integration with coverage (site + infra).
  - `npm run test:e2e`: build, serve `site/out`, Playwright + axe.
  - `npm run check`: typecheck + lint + test + test:e2e.
- `npm run deploy` runs `npm run check` and `npm audit --omit=dev` first; any failure stops the deploy.
- Before every PR merge: `npm run check` passes.

## Definition of done for tests

- New or changed behavior has a test at the lowest level that can catch it.
- `npm run check` is green; coverage ≥ 80%; zero axe violations.
- Both locales and both themes checked by hand on a phone-width and desktop viewport.
- No skipped (`.skip`) or focused (`.only`) tests committed.
