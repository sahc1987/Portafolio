# Design System: Saúl Hernández Portfolio

Status: Complete

## Tone and brand

- Modern developer portfolio, modeled on a dark reference: near-black surfaces, a bright orange accent, orbit rings and floating stack chips around the portrait, generous whitespace.
- Voice: first person, plain, factual. Short sentences. No buzzwords, no percentages, no superlatives that can't be defended.
- Honest by design: no client logos, no "trusted by" rows, no testimonials, no contact form, no skill percentage bars, no project or client counters. The template's "happy clients" and "100% satisfaction" tiles are replaced by CV facts. The hero shows "the stack I ship with" instead of logos.
- Dark is the default look. Light is available from the theme toggle and remembered per visitor.
- Motion is rich but purposeful: it reveals content and structure, never decorates. All of it switches off under `prefers-reduced-motion`.

## Color tokens (light + dark)

Defined as CSS custom properties in `site/styles/tokens.css`: dark on `:root`, light under `:root[data-theme="light"]`; mapped into the Tailwind theme in `globals.css`.

| Token                 | Dark (default)   | Light            | Use                                      |
| --------------------- | ---------------- | ---------------- | ---------------------------------------- |
| `--bg`                | `#0B0B0E`        | `#FFFFFF`        | Page background                          |
| `--bg-deep`           | `#08080A`        | `#FFF7ED`        | Hero, project image panels, CTA banner   |
| `--surface`           | `#141418`        | `#FAFAF9`        | Cards, timeline band, info card          |
| `--border`            | `#2A2A31`        | `#E7E5E4`        | Dividers, card borders                   |
| `--text`              | `#F4F4F5`        | `#18181B`        | Body text                                |
| `--text-muted`        | `#A1A1AA`        | `#52525B`        | Secondary text, dates                    |
| `--accent`            | `#FF9A1F`        | `#C2410C`        | Accent text, links, icons, diagram lines |
| `--accent-hover`      | `#FFB454`        | `#9A3412`        | Link hover                               |
| `--accent-strong`     | `#FF8A1F`        | `#C2410C`        | Primary button background                |
| `--accent-contrast`   | `#0B0B0E`        | `#FFFFFF`        | Text on primary buttons                  |
| `--accent-soft`       | `#2A1B08`        | `#FFEDD5`        | Tags, education card                     |
| `--accent-soft-text`  | `#FFD9A3`        | `#7C2D12`        | Text on soft accent                      |
| `--focus-ring`        | `#FFB454`        | `#C2410C`        | 2px outline + 2px offset                 |
| `--success`           | `#34D399`        | `#059669`        | "Open to roles" status dot               |
| `--warning-soft/text` | `#3A2E0A/FDE68A` | `#FEF3C7/78350F` | "Learning project" badge                 |
| `--hero-glow`         | orange 22%       | orange 16%       | Radial glows in hero and CTA banner      |

Primary buttons use `--accent-strong` with `--accent-contrast`: dark text on the bright orange in dark mode (white on orange would be about 2.5:1), white on deep orange in light mode. All text pairs meet 4.5:1 and UI components 3:1, verified by the axe scan in both themes.

## Typography scale

- Sans: Inter (self-hosted variable font, Latin subset covers all Spanish characters).
- Mono: JetBrains Mono for eyebrows, stack lines, dates, the hero stack row and diagram labels.
- Base 16px, line-height 1.6 body. Max line length ~65ch.

| Token     | Size (mobile → desktop) | Weight | Use                                           |
| --------- | ----------------------- | ------ | --------------------------------------------- |
| `display` | 40 → 56px               | 700    | Name in hero (last name in accent)            |
| `h2`      | 28 → 36px               | 700    | Section titles, hero headline                 |
| `h3`      | 20 → 24px               | 600    | Project and role titles                       |
| `body-lg` | 18px                    | 400    | Hero pitch, section intros                    |
| `body`    | 16px                    | 400    | Default                                       |
| `small`   | 14px                    | 400    | Meta, info card                               |
| `mono-sm` | 13px                    | 500    | Eyebrows (uppercase, 0.08em tracking), stacks |

## Spacing and radius scale

- Spacing: Tailwind 4px base. Section padding 64px mobile / 96-112px desktop. Card padding 20 / 28px. Grid gaps 16 / 24px.
- Container: max-width 1120px, 16px side gutter on mobile, 32px from `md`.
- Radius: `sm` 6px (tags), `md` 10px (buttons), `lg` 16px (cards).
- Borders 1px `--border`; cards lift 3px with `--shadow-hover` on hover.

