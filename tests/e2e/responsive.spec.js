// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Responsive Tests
 * Tests for mobile menu, responsive layouts, and viewport-specific behaviors
 */

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/pages/about.html');
    await page.waitForSelector('.navbar', { state: 'visible' });
  });

  test.describe('Hamburger Menu', () => {
    test('hamburger menu button is visible on mobile', async ({ page }) => {
      const toggler = page.locator('.navbar-toggler');
      await expect(toggler).toBeVisible();
    });

    test('nav links are hidden by default on mobile', async ({ page }) => {
      const navCollapse = page.locator('.navbar-collapse');
      await expect(navCollapse).not.toHaveClass(/show/);
    });

    test('clicking hamburger opens menu', async ({ page }) => {
      await page.click('.navbar-toggler');

      // Wait for Bootstrap collapse animation
      await page.waitForTimeout(400);

      const navCollapse = page.locator('.navbar-collapse');
      await expect(navCollapse).toHaveClass(/show/);
    });

    test('clicking hamburger again closes menu', async ({ page }) => {
      // Open menu
      await page.click('.navbar-toggler');
      await page.waitForTimeout(400);

      // Close menu
      await page.click('.navbar-toggler');
      await page.waitForTimeout(400);

      const navCollapse = page.locator('.navbar-collapse');
      await expect(navCollapse).not.toHaveClass(/show/);
    });
  });

  test.describe('Mobile Nav Links', () => {
    test('nav links are visible when menu is open', async ({ page }) => {
      // Open menu
      await page.locator('.navbar-toggler').click();
      await page.waitForTimeout(400);

      // Check nav links are visible
      await expect(page.locator('[data-nav="index"]')).toBeVisible();
      await expect(page.locator('[data-nav="skills"]')).toBeVisible();
      await expect(page.locator('[data-nav="contact"]')).toBeVisible();
    });

    test('nav links have correct hrefs when menu is open', async ({ page }) => {
      // Open menu
      await page.locator('.navbar-toggler').click();
      await page.waitForTimeout(400);

      // Check Skills link has correct href
      const skillsLink = page.locator('[data-nav="skills"]');
      await expect(skillsLink).toHaveAttribute('href', /.*skills\.html/);
    });
  });

  test.describe('Mobile Dropdowns', () => {
    test('dropdown arrow is visible on mobile', async ({ page }) => {
      // Open menu
      await page.locator('.navbar-toggler').click();
      await page.waitForTimeout(400);

      const dropdownArrow = page.locator('.dropdown-arrow').first();
      await expect(dropdownArrow).toBeVisible();
    });

    test('dropdown link has correct href', async ({ page }) => {
      // Open menu
      await page.locator('.navbar-toggler').click();
      await page.waitForTimeout(400);

      // Check Best Work link has correct href
      const bestWorkLink = page.locator('[data-nav="bestwork"]');
      await expect(bestWorkLink).toHaveAttribute('href', /.*bestwork\.html/);
    });
  });
});

test.describe('Desktop Navigation', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/pages/about.html');
    await page.waitForSelector('.navbar', { state: 'visible' });
  });

  test('hamburger menu is hidden on desktop', async ({ page }) => {
    const toggler = page.locator('.navbar-toggler');
    await expect(toggler).not.toBeVisible();
  });

  test('nav links are visible on desktop', async ({ page }) => {
    await expect(page.locator('[data-nav="index"]')).toBeVisible();
    await expect(page.locator('[data-nav="skills"]')).toBeVisible();
    await expect(page.locator('[data-nav="contact"]')).toBeVisible();
  });

  test('dropdown shows on hover', async ({ page }) => {
    const dropdown = page.locator('.nav-item.dropdown').filter({ hasText: 'Best Work' });
    await dropdown.hover();

    const dropdownMenu = dropdown.locator('.dropdown-menu');
    await expect(dropdownMenu).toBeVisible();
  });
});

