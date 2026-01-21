// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * SEO Tests
 * E2E tests for SEO meta tags, structured data, and SEO files
 */

test.describe('SEO Meta Tags', () => {
  test.describe('Open Graph Tags', () => {
    test('about page has all required Open Graph tags', async ({ page }) => {
      await page.goto('/pages/about.html');

      // Site name
      const ogSiteName = page.locator('meta[property="og:site_name"]');
      await expect(ogSiteName).toHaveAttribute('content', /Shazzreen Elyana/);

      // Locale
      const ogLocale = page.locator('meta[property="og:locale"]');
      await expect(ogLocale).toHaveAttribute('content', 'en_US');

      // Type
      const ogType = page.locator('meta[property="og:type"]');
      await expect(ogType).toHaveAttribute('content', 'profile');

      // Title
      const ogTitle = page.locator('meta[property="og:title"]');
      await expect(ogTitle).toHaveAttribute('content', /About Me.*Shazzreen Elyana/);

      // Description
      const ogDescription = page.locator('meta[property="og:description"]');
      await expect(ogDescription).toHaveAttribute('content', /.+/);

      // URL
      const ogUrl = page.locator('meta[property="og:url"]');
      await expect(ogUrl).toHaveAttribute('content', /pages\/about\.html/);

      // Image
      const ogImage = page.locator('meta[property="og:image"]');
      await expect(ogImage).toHaveAttribute('content', /https:\/\/.+\.png|jpg/);

      // Image dimensions
      const ogImageWidth = page.locator('meta[property="og:image:width"]');
      await expect(ogImageWidth).toHaveAttribute('content', '1200');

      const ogImageHeight = page.locator('meta[property="og:image:height"]');
      await expect(ogImageHeight).toHaveAttribute('content', '630');
    });

    test('portfolio page has article type for Open Graph', async ({ page }) => {
      await page.goto('/pages/portfolio/bestwork/careerbuddy.html');

      const ogType = page.locator('meta[property="og:type"]');
      await expect(ogType).toHaveAttribute('content', 'article');
    });

    test('all main pages have Open Graph tags', async ({ page }) => {
      const pages = [
        '/index.html',
        '/pages/about.html',
        '/pages/skills.html',
        '/pages/contact.html',
        '/pages/portfolio/bestwork.html'
      ];

      for (const url of pages) {
        await page.goto(url);

        // Check for required OG tags
        const ogTitle = page.locator('meta[property="og:title"]');
        await expect(ogTitle).toHaveCount(1);

        const ogDescription = page.locator('meta[property="og:description"]');
        await expect(ogDescription).toHaveCount(1);

        const ogImage = page.locator('meta[property="og:image"]');
        await expect(ogImage).toHaveCount(1);

        const ogUrl = page.locator('meta[property="og:url"]');
        await expect(ogUrl).toHaveCount(1);
      }
    });
  });

  test.describe('Twitter Card Tags', () => {
    test('about page has all required Twitter Card tags', async ({ page }) => {
      await page.goto('/pages/about.html');

      // Card type
      const twitterCard = page.locator('meta[name="twitter:card"]');
      await expect(twitterCard).toHaveAttribute('content', 'summary_large_image');

      // Title
      const twitterTitle = page.locator('meta[name="twitter:title"]');
      await expect(twitterTitle).toHaveAttribute('content', /About Me.*Shazzreen Elyana/);

      // Description
      const twitterDescription = page.locator('meta[name="twitter:description"]');
      await expect(twitterDescription).toHaveAttribute('content', /.+/);

      // Image
      const twitterImage = page.locator('meta[name="twitter:image"]');
      await expect(twitterImage).toHaveAttribute('content', /https:\/\/.+\.png|jpg/);
    });

    test('portfolio page has Twitter Card tags', async ({ page }) => {
      await page.goto('/pages/portfolio/bestwork/careerbuddy.html');

      const twitterCard = page.locator('meta[name="twitter:card"]');
      await expect(twitterCard).toHaveCount(1);

      const twitterTitle = page.locator('meta[name="twitter:title"]');
      await expect(twitterTitle).toHaveCount(1);

      const twitterImage = page.locator('meta[name="twitter:image"]');
      await expect(twitterImage).toHaveCount(1);
    });

    test('all Twitter Card images use full URLs', async ({ page }) => {
      const pages = ['/pages/about.html', '/pages/portfolio/bestwork/careerbuddy.html'];

      for (const url of pages) {
        await page.goto(url);

        const twitterImage = page.locator('meta[name="twitter:image"]');
        const content = await twitterImage.getAttribute('content');

        expect(content).toMatch(/^https:\/\//);
      }
    });
  });

  test.describe('Canonical URLs', () => {
    test('about page has canonical URL', async ({ page }) => {
      await page.goto('/pages/about.html');

      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveCount(1);
      await expect(canonical).toHaveAttribute('href', /pages\/about\.html/);
    });

    test('all pages have canonical URLs', async ({ page }) => {
      const pages = [
        '/index.html',
        '/pages/about.html',
        '/pages/skills.html',
        '/pages/contact.html'
      ];

      for (const url of pages) {
        await page.goto(url);

        const canonical = page.locator('link[rel="canonical"]');
        await expect(canonical).toHaveCount(1);

        const href = await canonical.getAttribute('href');
        expect(href).toContain('https://');
      }
    });

    test('canonical URLs are absolute', async ({ page }) => {
      await page.goto('/pages/about.html');

      const canonical = page.locator('link[rel="canonical"]');
      const href = await canonical.getAttribute('href');

      expect(href).toMatch(/^https:\/\//);
    });
  });

  test.describe('Robots Meta Tags', () => {
    test('about page has robots meta tag', async ({ page }) => {
      await page.goto('/pages/about.html');

      const robots = page.locator('meta[name="robots"]');
      await expect(robots).toHaveCount(1);
      await expect(robots).toHaveAttribute('content', 'index, follow');
    });

    test('all pages have robots meta tag', async ({ page }) => {
      const pages = [
        '/index.html',
        '/pages/about.html',
        '/pages/skills.html',
        '/pages/portfolio/bestwork.html'
      ];

      for (const url of pages) {
        await page.goto(url);

        const robots = page.locator('meta[name="robots"]');
        await expect(robots).toHaveCount(1);
      }
    });
  });
});

test.describe('Structured Data (Schema.org)', () => {
  test.describe('JSON-LD Presence', () => {
    test('about page has structured data script', async ({ page }) => {
      await page.goto('/pages/about.html');

      const jsonLdScript = page.locator('script[type="application/ld+json"]');
      await expect(jsonLdScript).toHaveCount(1);
    });

    test('all pages have structured data', async ({ page }) => {
      const pages = [
        '/index.html',
        '/pages/about.html',
        '/pages/skills.html',
        '/pages/contact.html',
        '/pages/portfolio/bestwork/careerbuddy.html'
      ];

      for (const url of pages) {
        await page.goto(url);

        const jsonLdScript = page.locator('script[type="application/ld+json"]');
        const count = await jsonLdScript.count();
        expect(count).toBeGreaterThanOrEqual(1);
      }
    });

    test('structured data contains valid JSON', async ({ page }) => {
      await page.goto('/pages/about.html');

      const jsonLdScript = page.locator('script[type="application/ld+json"]');
      const content = await jsonLdScript.textContent();

      // Should be valid JSON
      expect(() => JSON.parse(content)).not.toThrow();

      const json = JSON.parse(content);
      expect(Array.isArray(json) || typeof json === 'object').toBeTruthy();
    });
  });

  test.describe('WebSite Schema', () => {
    test('all pages have WebSite schema', async ({ page }) => {
      const pages = ['/pages/about.html', '/pages/skills.html'];

      for (const url of pages) {
        await page.goto(url);

        const jsonLdScript = page.locator('script[type="application/ld+json"]');
        const content = await jsonLdScript.textContent();
        const json = JSON.parse(content);

        // Find WebSite schema
        const schemas = Array.isArray(json) ? json : [json];
        const websiteSchema = schemas.find(s => s['@type'] === 'WebSite');

        expect(websiteSchema).toBeTruthy();
        expect(websiteSchema.name).toContain('Shazzreen Elyana');
        expect(websiteSchema.url).toBeTruthy();
      }
    });
  });

  test.describe('Person Schema', () => {
    test('about page has Person schema', async ({ page }) => {
      await page.goto('/pages/about.html');

      const jsonLdScript = page.locator('script[type="application/ld+json"]');
      const content = await jsonLdScript.textContent();
      const json = JSON.parse(content);

      // Find Person schema
      const schemas = Array.isArray(json) ? json : [json];
      const personSchema = schemas.find(s => s['@type'] === 'Person');

      expect(personSchema).toBeTruthy();
      expect(personSchema.name).toBe('Shazzreen Elyana');
      expect(personSchema.jobTitle).toBe('Graphic Designer');
      expect(personSchema.email).toBeTruthy();
      expect(personSchema.knowsAbout).toBeTruthy();
      expect(Array.isArray(personSchema.knowsAbout)).toBeTruthy();
    });

    test('Person schema has social media links', async ({ page }) => {
      await page.goto('/pages/about.html');

      const jsonLdScript = page.locator('script[type="application/ld+json"]');
      const content = await jsonLdScript.textContent();
      const json = JSON.parse(content);

      const schemas = Array.isArray(json) ? json : [json];
      const personSchema = schemas.find(s => s['@type'] === 'Person');

      expect(personSchema.sameAs).toBeTruthy();
      expect(Array.isArray(personSchema.sameAs)).toBeTruthy();
      expect(personSchema.sameAs.length).toBeGreaterThan(0);
    });
  });

  test.describe('CreativeWork Schema', () => {
    test('portfolio detail page has CreativeWork schema', async ({ page }) => {
      await page.goto('/pages/portfolio/bestwork/careerbuddy.html');

      const jsonLdScript = page.locator('script[type="application/ld+json"]');
      const content = await jsonLdScript.textContent();
      const json = JSON.parse(content);

      // Find CreativeWork schema
      const schemas = Array.isArray(json) ? json : [json];
      const creativeWorkSchema = schemas.find(s => s['@type'] === 'CreativeWork');

      expect(creativeWorkSchema).toBeTruthy();
      expect(creativeWorkSchema.name).toBeTruthy();
      expect(creativeWorkSchema.description).toBeTruthy();
      expect(creativeWorkSchema.author).toBeTruthy();
      expect(creativeWorkSchema.author['@type']).toBe('Person');
    });

    test('CreativeWork schema has required fields', async ({ page }) => {
      await page.goto('/pages/portfolio/bestwork/careerbuddy.html');

      const jsonLdScript = page.locator('script[type="application/ld+json"]');
      const content = await jsonLdScript.textContent();
      const json = JSON.parse(content);

      const schemas = Array.isArray(json) ? json : [json];
      const creativeWorkSchema = schemas.find(s => s['@type'] === 'CreativeWork');

      expect(creativeWorkSchema.name).toContain('Career Buddy');
      expect(creativeWorkSchema.dateCreated).toBeTruthy();
      expect(creativeWorkSchema.keywords).toBeTruthy();
      expect(Array.isArray(creativeWorkSchema.keywords)).toBeTruthy();
    });
  });

  test.describe('BreadcrumbList Schema', () => {
    test('nested pages have BreadcrumbList schema', async ({ page }) => {
      await page.goto('/pages/portfolio/bestwork/careerbuddy.html');

      const jsonLdScript = page.locator('script[type="application/ld+json"]');
      const content = await jsonLdScript.textContent();
      const json = JSON.parse(content);

      // Find BreadcrumbList schema
      const schemas = Array.isArray(json) ? json : [json];
      const breadcrumbSchema = schemas.find(s => s['@type'] === 'BreadcrumbList');

      expect(breadcrumbSchema).toBeTruthy();
      expect(breadcrumbSchema.itemListElement).toBeTruthy();
      expect(Array.isArray(breadcrumbSchema.itemListElement)).toBeTruthy();
      expect(breadcrumbSchema.itemListElement.length).toBeGreaterThan(1);
    });

    test('BreadcrumbList has correct structure', async ({ page }) => {
      await page.goto('/pages/about.html');

      const jsonLdScript = page.locator('script[type="application/ld+json"]');
      const content = await jsonLdScript.textContent();
      const json = JSON.parse(content);

      const schemas = Array.isArray(json) ? json : [json];
      const breadcrumbSchema = schemas.find(s => s['@type'] === 'BreadcrumbList');

      if (breadcrumbSchema) {
        const items = breadcrumbSchema.itemListElement;
        expect(items[0]['@type']).toBe('ListItem');
        expect(items[0].position).toBe(1);
        expect(items[0].name).toBeTruthy();
      }
    });
  });
});

test.describe('SEO Files', () => {
  test.describe('sitemap.xml', () => {
    test('sitemap.xml exists and is accessible', async ({ request }) => {
      const response = await request.get('/sitemap.xml');
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    });

    test('sitemap.xml is valid XML', async ({ request }) => {
      const response = await request.get('/sitemap.xml');
      const content = await response.text();

      expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(content).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(content).toContain('</urlset>');
    });

    test('sitemap.xml contains all main pages', async ({ request }) => {
      const response = await request.get('/sitemap.xml');
      const content = await response.text();

      expect(content).toContain('<loc>');
      expect(content).toContain('index.html');
      expect(content).toContain('pages/about.html');
      expect(content).toContain('pages/skills.html');
      expect(content).toContain('pages/contact.html');
    });

    test('sitemap.xml URLs use full domain', async ({ request }) => {
      const response = await request.get('/sitemap.xml');
      const content = await response.text();

      expect(content).toContain('https://www.yanasharif.com');
    });

    test('sitemap.xml has required elements', async ({ request }) => {
      const response = await request.get('/sitemap.xml');
      const content = await response.text();

      expect(content).toContain('<loc>');
      expect(content).toContain('<lastmod>');
      expect(content).toContain('<changefreq>');
      expect(content).toContain('<priority>');
    });
  });

  test.describe('robots.txt', () => {
    test('robots.txt exists and is accessible', async ({ request }) => {
      const response = await request.get('/robots.txt');
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    });

    test('robots.txt has correct content', async ({ request }) => {
      const response = await request.get('/robots.txt');
      const content = await response.text();

      expect(content).toContain('User-agent: *');
      expect(content).toContain('Allow: /');
      expect(content).toContain('Sitemap:');
    });

    test('robots.txt references sitemap.xml', async ({ request }) => {
      const response = await request.get('/robots.txt');
      const content = await response.text();

      expect(content).toContain('Sitemap: https://www.yanasharif.com/sitemap.xml');
    });
  });
});

test.describe('SEO Best Practices', () => {
  test('about page has no duplicate meta tags', async ({ page }) => {
    await page.goto('/pages/about.html');

    // Check for duplicate OG tags
    const ogTitleCount = await page.locator('meta[property="og:title"]').count();
    expect(ogTitleCount).toBe(1);

    const ogDescriptionCount = await page.locator('meta[property="og:description"]').count();
    expect(ogDescriptionCount).toBe(1);

    const ogImageCount = await page.locator('meta[property="og:image"]').count();
    expect(ogImageCount).toBe(1);
  });

  test('about page has no duplicate canonical tags', async ({ page }) => {
    await page.goto('/pages/about.html');

    const canonicalCount = await page.locator('link[rel="canonical"]').count();
    expect(canonicalCount).toBe(1);
  });

  test('structured data script is in head section', async ({ page }) => {
    await page.goto('/pages/about.html');

    // Get the HTML content
    const htmlContent = await page.content();

    // Find the position of </head> and the structured data script
    const headCloseIndex = htmlContent.indexOf('</head>');
    const structuredDataIndex = htmlContent.indexOf('script type="application/ld+json"');

    expect(structuredDataIndex).toBeGreaterThan(0);
    expect(structuredDataIndex).toBeLessThan(headCloseIndex);
  });

  test('Open Graph images use absolute URLs', async ({ page }) => {
    const pages = ['/pages/about.html', '/pages/portfolio/bestwork/careerbuddy.html'];

    for (const url of pages) {
      await page.goto(url);

      const ogImage = page.locator('meta[property="og:image"]');
      const content = await ogImage.getAttribute('content');

      expect(content).toMatch(/^https:\/\//);
      expect(content).not.toContain('../');
    }
  });
});
