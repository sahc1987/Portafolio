# Code Style: Saúl Hernández Portfolio

Status: Complete

## Language and strictness

- TypeScript everywhere (site and infra), `strict: true`, `noUncheckedIndexedAccess: true`, `noImplicitOverride: true`.
- No `any`; use `unknown` and narrow. No non-null `!` except in tests.
- React Server Components by default; `'use client'` only for toggles, disclosure panels and the motion fallback.
- Code, identifiers, comments and commit messages in English. User-facing text only in `content/{en,es}.ts`.

## Best practices per language (always)

Every language in the repo follows its own established best practices, enforced by a tool wherever one exists.

- **TypeScript**: typescript-eslint recommended-type-checked rules; prefer `type` unions and `as const` over enums; `readonly` for content data; `satisfies` to check content objects against `Content`.
- **React**: Rules of Hooks (`eslint-plugin-react-hooks`); pure components; stable `key`s from slugs, never indexes; no effects for derived state.
- **Next.js (App Router)**: Server Components by default; `generateMetadata` per locale; `next/font` and `next/link`; no Node-only or server features that break `output: 'export'`.
- **HTML / JSX**: semantic elements first, ARIA only when no native element fits (`eslint-plugin-jsx-a11y` strict).
- **CSS / Tailwind**: tokens via CSS custom properties; mobile-first utilities; animate only `transform`, `opacity` and SVG stroke; `motion-safe:`/`motion-reduce:` variants on every animation.
- **AWS CDK**: L2 constructs over raw CloudFormation; least-privilege grants (`bucket.grantRead`); no hardcoded account IDs or regions; removal policies explicit; `cdk-nag` (AwsSolutions pack) runs on synth and blocks unexplained findings.
- **Bash** (`scripts/`): `set -euo pipefail`, quoted variables, `shellcheck` clean.
- **Markdown** (docs): `markdownlint` clean; Mermaid diagrams render on GitHub.
- **JSON / YAML**: Prettier formatted; no comments in JSON.

## Lint and format tools

- ESLint flat config: `eslint-config-next` (core-web-vitals + typescript), `eslint-plugin-jsx-a11y` (strict), `@typescript-eslint` recommended-type-checked.
- Prettier on every file (default config + `printWidth: 100`, `singleQuote: true`), `prettier-plugin-tailwindcss` for class order.
- `tsc --noEmit` clean in both workspaces.
- Scripts: `npm run lint`, `npm run format`, `npm run typecheck`.

## Naming conventions

- camelCase for variables and functions; PascalCase for components and types; UPPER_SNAKE_CASE for env var names only.
- kebab-case file names (`project-card.tsx`, `portfolio-stack.ts`).
- Booleans read as questions (`isOpen`, `hasDemo`).
- Content slugs kebab-case and identical across locales (`complete-pool-app`).
- CSS: Tailwind utilities mapped to design tokens; no raw hex values in components.

## Folder structure

```text
site/
├── app/[locale]/            # layout.tsx, page.tsx (composition only)
├── components/
│   ├── hero/
│   ├── projects/            # project-card, case-study, architecture-diagrams/
│   ├── experience/          # timeline, timeline-item
│   ├── skills/
│   ├── education/
│   ├── layout/              # site-header, site-footer
│   └── ui/                  # cta-button, stack-tag, kind-badge, toggles
├── content/                 # types.ts, en.ts, es.ts, get-content.ts
├── lib/                     # pure helpers: format-date, locale utils, analytics events
├── styles/                  # tokens.css, globals.css, motion.css
└── tests/
infra/
├── bin/
└── lib/
```

- Pages only compose sections; logic lives in `lib/` or `content/`.
- One component per file; colocated `*.test.tsx`.

## Error handling pattern

- No runtime data, so errors are caught at build time: bad content fails `tsc` or the content test; a missing CV file fails the build.
- `getContent(locale)` throws on an unknown locale; `generateStaticParams` only emits `en` and `es`.
- Client components guard browser APIs (`matchMedia`, `localStorage`) with try/catch and fall back to system theme.
- Analytics calls are fire-and-forget; a blocked Umami script never breaks the page.
- One bilingual global 404 (`app/global-not-found.tsx`, needed because the app has two root layouts); CloudFront serves it for any 403/404.

## Commit convention

- Conventional Commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`, `ci:`, optional scope (`feat(projects): add case study panel`, `chore(infra): add budget alarm`).
- Imperative, lowercase, ≤ 72 characters subject.

## Branching and PR rules

- `main` is always deployable. One branch per feature: `feat/<short-name>`, `fix/<short-name>`, `docs/<short-name>`.
- Merge through a PR, self-merged, squash merge.
- Before merge: `typecheck`, `lint`, `test` pass; page checked by hand in both locales and both themes, mobile and desktop.
- Deploy only from `main`.

## Comments and docs rules

- Comments explain why, never what.
- Every exported helper has a one-line TSDoc only if its name doesn't make the purpose obvious.
- README with the architecture diagram, local setup, deploy steps and how to edit content.
- CLAUDE.md imports AGENTS.md; the 8 foundation docs are updated in the same PR as any change that contradicts them.
- Short functions that do one thing; as few dependencies as possible.