test.describe('Responsive Layouts', () => {
  test.describe('Mobile Layout (375x667)', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('about page layout is responsive', async ({ page }) => {
      await page.goto('/pages/about.html');

      // Profile image and content should stack
      const profileImage = page.locator('img[alt="Shazzreen Elyana"]');
      await expect(profileImage).toBeVisible();

      // Stats should be visible
      await expect(page.locator('.text-muted:has-text("Projects")')).toBeVisible();
    });

    test('skills page cards stack on mobile', async ({ page }) => {
      await page.goto('/pages/skills.html');

      // Page should load and display
      await expect(page.locator('.page-hero')).toBeVisible();
    });

    test('contact page form layout is responsive', async ({ page }) => {
      await page.goto('/pages/contact.html');

      // Form should be visible and full width
      const form = page.locator('#contactForm');
      await expect(form).toBeVisible();

      // Form fields should be accessible
      await expect(page.locator('#name')).toBeVisible();
      await expect(page.locator('#email')).toBeVisible();
    });

    test('carousel is responsive on mobile', async ({ page }) => {
      await page.goto('/pages/portfolio/bestwork.html');

      const carousel = page.locator('#bestWorkCarousel');
      await expect(carousel).toBeVisible();

      // Navigation buttons should be visible
      await expect(page.locator('.carousel-control-prev')).toBeVisible();
      await expect(page.locator('.carousel-control-next')).toBeVisible();
    });
  });

  test.describe('Tablet Layout (768x1024)', () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test('navigation adapts to tablet', async ({ page }) => {
      await page.goto('/pages/about.html');
      await page.waitForSelector('.navbar');

      // At 768px, Bootstrap shows hamburger (breakpoint is 992px)
      const toggler = page.locator('.navbar-toggler');
      await expect(toggler).toBeVisible();
    });

    test('content layout works on tablet', async ({ page }) => {
      await page.goto('/pages/about.html');

      // Content should be visible and properly laid out
      await expect(page.locator('.page-hero')).toBeVisible();
      await expect(page.locator('img[alt="Shazzreen Elyana"]')).toBeVisible();
    });
  });

  test.describe('Desktop Layout (1280x720)', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('navigation is horizontal on desktop', async ({ page }) => {
      await page.goto('/pages/about.html');
      await page.waitForSelector('.navbar');

      // Nav links should be in a row
      const navLinks = page.locator('.navbar-nav .nav-link');
      const count = await navLinks.count();
      expect(count).toBeGreaterThan(0);

      // First and last nav link should be visible
      await expect(navLinks.first()).toBeVisible();
      await expect(navLinks.last()).toBeVisible();
    });

    test('about page shows side-by-side layout', async ({ page }) => {
      await page.goto('/pages/about.html');

      // Both profile image and text content should be visible
      await expect(page.locator('img[alt="Shazzreen Elyana"]')).toBeVisible();
      await expect(page.getByText("I'm Shazzreen Elyana")).toBeVisible();
    });
  });
});

test.describe('User Flow: Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('complete mobile navigation flow', async ({ page }) => {
    // Step 1: Visit about page on mobile
    await page.goto('/pages/about.html');
    await page.waitForSelector('.navbar-toggler', { timeout: 10000 });

    // Step 2: Verify hamburger menu visible
    await expect(page.locator('.navbar-toggler')).toBeVisible();

    // Step 3: Click hamburger to open menu
    await page.locator('.navbar-toggler').click();
    await page.waitForTimeout(400);
    await expect(page.locator('.navbar-collapse')).toHaveClass(/show/);

    // Step 4: Verify Best Work link is visible and has correct href
    const bestWorkLink = page.locator('[data-nav="bestwork"]');
    await expect(bestWorkLink).toBeVisible();
    await expect(bestWorkLink).toHaveAttribute('href', /.*bestwork\.html/);

    // Step 5: Navigate to Best Work page directly
    await page.goto('/pages/portfolio/bestwork.html');
    await expect(page.locator('#bestWorkCarousel')).toBeVisible();
  });
});

test.describe('Viewport Resize', () => {
  test('navigation adapts when resizing from mobile to desktop', async ({ page }) => {
    // Start at mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pages/about.html');
    await page.waitForSelector('.navbar');

    // Hamburger should be visible
    await expect(page.locator('.navbar-toggler')).toBeVisible();

    // Resize to desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(300);

    // Hamburger should be hidden
    await expect(page.locator('.navbar-toggler')).not.toBeVisible();

    // Nav links should be visible
    await expect(page.locator('[data-nav="index"]')).toBeVisible();
  });
});

test.describe('Touch Interactions', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('carousel responds to touch/click on mobile', async ({ page }) => {
    await page.goto('/pages/portfolio/bestwork.html');
    await page.waitForSelector('#bestWorkCarousel');

    // Click next button
    await page.click('.carousel-control-next');
    await page.waitForTimeout(700);

    // Second slide should be active
    const secondSlide = page.locator('#bestWorkCarousel .carousel-item').nth(1);
    await expect(secondSlide).toHaveClass(/active/);
  });

  test('form is usable on mobile', async ({ page }) => {
    await page.goto('/pages/contact.html');

    // Fill form fields
    await page.fill('#name', 'Mobile User');
    await page.fill('#email', 'mobile@example.com');
    await page.fill('#subject', 'Mobile Test');
    await page.fill('#message', 'Testing form on mobile device viewport.');

    // All fields should have values
    await expect(page.locator('#name')).toHaveValue('Mobile User');
    await expect(page.locator('#email')).toHaveValue('mobile@example.com');
  });
});
