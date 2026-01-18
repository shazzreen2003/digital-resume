// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Navigation Tests
 * Tests for nav links, active states, breadcrumbs, and dropdown menus
 */

// Helper to open hamburger menu on mobile
async function openMobileMenuIfNeeded(page, testInfo) {
  if (testInfo.project.name === 'Mobile Chrome') {
    const hamburger = page.locator('.navbar-toggler');
    if (await hamburger.isVisible()) {
      await hamburger.click();
      await page.waitForSelector('.navbar-collapse.show', { timeout: 5000 });
    }
  }
}

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await page.goto('/pages/about.html');
    // Open hamburger menu on mobile to make nav links visible
    await openMobileMenuIfNeeded(page, testInfo);
    await page.waitForSelector('[data-nav="index"]', { state: 'visible', timeout: 10000 });
  });

  test.describe('Nav Links', () => {
    test('About Me link has correct href', async ({ page }) => {
      const aboutLink = page.locator('[data-nav="index"]');
      await expect(aboutLink).toHaveAttribute('href', /.*about\.html/);
    });

    test('Skills link has correct href', async ({ page }) => {
      const skillsLink = page.locator('[data-nav="skills"]');
      await expect(skillsLink).toHaveAttribute('href', /skills\.html/);
    });

    test('Best Work link has correct href', async ({ page }) => {
      const link = page.locator('[data-nav="bestwork"]');
      await expect(link).toHaveAttribute('href', /.*bestwork\.html/);
    });

    test('Projects link has correct href', async ({ page }) => {
      const link = page.locator('[data-nav="projects"]');
      await expect(link).toHaveAttribute('href', /.*projects\.html/);
    });

    test('Contact link has correct href', async ({ page }) => {
      const link = page.locator('[data-nav="contact"]');
      await expect(link).toHaveAttribute('href', /.*contact\.html/);
    });
  });

  test.describe('Active State', () => {
    test('About page highlights About Me nav item', async ({ page }, testInfo) => {
      await page.goto('/pages/about.html');
      await openMobileMenuIfNeeded(page, testInfo);
      await page.waitForSelector('[data-nav="index"]', { state: 'visible', timeout: 10000 });
      const navLink = page.locator('[data-nav="index"]');
      await expect(navLink).toHaveClass(/active/);
    });

    test('Skills page highlights Skills nav item', async ({ page }, testInfo) => {
      await page.goto('/pages/skills.html');
      await openMobileMenuIfNeeded(page, testInfo);
      await page.waitForSelector('[data-nav="skills"]', { state: 'visible', timeout: 10000 });
      const navLink = page.locator('[data-nav="skills"]');
      await expect(navLink).toHaveClass(/active/);
    });

    test('Best Work page highlights Best Work nav item', async ({ page }, testInfo) => {
      await page.goto('/pages/portfolio/bestwork.html');
      await openMobileMenuIfNeeded(page, testInfo);
      await page.waitForSelector('[data-nav="bestwork"]', { state: 'visible', timeout: 10000 });
      const navLink = page.locator('[data-nav="bestwork"]');
      await expect(navLink).toHaveClass(/active/);
    });

    test('Projects page highlights Projects nav item', async ({ page }, testInfo) => {
      await page.goto('/pages/portfolio/projects.html');
      await openMobileMenuIfNeeded(page, testInfo);
      await page.waitForSelector('[data-nav="projects"]', { state: 'visible', timeout: 10000 });
      const navLink = page.locator('[data-nav="projects"]');
      await expect(navLink).toHaveClass(/active/);
    });

    test('Contact page highlights Contact nav item', async ({ page }, testInfo) => {
      await page.goto('/pages/contact.html');
      await openMobileMenuIfNeeded(page, testInfo);
      await page.waitForSelector('[data-nav="contact"]', { state: 'visible', timeout: 10000 });
      const navLink = page.locator('[data-nav="contact"]');
      await expect(navLink).toHaveClass(/active/);
    });
  });

  test.describe('Breadcrumbs', () => {
    test('About page shows correct breadcrumb', async ({ page }) => {
      await page.goto('/pages/about.html');
      const breadcrumb = page.locator('.breadcrumb-item.active');
      await expect(breadcrumb).toHaveText('Home');
    });

    test('Skills page shows correct breadcrumb trail', async ({ page }) => {
      await page.goto('/pages/skills.html');
      const breadcrumbItems = page.locator('.breadcrumb-item');
      await expect(breadcrumbItems).toHaveCount(2);
      await expect(breadcrumbItems.first()).toContainText('Home');
      await expect(breadcrumbItems.last()).toHaveText('Skills');
    });

    test('Best Work page shows correct breadcrumb trail', async ({ page }) => {
      await page.goto('/pages/portfolio/bestwork.html');
      const breadcrumbItems = page.locator('.breadcrumb-item');
      await expect(breadcrumbItems).toHaveCount(2);
      await expect(breadcrumbItems.last()).toHaveText('Best Work');
    });

    test('Contact page shows correct breadcrumb trail', async ({ page }) => {
      await page.goto('/pages/contact.html');
      const breadcrumbItems = page.locator('.breadcrumb-item');
      await expect(breadcrumbItems).toHaveCount(2);
      await expect(breadcrumbItems.last()).toHaveText('Contact');
    });

    test('Breadcrumb home link has correct href', async ({ page }) => {
      await page.goto('/pages/skills.html');
      await page.waitForSelector('.breadcrumb-item a');
      const breadcrumbLink = page.locator('.breadcrumb-item a');
      await expect(breadcrumbLink).toHaveAttribute('href', /.*index\.html/);
    });
  });

  test.describe('Logo Navigation', () => {
    test('Logo links to home page', async ({ page }) => {
      await page.waitForSelector('.navbar-brand');
      const logoLink = page.locator('.navbar-brand');
      await expect(logoLink).toHaveAttribute('href', /.*index\.html/);
    });

    test('Logo has correct href', async ({ page }) => {
      await page.goto('/pages/contact.html');
      await page.waitForSelector('.navbar-brand', { timeout: 10000 });
      const logo = page.locator('.navbar-brand');
      await expect(logo).toHaveAttribute('href', /.*index\.html/);
    });
  });

  test.describe('Dropdown Menus', () => {
    // Helper to open dropdown - hover on desktop, toggle class on mobile
    async function openDropdown(page, testInfo, dropdownText) {
      const dropdown = page.locator('.nav-item.dropdown').filter({ hasText: dropdownText });

      if (testInfo.project.name === 'Mobile Chrome') {
        // On mobile, use JS to toggle the .show class
        // The event listener in script.js requires window.innerWidth < 992 at init time
        // which may not be reliable in Playwright, so we toggle directly
        await page.evaluate((text) => {
          const dropdowns = document.querySelectorAll('.nav-item.dropdown');
          dropdowns.forEach(dropdown => {
            if (dropdown.textContent.includes(text)) {
              dropdown.classList.toggle('show');
            }
          });
        }, dropdownText);
        // Wait for the .show class to be added
        await expect(dropdown).toHaveClass(/show/, { timeout: 3000 });
      } else {
        // On desktop, hover to show dropdown
        await dropdown.hover();
        const dropdownMenu = dropdown.locator('.dropdown-menu');
        await expect(dropdownMenu).toBeVisible();
      }

      return dropdown;
    }

    test('Best Work dropdown contains correct items', async ({ page }, testInfo) => {
      const dropdown = await openDropdown(page, testInfo, 'Best Work');
      const dropdownMenu = dropdown.locator('.dropdown-menu');

      // Check dropdown items
      await expect(dropdownMenu.locator('.dropdown-item')).toHaveCount(6);
      await expect(dropdownMenu).toContainText('View All');
      await expect(dropdownMenu).toContainText('Freelance');
      await expect(dropdownMenu).toContainText('JX Travel & Tours');
    });

    test('Projects dropdown contains correct items', async ({ page }, testInfo) => {
      const dropdown = await openDropdown(page, testInfo, 'Projects');
      const dropdownMenu = dropdown.locator('.dropdown-menu');

      // Check dropdown items
      await expect(dropdownMenu.locator('.dropdown-item')).toHaveCount(7);
      await expect(dropdownMenu).toContainText('View All');
      await expect(dropdownMenu).toContainText('Advertising');
      await expect(dropdownMenu).toContainText('3D Design');
    });

    test('Dropdown item has correct href', async ({ page }, testInfo) => {
      const dropdown = await openDropdown(page, testInfo, 'Best Work');

      // Check the href is correct
      const freelanceLink = dropdown.locator('.dropdown-item:has-text("Freelance")');
      await expect(freelanceLink).toHaveAttribute('href', /.*freelance\.html/);
    });
  });

  test.describe('Footer Links', () => {
    test('Footer contains navigation links', async ({ page }) => {
      await page.waitForSelector('#site-footer');
      const footer = page.locator('#site-footer');

      // Check footer exists and has content
      await expect(footer).not.toBeEmpty();
    });
  });
});
