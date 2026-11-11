import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { en } from '../content/en';
import { es } from '../content/es';
import { EVENTS } from '../lib/analytics';

const LOCALES = [en, es] as const;

/** Fails the test on any console error, page error or CSP violation. */
function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

for (const content of LOCALES) {
  test.describe(`${content.locale} page`, () => {
    test('renders every section in the right language without errors', async ({ page }) => {
      const errors = watchErrors(page);
      await page.goto(`/${content.locale}/`);

      await expect(page.locator('html')).toHaveAttribute('lang', content.locale);
      await expect(page).toHaveTitle(content.ui.metaTitle);
      await expect(page.getByRole('heading', { level: 1 })).toContainText(content.profile.name);
      for (const title of [
        content.ui.about.title,
        content.ui.sections.projects,
        content.ui.sections.experience,
        content.ui.sections.skills,
        content.ui.sections.contact,
      ]) {
        await expect(page.getByRole('heading', { level: 2, name: title })).toBeVisible();
      }
      await expect(page.getByRole('article')).toHaveCount(content.projects.length);
      expect(errors).toEqual([]);
    });

    test('contact CTAs have the right links and analytics events', async ({ page }) => {
      await page.goto(`/${content.locale}/`);
      await expect(
        page
          .locator('section[aria-labelledby="hero-title"]')
          .getByRole('link', { name: content.ui.hero.viewWork }),
      ).toHaveAttribute('href', '#projects');
      const hero = page.locator('#contact');
      const cv = hero.getByRole('link', { name: content.cv.label });
      await expect(cv).toHaveAttribute('href', content.cv.path);
      await expect(cv).toHaveAttribute('data-umami-event', EVENTS.downloadCv);
      await expect(hero.getByRole('link', { name: content.ui.cta.email })).toHaveAttribute(
        'href',
        `mailto:${content.profile.email}`,
      );
      await expect(hero.getByRole('link', { name: content.ui.cta.linkedin })).toHaveAttribute(
        'data-umami-event',
        EVENTS.linkedin,
      );
      await expect(hero.getByRole('link', { name: content.ui.cta.whatsapp })).toHaveAttribute(
        'href',
        `https://wa.me/${content.profile.whatsappNumber}`,
      );

      const response = await page.request.get(content.cv.path);
      expect(response.ok()).toBe(true);
      expect(response.headers()['content-type']).toBe('application/pdf');
    });

    test('every case study opens', async ({ page }) => {
      await page.goto(`/${content.locale}/`);
      for (const project of content.projects) {
        const card = page.getByRole('article', { name: project.title });
        await card.getByText(content.ui.caseStudy.open).click();
        await expect(card.getByText(project.hardParts[0])).toBeVisible();
      }
      const pool = page.getByRole('article', { name: 'Complete Pool App' });
      await expect(pool.getByRole('link', { name: content.ui.caseStudy.demo })).toHaveAttribute(
        'href',
        'https://complete-pool-app.vercel.app',
      );
      await expect(
        page.getByRole('article', { name: 'CentralDesk' }).getByRole('link'),
      ).toHaveCount(0);
    });

    for (const theme of ['dark', 'light'] as const) {
      test(`has no WCAG 2.2 AA violations (${theme})`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.addInitScript((value) => localStorage.setItem('theme', value), theme);
        await page.goto(`/${content.locale}/`);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        // Open every disclosure so hidden content is scanned too.
        for (const details of await page.locator('details').all()) {
          await details.evaluate((element) => ((element as HTMLDetailsElement).open = true));
        }
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze();
        expect(results.violations.map((v) => `${v.id}: ${v.nodes.length} node(s)`)).toEqual([]);
      });
    }
  });
}

test('language switch keeps the current section', async ({ page }) => {
  await page.goto('/en/#experience');
  await page.getByRole('link', { name: 'ES, ver en español' }).click();
  await expect(page).toHaveURL(/\/es\/#experience$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('heading', { level: 2, name: 'Experiencia' })).toBeVisible();
});

test('theme toggle switches to light and remembers it', async ({ page }) => {
  await page.goto('/en/');
  await page.getByRole('button', { name: en.ui.theme.toLight }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.getByRole('button', { name: en.ui.theme.toDark })).toBeVisible();
});

test('keyboard users can skip to content', async ({ page, isMobile }) => {
  test.skip(isMobile, 'No physical keyboard on mobile');
  await page.goto('/en/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: en.ui.skipToContent });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});

test('reduced motion shows all content immediately', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en/');
  const hidden = await page
    .locator('.reveal, .hero-in')
    .evaluateAll(
      (elements) => elements.filter((element) => getComputedStyle(element).opacity !== '1').length,
    );
  expect(hidden).toBe(0);
});

test('content stays visible without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/en/');
  await page.getByRole('heading', { level: 2, name: 'Skills' }).scrollIntoViewIfNeeded();
  await expect(page.getByRole('heading', { level: 2, name: 'Skills' })).toBeVisible();
  await context.close();
});

test('no horizontal scroll at 360px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  for (const path of ['/en/', '/es/']) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});

test('pages ship a hash-based CSP without unsafe-inline scripts', async ({ page }) => {
  await page.goto('/en/');
  const csp = await page
    .locator('meta[http-equiv="Content-Security-Policy"]')
    .getAttribute('content');
  expect(csp).toMatch(/script-src 'self'( 'sha256-[^']+')+/);
  expect(csp).not.toMatch(/script-src[^;]*unsafe-inline/);
});

test('unknown pages get the bilingual 404', async ({ page }) => {
  const response = await page.goto('/nope/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  await expect(page.getByRole('link', { name: 'Ir al inicio' })).toHaveAttribute('href', '/es/');
});
