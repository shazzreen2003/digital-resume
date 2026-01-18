// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Pages Tests
 * Tests for page loads, content structure, and no console errors
 */

test.describe('Page Loads', () => {
  test.describe('Index Redirect', () => {
    test('index.html has redirect to about page', async ({ page }) => {
      // Navigate and check the HTML content
      await page.goto('/index.html', { waitUntil: 'domcontentloaded' });

      // Check for meta refresh redirect
      const metaRefresh = page.locator('meta[http-equiv="refresh"]');
      const count = await metaRefresh.count();

      if (count > 0) {
        const content = await metaRefresh.getAttribute('content');
        expect(content).toContain('about.html');
      } else {
        // Check for JS redirect or link
        const hasAboutLink = await page.locator('a[href*="about.html"]').count() > 0;
        expect(hasAboutLink).toBeTruthy();
      }
    });

    test('index page has fallback link to about page', async ({ page }) => {
      await page.goto('/index.html', { waitUntil: 'domcontentloaded' });

      // Check that there's a link to about.html (for fallback)
      const aboutLink = page.locator('a[href*="about.html"]');
      const count = await aboutLink.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe('About Page', () => {
    test('about page loads correctly', async ({ page }) => {
      await page.goto('/pages/about.html');

      await expect(page).toHaveTitle(/About/);
      await expect(page.locator('.navbar')).toBeVisible();
      await expect(page.locator('.page-hero')).toBeVisible();
    });

    test('about page has profile section', async ({ page }) => {
      await page.goto('/pages/about.html');

      await expect(page.locator('img[alt="Shazzreen Elyana"]')).toBeVisible();
      await expect(page.getByText("I'm Shazzreen Elyana")).toBeVisible();
    });

    test('about page has stats section', async ({ page }) => {
      await page.goto('/pages/about.html');

      await expect(page.locator('.text-muted:has-text("Projects")')).toBeVisible();
      await expect(page.locator('.text-muted:has-text("Years Exp.")')).toBeVisible();
    });

    test('about page has timeline sections', async ({ page }) => {
      await page.goto('/pages/about.html');

      await expect(page.getByRole('heading', { name: /Education/i })).toBeVisible();
      await expect(page.getByRole('heading', { name: /Work Experience/i })).toBeVisible();
      await expect(page.locator('.timeline')).toHaveCount(2);
    });
  });

  test.describe('Skills Page', () => {
    test('skills page loads correctly', async ({ page }) => {
      await page.goto('/pages/skills.html');

      await expect(page).toHaveTitle(/Skills/);
      await expect(page.locator('.navbar')).toBeVisible();
      await expect(page.locator('.page-hero')).toBeVisible();
    });

    test('skills page has skill cards', async ({ page }) => {
      await page.goto('/pages/skills.html');

      // Should have skill cards/items
      const cards = page.locator('.card, .skill-item, [class*="skill"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Contact Page', () => {
    test('contact page loads correctly', async ({ page }) => {
      await page.goto('/pages/contact.html');

      await expect(page).toHaveTitle(/Contact/);
      await expect(page.locator('.navbar')).toBeVisible();
      await expect(page.locator('.page-hero')).toBeVisible();
    });

    test('contact page has form', async ({ page }) => {
      await page.goto('/pages/contact.html');

      await expect(page.locator('#contactForm')).toBeVisible();
    });

    test('contact page has contact info', async ({ page }) => {
      await page.goto('/pages/contact.html');

      await expect(page.locator('h6:has-text("Email")')).toBeVisible();
      await expect(page.locator('h6:has-text("Phone")')).toBeVisible();
      await expect(page.locator('h6:has-text("Location")')).toBeVisible();
    });
  });

  test.describe('Best Work Page', () => {
    test('best work page loads correctly', async ({ page }) => {
      await page.goto('/pages/portfolio/bestwork.html');

      await expect(page).toHaveTitle(/Best Work/);
      await expect(page.locator('.navbar')).toBeVisible();
      await expect(page.locator('.page-hero')).toBeVisible();
    });

    test('best work page has carousel', async ({ page }) => {
      await page.goto('/pages/portfolio/bestwork.html');

      await expect(page.locator('#bestWorkCarousel')).toBeVisible();
    });
  });

  test.describe('Projects Page', () => {
    test('projects page loads correctly', async ({ page }) => {
      await page.goto('/pages/portfolio/projects.html');

      await expect(page).toHaveTitle(/Projects/);
      await expect(page.locator('.navbar')).toBeVisible();
      await expect(page.locator('.page-hero')).toBeVisible();
    });
  });

  test.describe('Detail Pages', () => {
    const detailPages = [
      '/pages/portfolio/bestwork/freelance.html',
      '/pages/portfolio/bestwork/jxtravel.html',
      '/pages/portfolio/bestwork/pearliewhite.html',
      '/pages/portfolio/bestwork/rimbrew.html',
      '/pages/portfolio/bestwork/careerbuddy.html',
      '/pages/portfolio/projects/advertising.html',
      '/pages/portfolio/projects/3d.html',
      '/pages/portfolio/projects/illustration.html',
      '/pages/portfolio/projects/branding.html',
      '/pages/portfolio/projects/socialmedia.html',
      '/pages/portfolio/projects/packaging.html',
    ];

    for (const pagePath of detailPages) {
      const pageName = pagePath.split('/').pop().replace('.html', '');

      test(`${pageName} page loads correctly`, async ({ page }) => {
        await page.goto(pagePath);

        // Page should load
        await expect(page.locator('body')).toBeVisible();

        // Should have navigation
        await expect(page.locator('.navbar')).toBeVisible();
      });
    }
  });
});

test.describe('Images Load', () => {
  test('about page images load without errors', async ({ page }) => {
    const errors = [];

    // Listen for failed requests
    page.on('requestfailed', request => {
      if (request.resourceType() === 'image') {
        errors.push(request.url());
      }
    });

    await page.goto('/pages/about.html');
    await page.waitForLoadState('networkidle');

    // Allow some tolerance for external images
    expect(errors.length).toBeLessThan(3);
  });

  test('best work page images load', async ({ page }) => {
    const errors = [];

    page.on('requestfailed', request => {
      if (request.resourceType() === 'image') {
        errors.push(request.url());
      }
    });

    await page.goto('/pages/portfolio/bestwork.html');
    await page.waitForLoadState('networkidle');

    expect(errors.length).toBeLessThan(3);
  });
});

test.describe('No Console Errors', () => {
  const pagesToCheck = [
    '/pages/about.html',
    '/pages/skills.html',
    '/pages/contact.html',
    '/pages/portfolio/bestwork.html',
    '/pages/portfolio/projects.html',
  ];

  for (const pagePath of pagesToCheck) {
    const pageName = pagePath.split('/').pop().replace('.html', '');

    test(`${pageName} page has no critical JS errors`, async ({ page }) => {
      const errors = [];

      page.on('pageerror', error => {
        errors.push(error.message);
      });

      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');

      // Filter out non-critical errors (like fetch failures to external services)
      const criticalErrors = errors.filter(err =>
        !err.includes('fetch') &&
        !err.includes('Failed to load resource') &&
        !err.includes('net::')
      );

      expect(criticalErrors).toHaveLength(0);
    });
  }
});

test.describe('Page Structure', () => {
  test('all pages have proper HTML structure', async ({ page }) => {
    const pages = [
      '/pages/about.html',
      '/pages/skills.html',
      '/pages/contact.html',
    ];

    for (const pagePath of pages) {
      await page.goto(pagePath);

      // Check HTML structure
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      // Meta tags exist in head but may not be "visible"
      const charsetMeta = page.locator('meta[charset]');
      await expect(charsetMeta).toHaveCount(1);
      const viewportMeta = page.locator('meta[name="viewport"]');
      await expect(viewportMeta).toHaveCount(1);
    }
  });

  test('all pages have navigation and footer', async ({ page }) => {
    const pages = [
      '/pages/about.html',
      '/pages/skills.html',
      '/pages/contact.html',
      '/pages/portfolio/bestwork.html',
      '/pages/portfolio/projects.html',
    ];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForSelector('.navbar', { timeout: 10000 });

      await expect(page.locator('.navbar')).toBeVisible();
      await expect(page.locator('#site-footer')).toBeVisible();
    }
  });
});

test.describe('User Flow: First-time Visitor', () => {
  test('complete visitor browsing flow', async ({ page }) => {
    // Intercept Formspree for form submission
    await page.route('https://formspree.io/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true })
      });
    });

    // Step 1: Land on about page
    await page.goto('/pages/about.html');
    await expect(page.locator('.page-hero h1')).toContainText('About');

    // Step 2: Navigate to Skills (using direct navigation)
    await page.goto('/pages/skills.html');
    await expect(page).toHaveURL(/.*skills/);

    // Step 3: Navigate to Best Work
    await page.goto('/pages/portfolio/bestwork.html');
    await expect(page).toHaveURL(/.*bestwork/);

    // Step 4: Click through carousel
    await page.waitForSelector('#bestWorkCarousel');
    await page.locator('#bestWorkCarousel .carousel-control-next').click();
    await page.waitForTimeout(700);

    // Step 5: View a project detail
    await page.goto('/pages/portfolio/bestwork/jxtravel.html');
    await expect(page).toHaveURL(/.*jxtravel/);

    // Step 6: Navigate to Contact
    await page.goto('/pages/contact.html');
    await expect(page).toHaveURL(/.*contact/);

    // Step 7: Fill and submit form
    await page.fill('#name', 'Test User');
    await page.fill('#email', 'test@example.com');
    await page.fill('#subject', 'Portfolio Inquiry');
    await page.fill('#message', 'I saw your portfolio and would like to discuss a project.');
    await page.locator('button[type="submit"]').click();

    // Verify success
    await expect(page.locator('.alert-success')).toBeVisible();
  });
});
