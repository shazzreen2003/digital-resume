// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Portfolio Tests
 * Tests for carousels, portfolio pages, and project detail pages
 */

test.describe('Portfolio - Best Work', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pages/portfolio/bestwork.html');
    await page.waitForSelector('#bestWorkCarousel', { state: 'visible' });
  });

  test.describe('Carousel Structure', () => {
    test('carousel loads with 5 slides', async ({ page }) => {
      const slides = page.locator('#bestWorkCarousel .carousel-item');
      await expect(slides).toHaveCount(5);
    });

    test('carousel has 5 indicators', async ({ page }) => {
      const indicators = page.locator('#bestWorkCarousel .carousel-indicators button');
      await expect(indicators).toHaveCount(5);
    });

    test('first slide is active by default', async ({ page }) => {
      const firstSlide = page.locator('#bestWorkCarousel .carousel-item').first();
      await expect(firstSlide).toHaveClass(/active/);
    });

    test('first indicator is active by default', async ({ page }) => {
      const firstIndicator = page.locator('#bestWorkCarousel .carousel-indicators button').first();
      await expect(firstIndicator).toHaveClass(/active/);
    });

    test('carousel has prev/next buttons', async ({ page }) => {
      await expect(page.locator('#bestWorkCarousel .carousel-control-prev')).toBeVisible();
      await expect(page.locator('#bestWorkCarousel .carousel-control-next')).toBeVisible();
    });
  });

  test.describe('Carousel Navigation', () => {
    test('next button advances to next slide', async ({ page }) => {
      // Click next
      await page.click('#bestWorkCarousel .carousel-control-next');

      // Wait for transition
      await page.waitForTimeout(700);

      // Second slide should be active
      const secondSlide = page.locator('#bestWorkCarousel .carousel-item').nth(1);
      await expect(secondSlide).toHaveClass(/active/);
    });

    test('prev button goes to previous slide', async ({ page }) => {
      // Go to second slide first
      await page.click('#bestWorkCarousel .carousel-control-next');
      await page.waitForTimeout(700);

      // Click prev
      await page.click('#bestWorkCarousel .carousel-control-prev');
      await page.waitForTimeout(700);

      // First slide should be active
      const firstSlide = page.locator('#bestWorkCarousel .carousel-item').first();
      await expect(firstSlide).toHaveClass(/active/);
    });

    test('clicking indicator shows corresponding slide', async ({ page }) => {
      // Click third indicator (index 2)
      await page.click('#bestWorkCarousel .carousel-indicators button[data-bs-slide-to="2"]');
      await page.waitForTimeout(700);

      // Third slide should be active
      const thirdSlide = page.locator('#bestWorkCarousel .carousel-item').nth(2);
      await expect(thirdSlide).toHaveClass(/active/);
    });

    test('indicator updates when navigating', async ({ page }) => {
      // Click next
      await page.click('#bestWorkCarousel .carousel-control-next');
      await page.waitForTimeout(700);

      // Second indicator should be active
      const secondIndicator = page.locator('#bestWorkCarousel .carousel-indicators button').nth(1);
      await expect(secondIndicator).toHaveClass(/active/);
    });
  });

  test.describe('Carousel Auto-Advance', () => {
    test('carousel auto-advances slides', async ({ page }) => {
      // The carousel has data-bs-interval="2000" (2 seconds)
      const firstSlide = page.locator('#bestWorkCarousel .carousel-item').first();

      // Verify first slide is active
      await expect(firstSlide).toHaveClass(/active/);

      // Wait for auto-advance (2 seconds + buffer)
      await page.waitForTimeout(2500);

      // First slide should no longer be active
      await expect(firstSlide).not.toHaveClass(/active/);

      // Second slide should be active
      const secondSlide = page.locator('#bestWorkCarousel .carousel-item').nth(1);
      await expect(secondSlide).toHaveClass(/active/);
    });
  });

  test.describe('View Artwork Links', () => {
    test('Freelance link has correct href', async ({ page }) => {
      // Target specifically the carousel link, not the dropdown
      const freelanceLink = page.locator('#bestWorkCarousel a.carousel-btn[href*="freelance.html"]');
      await expect(freelanceLink).toHaveAttribute('href', /freelance\.html/);
    });

    test('JX Travel link has correct href', async ({ page }) => {
      // Navigate to second slide
      await page.locator('#bestWorkCarousel .carousel-control-next').click();
      await page.waitForTimeout(700);

      // Target specifically the carousel link
      const jxTravelLink = page.locator('#bestWorkCarousel a.carousel-btn[href*="jxtravel.html"]');
      await expect(jxTravelLink).toHaveAttribute('href', /jxtravel\.html/);
    });
  });

  test.describe('Slide Content', () => {
    test('each slide has card with image and title', async ({ page }) => {
      const slides = page.locator('#bestWorkCarousel .carousel-item');

      for (let i = 0; i < 5; i++) {
        const slide = slides.nth(i);
        await expect(slide.locator('.card-img-top')).toBeVisible();
        await expect(slide.locator('.card-title')).toBeVisible();
        await expect(slide.locator('.carousel-btn')).toBeVisible();
      }
    });

    test('slides have correct titles', async ({ page }) => {
      const titles = [
        'Freelance',
        'JX Travel & Tours',
        'Pearlie White',
        'Rimbrew Coffee Shop',
        'Career Buddy'
      ];

      for (let i = 0; i < titles.length; i++) {
        const slide = page.locator('#bestWorkCarousel .carousel-item').nth(i);
        await expect(slide.locator('.card-title')).toHaveText(titles[i]);
      }
    });
  });
});

