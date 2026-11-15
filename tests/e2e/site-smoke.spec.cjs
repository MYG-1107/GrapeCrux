'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { test, expect } = require('@playwright/test');
const { AxeBuilder } = require('@axe-core/playwright');

const ROOT = path.resolve(__dirname, '../..');
const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const SITEMAP_ROUTES = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
  .map((match) => new URL(match[1]).pathname);
const PRIORITY_ROUTES = [
  '/', '/services/', '/industries/', '/work/', '/how-we-work/',
  '/about/', '/blogs/', '/blogs/archive/', '/contact/', '/careers/',
  '/project-assessment/', '/resources/', '/technologies/', '/privacy/', '/terms/'
];

test('every public sitemap route responds with an HTML page', async ({ request }) => {
  const failures = [];
  for (const route of SITEMAP_ROUTES) {
    try {
      const response = await request.get(route, { timeout: 15_000 });
      const contentType = response.headers()['content-type'] || '';
      if (!response.ok() || !contentType.includes('text/html')) {
        failures.push(route + ' -> HTTP ' + response.status() + ' (' + contentType + ')');
      }
    } catch (error) {
      failures.push(route + ' -> ' + error.message);
    }
  }
  expect(failures, 'Published sitemap route failures:\n' + failures.join('\n')).toEqual([]);
});

test('priority pages hydrate shared navigation and footer without runtime or horizontal-overflow errors', async ({ page }) => {
  const pageErrors = [];
  const failedLocalRequests = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('requestfailed', (request) => {
    try {
      const url = new URL(request.url());
      if (url.origin === 'http://127.0.0.1:4173' && url.pathname !== '/favicon.ico') {
        failedLocalRequests.push(url.pathname + ': ' + (request.failure()?.errorText || 'request failed'));
      }
    } catch (_error) {}
  });

  for (const route of PRIORITY_ROUTES) {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response?.status(), route + ' should return HTTP 200').toBe(200);
    await expect(page.locator('#site-header .brand'), route + ' shared header').toBeVisible();
    await expect(page.locator('#site-header .nav-links a[href="/services/"]')).toHaveCount(1);
    await expect(page.locator('#site-footer .legal-links a[href="/privacy/"]'), route + ' shared footer').toBeAttached();
    await expect(page.locator('main#main-content h1'), route + ' primary heading').toHaveCount(1);
    await expect(page.locator('main#main-content h1')).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth
    }));
    expect(
      dimensions.document,
      route + ' horizontal overflow: document ' + dimensions.document + 'px, viewport ' + dimensions.viewport + 'px'
    ).toBeLessThanOrEqual(dimensions.viewport + 2);
  }

  expect(pageErrors, 'Uncaught browser JavaScript errors').toEqual([]);
  expect(failedLocalRequests, 'Failed same-origin resources').toEqual([]);
});

test('mobile navigation opens and closes with Escape and link selection', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-mobile', 'Mobile-specific navigation check');
  await page.goto('/');
  const toggle = page.locator('#site-header .menu-toggle');
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');

  await toggle.click();
  const servicesLink = page.locator('#site-header .nav-links a[href="/services/"]');
  await expect(servicesLink).toBeVisible();
  await servicesLink.click();
  await expect(page).toHaveURL(/\/services\/$/);
  await expect(page.locator('#site-header .menu-toggle')).toHaveAttribute('aria-expanded', 'false');
});

test('contact form preselects a requested service and enforces required fields and privacy consent', async ({ page }) => {
  await page.goto('/contact/?service=AI%20%26%20Automation');
  const form = page.locator('#project-form');
  const service = form.locator('[name="service"]');
  await expect(service).toHaveValue('AI & Automation');
  await expect(form.locator('[name="message"]')).toContainText('');
  await expect(form.locator('[name="message"]')).toHaveValue(/AI & Automation/);
  expect(await form.evaluate((element) => element.checkValidity())).toBe(false);

  await form.locator('[name="name"]').fill('QA Test Visitor');
  await form.locator('[name="email"]').fill('qa@example.test');
  await form.locator('[name="country"]').fill('India');
  await form.locator('[name="project_type"]').selectOption({ label: 'Website or web application' });
  await form.locator('[name="message"]').fill('This is a browser test of the GrapeCrux enquiry form.');
  expect(await form.evaluate((element) => element.checkValidity())).toBe(false);

  await form.locator('[name="privacy_consent"]').check();
  expect(await form.evaluate((element) => element.checkValidity())).toBe(true);
  await expect(form).toHaveAttribute('method', 'POST');
  await expect(form).toHaveAttribute('action', 'https://formsubmit.co/service@grapecrux.com');
});