## Core components

- `SiteHeader`: `NameMark` (first name + last name in accent, "Full Stack Developer" subtitle), section nav (desktop), language toggle, theme toggle, "Hire me" button (mailto).
- `Hero`: "Hello, I'm" greeting, name + headline, pitch, "View my work" (primary) and "Contact me" (secondary), "The stack I ship with" row; `HeroPortrait` on the right (real headshot inside accent orbit rings with four floating stack chips); availability line and GitHub / LinkedIn / email icon buttons. Backdrop: accent glows and a faint grid.
- `AboutSection`: eyebrow, title, two-paragraph story, three fact tiles (7+ years, largest team led, languages), Download CV button; info card with Location, Email, WhatsApp (link only, number never shown), Languages, Availability.
- `ServicesSection`: four cards (frontend, backend, databases, cloud and delivery) with Lucide icons, derived from the CV skills.
- `ProjectCard`: architecture diagram in a deep panel, kind badge, title, summary, stack line in accent mono, note, demo/code links, `<details>` case study (problem, what I built, hard parts, full stack tags).
- `ArchitectureDiagram`: inline SVG per project from a node/edge spec, themed with tokens. CentralDesk stays generic: no hostnames, store data or vendor internals.
- `KindBadge`: Client project / Internal tool / Personal project / Spring Boot learning project (warning tone).
- `Timeline` (experience), `SkillGroup` cards, `EducationItem` (accent card).
- `SiteFooter`: CTA banner "Let's work together" with all contact buttons, then three columns (name mark and tagline, quick links, follow icons) and a copyright line with source link.
- Global 404: bilingual, same tokens and fonts.
- States: every interactive element has default, hover, focus-visible and active styles.

## Motion

- Library: none. Native CSS scroll-driven animations (`animation-timeline: view()`) with an IntersectionObserver fallback that only hides content after it is running.
- Patterns: hero sequenced entrance, section reveal (fade + 16px rise), diagram edges drawing in, timeline line growing as you scroll, header background fading in on scroll, card lift on hover, status dot ping.
- Durations 200-700ms, easing `cubic-bezier(0.22, 1, 0.36, 1)`. Only `transform`, `opacity` and SVG stroke are animated.
- `prefers-reduced-motion: reduce` → no entrance, scroll or ping animations; hover limited to color.
- No scroll-jacking, no parallax on text, nothing blocks reading or clicking while animating. Content is fully visible without JavaScript.

## Responsive breakpoints

Mobile-first, Tailwind defaults:

- base < 640px: single column, full-width stacked buttons, header shows name mark + toggles.
- `sm` 640px: buttons inline, "Hire me" appears.
- `md` 768px: project grid 2 columns, timeline with dates on the left.
- `lg` 1024px: hero two columns (text + profile card), About two columns, desktop nav.
- Container caps at 1120px. Tap targets ≥ 44×44px at every size. No horizontal scroll at 360px (tested).

## Accessibility target

- WCAG 2.2 AA, enforced by axe in Playwright for both locales and both themes.
- Semantic landmarks, one `h1`, ordered headings, skip-to-content link, visible `focus-visible` ring on every control.
- `lang` per locale; the language toggle's accessible name starts with its visible text ("ES, ver en español").
- Icon-only links have `aria-label`; diagrams have `role="img"` + `aria-label`.
- Case studies use native `<details>`/`<summary>`: keyboard and screen-reader support built in, works without JS.

## Languages / i18n

- English and Spanish, routes `/en/` and `/es/`, identical structure and content.
- All strings in `content/{locale}.ts`; no hardcoded UI text in components.
- Dates via `Intl.DateTimeFormat` ("Oct 2020" / "oct 2020"); year-only when the CV has no month.
- The CV buttons serve the PDF matching the current locale.
- `hreflang` alternates, per-locale title, description and Open Graph tags.

## Icons and imagery

- Icons: Lucide (20px) for UI. GitHub mark and a simple "in" glyph drawn inline for LinkedIn; WhatsApp uses a generic chat icon.
- Project visuals: architecture diagrams for all four projects, inline SVG, tokens only.
- No stock photos and no fake logos. The hero uses a real headshot (`site/public/headshot.webp`, 480×480 WebP, ≤ 80KB, explicit size).
- Favicon: "SH" monogram. Open Graph image per locale (`/og-en.png`, `/og-es.png`, 1200×630) in the hero style.