test.describe('Portfolio - Projects', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pages/portfolio/projects.html');
    await page.waitForSelector('.carousel', { state: 'visible' });
  });

  test.describe('Carousel Structure', () => {
    test('projects carousel loads with slides', async ({ page }) => {
      const slides = page.locator('.carousel-item');
      const count = await slides.count();
      expect(count).toBeGreaterThan(0);
    });

    test('carousel has navigation controls', async ({ page }) => {
      await expect(page.locator('.carousel-control-prev')).toBeVisible();
      await expect(page.locator('.carousel-control-next')).toBeVisible();
    });
  });
});

test.describe('Portfolio - Detail Pages', () => {
  const detailPages = [
    { path: '/pages/portfolio/bestwork/freelance.html', title: 'Freelance' },
    { path: '/pages/portfolio/bestwork/jxtravel.html', title: 'JX Travel' },
    { path: '/pages/portfolio/bestwork/pearliewhite.html', title: 'Pearlie White' },
    { path: '/pages/portfolio/bestwork/rimbrew.html', title: 'Rimbrew' },
    { path: '/pages/portfolio/bestwork/careerbuddy.html', title: 'Career Buddy' },
  ];

  for (const { path, title } of detailPages) {
    test(`${title} detail page loads correctly`, async ({ page }) => {
      await page.goto(path);

      // Page should load without errors
      await expect(page.locator('body')).toBeVisible();

      // Should have navigation
      await expect(page.locator('.navbar')).toBeVisible();

      // Should have page content
      await expect(page.locator('.page-hero')).toBeVisible();
    });
  }

  test.describe('Detail Page Carousel', () => {
    test('detail page has image carousel', async ({ page }) => {
      await page.goto('/pages/portfolio/bestwork/freelance.html');

      // Check for carousel or image gallery
      const hasCarousel = await page.locator('.carousel').count() > 0;
      const hasImages = await page.locator('img').count() > 0;

      expect(hasCarousel || hasImages).toBeTruthy();
    });
  });
});

test.describe('User Flow: Portfolio Browsing', () => {
  test('browse portfolio pages directly', async ({ page }) => {
    // Step 1: Start at Best Work page
    await page.goto('/pages/portfolio/bestwork.html');
    await page.waitForSelector('#bestWorkCarousel');

    // Step 2: View carousel
    const slides = page.locator('#bestWorkCarousel .carousel-item');
    await expect(slides).toHaveCount(5);

    // Step 3: Navigate through carousel
    await page.locator('#bestWorkCarousel .carousel-control-next').click();
    await page.waitForTimeout(700);

    // Step 4: Verify JX Travel carousel link exists (be specific to avoid dropdown)
    const jxTravelLink = page.locator('#bestWorkCarousel a.carousel-btn[href*="jxtravel.html"]');
    await expect(jxTravelLink).toBeVisible();

    // Step 5: Navigate to a detail page directly
    await page.goto('/pages/portfolio/bestwork/jxtravel.html');
    await expect(page.locator('body')).toBeVisible();

    // Step 6: Navigate to Projects directly
    await page.goto('/pages/portfolio/projects.html');
    await expect(page.locator('.page-hero')).toBeVisible();
  });
});
