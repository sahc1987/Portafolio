# AGENTS: Saúl Hernández Portfolio

Status: Complete

## Project summary

Bilingual (EN/ES) one-page portfolio for Saúl Hernández, Full Stack Developer, aimed at recruiters for full-stack roles.
Next.js static export on AWS (S3 + CloudFront + Route 53 at saulhernandez.dev), infrastructure in CDK TypeScript.
Shows four projects with case studies, an on-page resume and downloadable EN/ES CV PDFs.

## Commands

Node 24 LTS, npm workspaces. Run from the repo root.

| Task                     | Command                                                                 |
| ------------------------ | ----------------------------------------------------------------------- |
| Install                  | `npm ci`                                                                |
| Dev server               | `npm run dev` (site at `http://localhost:3000/en/`)                     |
| Build                    | `npm run build` (static export to `site/out`)                           |
| Preview build            | `npm run preview`                                                       |
| Unit + integration tests | `npm test` (with coverage, 80% gate)                                    |
| E2E + accessibility      | `npm run test:e2e` (first run: `npx playwright install`)                |
| Typecheck                | `npm run typecheck`                                                     |
| Lint                     | `npm run lint`                                                          |
| Format                   | `npm run format`                                                        |
| Everything before merge  | `npm run check`                                                         |
| Infra diff / deploy      | `npm run cdk -- diff` / `npm run cdk -- deploy` (needs `aws sso login`) |
| Site deploy              | `npm run deploy` (check + audit + build + s3 sync + invalidation)       |

## Project map

- `site/app/[locale]/`: pages per locale (composition only).
- `site/components/{hero,projects,experience,skills,education,layout,ui}/`: UI by section.
- `site/content/`: `types.ts` (the `Content` type), `en.ts`, `es.ts`, `get-content.ts`. All user-facing text lives here.
- `site/lib/`: pure helpers (dates, locale, analytics event names).
- `site/styles/`: `tokens.css`, `globals.css`, `motion.css`.
- `site/public/cv/`: CV PDFs (EN, ES).
- `site/tests/`, `*.test.ts(x)`: Vitest; `site/e2e/`: Playwright.
- `infra/`: CDK app (bucket, CloudFront, function, certificate, DNS, budget).
- `scripts/deploy.sh`: deploy pipeline.

## Rules from the foundation docs

- **Product** ([PRD.md](PRD.md)): recruiters first; four projects only; Hospital App always labeled "Spring Boot learning project"; CentralDesk text-only, never a link, screenshot, hostname or store data; contact via Email, LinkedIn, WhatsApp button, CV download; no blog, form or CMS.
- **Architecture** ([ARCHITECTURE.md](ARCHITECTURE.md)): `output: 'export'` must keep working, so no middleware, no server actions, no Next i18n config, `images.unoptimized: true`; locales are `/en/` and `/es/` path segments; language redirect lives in the CloudFront Function.
- **Data** ([DATABASE.md](DATABASE.md)): no database; content changes go in both `en.ts` and `es.ts` in the same commit; `types.ts` changes update both locales together.
- **Security** ([SECURITY.md](SECURITY.md)): no secrets in the repo; no phone number as plain text; no home address; bucket stays private behind OAC; keep the CSP in sync when adding any external script or origin; AWS via SSO only.
- **Design** ([DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)): tokens only, no raw hex in components; WCAG 2.2 AA; every animation respects `prefers-reduced-motion` and uses only transform/opacity/stroke; content visible without JS.
- **Code style** ([CODE_STYLE.md](CODE_STYLE.md)): TS strict, no `any`; best practices for each language, enforced by tools (typescript-eslint, jsx-a11y, react-hooks, cdk-nag, shellcheck, markdownlint); kebab-case files; Conventional Commits; feature branch + PR.
- **Testing** ([TESTING.md](TESTING.md)): Vitest, Playwright + axe; 80% coverage; honesty rules and locale parity are tested.

## Do / Don't

### Do

- Keep every claim matching the CV and defensible in an interview.
- Write EN and ES text together; ask Saúl when unsure of a Spanish phrasing.
- Add a test for every behavior change at the lowest level that catches it.
- Run `npm run check` before saying a change is done.
- Update the affected foundation doc in the same PR when a change contradicts it.
- Explain any new dependency and prefer none.

### Don't

- Don't add percentages, user counts, or "certified" claims.
- Don't link, screenshot or name internal details of CentralDesk.
- Don't add cookies, trackers, Google Analytics, third-party fonts or CDNs beyond Umami.
- Don't add server-only Next.js features.
- Don't deploy from a branch other than `main`, and never touch AWS resources outside the CDK stack.
- Don't push code Saúl hasn't reviewed; AI writes, Saúl reviews everything.

## Definition of done for any change

1. `npm run check` green: typecheck, lint, unit/integration (coverage ≥ 80%), E2E + axe with zero violations.
2. EN and ES updated and in parity.
3. Checked by hand: both locales, light and dark, phone width and desktop, keyboard only.
4. Relevant foundation docs and README updated.
5. Conventional Commit messages; merged through a PR into `main`.
6. For infra changes: `cdk diff` reviewed and cdk-nag clean.