test('Careers hub switches form sections and assigns the matching Job ID', async ({ page }) => {
  await page.goto('/careers/');
  const type = page.locator('#career-application-type');
  const role = page.locator('#career-track');
  await type.selectOption('full-time');
  await expect(page.locator('#fulltime-fields')).toBeVisible();
  await expect(page.locator('#internship-fields')).toBeHidden();
  await role.selectOption('AI Engineer');
  await expect(page.locator('#career-job-id')).toHaveValue('GC-FT-002');
  await expect(page.locator('#career-specific-question-label')).toContainText('AI or machine-learning');

  await type.selectOption('internship');
  await expect(page.locator('#internship-fields')).toBeVisible();
  await expect(page.locator('#fulltime-fields')).toBeHidden();
  await role.selectOption('Data Analytics Intern');
  await expect(page.locator('#career-job-id')).toHaveValue('GC-IN-007');
});

test('project assessment returns a service route and a local project summary', async ({ page }) => {
  await page.goto('/project-assessment/');
  await page.locator('#assessment-goal').selectOption('website');
  await page.locator('#assessment-outcome').selectOption({ label: 'Improve website discovery and enquiries' });
  await page.getByRole('button', { name: /Review my suggested services/ }).click();
  await expect(page.locator('.assessment-result-content h2')).toContainText('These service areas look relevant');
  await expect(page.locator('.assessment-recommendation h3').first()).toContainText('Web & App Development');
  await expect(page.locator('#assessment-summary')).toContainText('Primary need: website');
  await expect(page.locator('.assessment-actions a[href^="/contact/?service="]')).toBeVisible();
});

test('cookie preferences can be rejected and reopened from the footer', async ({ page }) => {
  await page.goto('/');
  const banner = page.locator('#gc-consent-banner');
  await expect(banner).toBeVisible();
  await banner.getByRole('button', { name: 'Reject optional analytics' }).click();
  await expect(banner).toBeHidden();
  await page.locator('#site-footer [data-open-consent]').click();
  await expect(banner).toBeVisible();
});

test('the local service assistant opens, responds and can be dismissed', async ({ page }) => {
  await page.goto('/');
  const launcher = page.locator('#gc-chatbot .chat-launcher');
  await expect(launcher).toBeVisible({ timeout: 8_000 });
  await launcher.click();
  await expect(page.locator('#gc-chat-panel')).toHaveAttribute('aria-hidden', 'false');
  await page.locator('#gc-chat-input').fill('What services do you offer?');
  await page.locator('#gc-chat-input').press('Enter');
  await expect(page.locator('.chat-msg.user')).toContainText('What services do you offer?');
  await expect(page.locator('.chat-msg.bot').last()).not.toBeEmpty();
  await page.locator('#gc-chat-panel .chat-close').click();
  await expect(page.locator('#gc-chat-panel')).toHaveAttribute('aria-hidden', 'true');
});

test('axe accessibility review for key conversion pages (critical violations fail; all findings are attached)', async ({ page }, testInfo) => {
  const reportRoutes = ['/', '/services/', '/contact/', '/careers/', '/project-assessment/'];
  for (const route of reportRoutes) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#site-header .brand')).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const findings = results.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      nodes: violation.nodes.length,
      targets: violation.nodes.slice(0, 8).map((node) => node.target)
    }));
    await testInfo.attach('axe-' + route.replace(/[^a-z0-9]+/gi, '-') + '.json', {
      body: Buffer.from(JSON.stringify({ route, violations: findings }, null, 2)),
      contentType: 'application/json'
    });
    console.log('AXE ' + route + ': ' + results.violations.length + ' violation groups; ' +
      results.passes.length + ' passing rules.');
    const critical = results.violations.filter((item) => item.impact === 'critical');
    expect(critical, route + ' critical accessibility violations: ' +
      critical.map((item) => item.id + ': ' + item.help).join('; ')).toEqual([]);
  }
});
