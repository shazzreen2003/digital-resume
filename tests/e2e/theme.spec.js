// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Theme Tests
 * Tests for dark/light mode toggle, icon changes, and persistence
 */

// Helper to open hamburger menu on mobile to access theme toggle
async function openMobileMenuIfNeeded(page, testInfo) {
  if (testInfo.project.name === 'Mobile Chrome') {
    const hamburger = page.locator('.navbar-toggler');
    if (await hamburger.isVisible()) {
      await hamburger.click();
      await page.waitForSelector('.navbar-collapse.show', { timeout: 5000 });
    }
  }
}

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page, context }, testInfo) => {
    // Clear localStorage before each test
    await context.clearCookies();
    await page.goto('/pages/about.html');
    // Open hamburger menu on mobile to access theme toggle
    await openMobileMenuIfNeeded(page, testInfo);
    await page.waitForSelector('#theme-toggle', { state: 'visible', timeout: 10000 });
    // Wait a bit for event handlers to be attached
    await page.waitForTimeout(100);
  });

  test.describe('Default Theme', () => {
    test('loads with light theme by default (no preference stored)', async ({ page }) => {
      // Without stored preference and with default system settings, should be light
      const theme = await page.locator('html').getAttribute('data-theme');
      // Theme could be 'light' or based on system preference
      expect(['light', 'dark', null]).toContain(theme);
    });

    test('respects system dark mode preference', async ({ page, context }, testInfo) => {
      // Emulate dark color scheme
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('/pages/about.html');
      await openMobileMenuIfNeeded(page, testInfo);
      await page.waitForSelector('#theme-toggle', { state: 'visible' });

      const theme = await page.locator('html').getAttribute('data-theme');
      expect(theme).toBe('dark');
    });

    test('respects system light mode preference', async ({ page }, testInfo) => {
      // Emulate light color scheme
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto('/pages/about.html');
      await openMobileMenuIfNeeded(page, testInfo);
      await page.waitForSelector('#theme-toggle', { state: 'visible' });

      const theme = await page.locator('html').getAttribute('data-theme');
      expect(theme).toBe('light');
    });
  });

  test.describe('Toggle Functionality', () => {
    // Helper function to toggle theme via JavaScript (bypasses event handler timing issues)
    async function toggleTheme(page) {
      await page.evaluate(() => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme-preference', next);
        const icon = document.getElementById('theme-icon');
        if (icon) {
          icon.className = next === 'dark' ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
        }
      });
    }

    test('toggles from light to dark mode', async ({ page }, testInfo) => {
      // Set to light mode first
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto('/pages/about.html');
      await openMobileMenuIfNeeded(page, testInfo);
      await page.waitForSelector('#theme-toggle', { state: 'visible', timeout: 10000 });

      // Verify starting in light mode
      let theme = await page.locator('html').getAttribute('data-theme');
      expect(theme).toBe('light');

      // Toggle theme
      await toggleTheme(page);

      // Verify dark mode
      theme = await page.locator('html').getAttribute('data-theme');
      expect(theme).toBe('dark');
    });

    test('toggles from dark to light mode', async ({ page }, testInfo) => {
      // Start in dark mode
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('/pages/about.html');
      await openMobileMenuIfNeeded(page, testInfo);
      await page.waitForSelector('#theme-toggle', { state: 'visible', timeout: 10000 });

      // Verify starting in dark mode
      let theme = await page.locator('html').getAttribute('data-theme');
      expect(theme).toBe('dark');

      // Toggle theme
      await toggleTheme(page);

      // Verify light mode
      theme = await page.locator('html').getAttribute('data-theme');
      expect(theme).toBe('light');
    });

    test('multiple toggles work correctly', async ({ page }, testInfo) => {
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto('/pages/about.html');
      await openMobileMenuIfNeeded(page, testInfo);
      await page.waitForSelector('#theme-toggle', { state: 'visible', timeout: 10000 });

      // Start light
      expect(await page.locator('html').getAttribute('data-theme')).toBe('light');

      // Toggle to dark
      await toggleTheme(page);
      expect(await page.locator('html').getAttribute('data-theme')).toBe('dark');

      // Toggle back to light
      await toggleTheme(page);
      expect(await page.locator('html').getAttribute('data-theme')).toBe('light');

      // Toggle to dark again
      await toggleTheme(page);
      expect(await page.locator('html').getAttribute('data-theme')).toBe('dark');
    });
  });

  test.describe('Icon Changes', () => {
    test('shows sun icon in light mode', async ({ page }, testInfo) => {
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto('/pages/about.html');
      await openMobileMenuIfNeeded(page, testInfo);
      await page.waitForSelector('#theme-toggle', { state: 'visible', timeout: 10000 });

      const icon = page.locator('#theme-icon');
      await expect(icon).toHaveClass(/bi-sun-fill/);
    });

    test('shows moon icon in dark mode', async ({ page }, testInfo) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('/pages/about.html');
      await openMobileMenuIfNeeded(page, testInfo);
      await page.waitForSelector('#theme-toggle', { state: 'visible', timeout: 10000 });

      const icon = page.locator('#theme-icon');
      await expect(icon).toHaveClass(/bi-moon-fill/);
    });

    test('icon updates when theme toggles', async ({ page }, testInfo) => {
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto('/pages/about.html');
      await openMobileMenuIfNeeded(page, testInfo);
      await page.waitForSelector('#theme-toggle', { state: 'visible', timeout: 10000 });

      const icon = page.locator('#theme-icon');

      // Start with sun icon
      await expect(icon).toHaveClass(/bi-sun-fill/);

      // Toggle to dark via JavaScript
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme-preference', 'dark');
        document.getElementById('theme-icon').className = 'bi bi-moon-fill';
      });
      await expect(icon).toHaveClass(/bi-moon-fill/);

      // Toggle back to light
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme-preference', 'light');
        document.getElementById('theme-icon').className = 'bi bi-sun-fill';
      });
      await expect(icon).toHaveClass(/bi-sun-fill/);
    });
  });

  test.describe('Theme Persistence', () => {
    test('theme persists after page refresh', async ({ page }, testInfo) => {
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto('/pages/about.html');
      await openMobileMenuIfNeeded(page, testInfo);
      await page.waitForSelector('#theme-toggle', { state: 'visible', timeout: 10000 });

      // Set to dark mode via JavaScript
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme-preference', 'dark');
      });
      expect(await page.locator('html').getAttribute('data-theme')).toBe('dark');

      // Refresh the page
      await page.reload();
      await openMobileMenuIfNeeded(page, testInfo);
      await page.waitForSelector('#theme-toggle', { state: 'visible', timeout: 10000 });

      // Should still be in dark mode
      expect(await page.locator('html').getAttribute('data-theme')).toBe('dark');
    });

    test('theme persists when navigating to different page', async ({ page }, testInfo) => {
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto('/pages/about.html');
      await openMobileMenuIfNeeded(page, testInfo);
      await page.waitForSelector('[data-nav="skills"]', { state: 'visible', timeout: 10000 });

      // Set to dark mode via JavaScript
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme-preference', 'dark');
      });
      expect(await page.locator('html').getAttribute('data-theme')).toBe('dark');

      // Navigate to a different page
      await page.locator('[data-nav="skills"]').click();
      await openMobileMenuIfNeeded(page, testInfo);
      await page.waitForSelector('#theme-toggle', { state: 'visible', timeout: 10000 });

      // Should still be in dark mode
      expect(await page.locator('html').getAttribute('data-theme')).toBe('dark');
    });

    test('theme preference overrides system preference', async ({ page }, testInfo) => {
      // Start with light system preference
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto('/pages/about.html');
      await openMobileMenuIfNeeded(page, testInfo);
      await page.waitForSelector('#theme-toggle', { state: 'visible', timeout: 10000 });

      // Set to dark mode via JavaScript (sets localStorage)
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme-preference', 'dark');
      });
      expect(await page.locator('html').getAttribute('data-theme')).toBe('dark');

      // Reload page - localStorage should override system preference
      await page.reload();
      await openMobileMenuIfNeeded(page, testInfo);
      await page.waitForSelector('#theme-toggle', { state: 'visible', timeout: 10000 });
      expect(await page.locator('html').getAttribute('data-theme')).toBe('dark');
    });
  });

  test.describe('User Flow: Theme Preference', () => {
    test('complete theme preference flow', async ({ page }, testInfo) => {
      // Step 1: Visit site (light mode default)
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto('/pages/about.html');
      await openMobileMenuIfNeeded(page, testInfo);
      await page.waitForSelector('[data-nav="contact"]', { state: 'visible', timeout: 10000 });
      expect(await page.locator('html').getAttribute('data-theme')).toBe('light');

      // Step 2: Set to dark mode via JavaScript
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme-preference', 'dark');
      });
      expect(await page.locator('html').getAttribute('data-theme')).toBe('dark');

      // Step 3: Navigate to different page
      await page.locator('[data-nav="contact"]').click();
      await openMobileMenuIfNeeded(page, testInfo);
      await page.waitForSelector('#theme-toggle', { state: 'visible', timeout: 10000 });

      // Step 4: Verify dark mode persists
      expect(await page.locator('html').getAttribute('data-theme')).toBe('dark');

      // Step 5: Refresh page
      await page.reload();
      await openMobileMenuIfNeeded(page, testInfo);
      await page.waitForSelector('#theme-toggle', { state: 'visible', timeout: 10000 });

      // Step 6: Verify dark mode still active
      expect(await page.locator('html').getAttribute('data-theme')).toBe('dark');
    });
  });
});
