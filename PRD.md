# PRD: Saúl Hernández Portfolio

Status: Complete

## Problem

Recruiters hiring mid-level full-stack developers spend seconds on a profile. Saúl's CV shows 7+ years of experience, but since 2020 his title has been General Manager of a UPS Store, and only one of his recent projects has a live demo. Recruiters need one page that proves he is still building production software and lets them verify it fast.

## Target users and roles

- Primary: technical recruiters and hiring managers for LATAM-remote and El Salvador on-site/hybrid full-stack roles.
- Secondary: engineers doing a technical screen who open repos and case studies.
- Single public role (visitor). No login, no admin area. Saúl edits content in the repo.

## Goals and success metrics

- A recruiter can tell in under 10 seconds: who he is, what he builds, and how to contact him.
- Every project claim can be verified (demo, repo, or a defensible case study).
- Metrics (cookieless analytics): visits, resume PDF downloads, clicks on Email, LinkedIn, WhatsApp, GitHub and live demo.
- Outcome metric: recruiter replies and interviews that mention the portfolio.

## MVP features (prioritized)

1. Hero: greeting, name, "Full Stack Developer", pitch, "View my work" and "Contact me" buttons, "the stack I ship with" row (instead of client logos), profile card with status and location. Header has a "Hire me" button.
2. About: short story, four highlights, Download CV, info card (location, email, WhatsApp link, languages, availability).
3. Projects: card + short case study each (problem, what he built, stack, hard parts solved, links).
   - Complete Pool App: live demo link (read-only demo) + repo.
   - Ecommerce: repo link, no demo; case study carries the proof (row locking, idempotency, security).
   - CentralDesk: text-only case study, no link, no screenshots, internal tool for 4 UPS Store locations.
   - Hospital App: labeled "Spring Boot learning project", repo link.
4. Experience timeline (on-page resume): UPS Store GM, Telus International, Omnisport, Mitratech, Independent Developer.
5. Skills grouped by area: Frontend, Backend, Databases, DevOps & Cloud, Testing & Quality.
6. Education: Ingeniería de Sistemas Informáticos, Universidad de El Salvador, 2008-2013.
7. Resume PDF download, EN and ES versions.
8. English / Spanish language toggle covering all content.
9. Cookieless analytics
10. Contact banner ("Let's work together") repeating Download CV, Email, LinkedIn, WhatsApp. with click events.

## Out of scope

- Blog, CMS, contact form, Calendly booking.
- Certifications section (study track not shown on the page).
- Public phone number as text (WhatsApp button only).
- Screenshots or links for CentralDesk.
- Login, comments, or any user-generated content.
- Client logos, "trusted by" rows, project or client counters (nothing that cannot be verified).

## Key user stories / flows

- As a recruiter, I land on the page, read the hero, and click Download CV or Email.
- As a recruiter, I open a project card, read the case study, and click the live demo or repo.
- As a Spanish-speaking recruiter, I switch to ES and every section and the CV download change language.
- As an engineer screening him, I jump from the Ecommerce case study to the repo to check the code.
- Flow: Hero → About → Projects → Experience → Skills + Education → Contact banner → Footer.

## Constraints

- Platforms: web, mobile-first, works on any modern browser.
- Languages: English and Spanish, identical content.
- Deadline: none fixed.
- Budget: free hosting tier; optional custom domain (~USD 10-15/year).
- Honesty: every claim must match the CV and be defensible in an interview; no percentage metrics, no claims of passed certifications.

## Risks

- Ecommerce and CentralDesk have no demo: credibility depends on case study quality.
- Hospital App: weakest item; mislabeling it would contradict the CV.
- WhatsApp button exposes the phone number to scrapers and spam.
- EN and ES content drifting apart when one is updated and the other is not.
- Portfolio and CV contradicting each other (dates, stacks, titles).
