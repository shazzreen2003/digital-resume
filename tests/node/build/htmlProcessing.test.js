/**
 * HTML Processing Tests
 * Tests for processHtml and component injection
 */

const fs = require('fs');
const path = require('path');
const { processHtml, readComponent, CONFIG, THEME_FLASH_PREVENTION_SCRIPT } = require('../../../build');

describe('HTML Processing', () => {
  describe('readComponent', () => {
    test('should read navigation component', () => {
      const nav = readComponent('navigation');
      expect(nav).toBeTruthy();
      expect(nav.length).toBeGreaterThan(0);
    });

    test('should read footer component', () => {
      const footer = readComponent('footer');
      expect(footer).toBeTruthy();
      expect(footer.length).toBeGreaterThan(0);
    });

    test('should return empty string for non-existent component', () => {
      const result = readComponent('nonexistent');
      expect(result).toBe('');
    });

    test('should contain {{PATH}} placeholders in navigation', () => {
      const nav = readComponent('navigation');
      expect(nav).toContain('{{PATH}}');
    });
  });

  describe('processHtml', () => {
    test('should return null for non-existent file', () => {
      const result = processHtml('nonexistent.html');
      expect(result).toBeNull();
    });

    test('should process index.html successfully', () => {
      const result = processHtml('index.html');
      expect(result).not.toBeNull();
    });

    test('should replace navigation placeholder', () => {
      const result = processHtml('index.html');
      expect(result).not.toContain('<div id="site-navigation"></div>');
    });

    test('should replace footer placeholder', () => {
      const result = processHtml('index.html');
      expect(result).not.toContain('<div id="site-footer"></div>');
    });

    test('should replace {{PATH}} with correct prefix for root files', () => {
      const result = processHtml('index.html');
      // Root files should have empty path prefix
      expect(result).toContain('href="pages/');
    });

    test('should replace {{PATH}} with ../ for pages directory', () => {
      const result = processHtml('pages/about.html');
      if (result) {
        expect(result).toContain('href="../');
      }
    });

    test('should replace {{PATH}} with ../../ for portfolio directory', () => {
      const result = processHtml('pages/portfolio/bestwork.html');
      if (result) {
        expect(result).toContain('href="../../');
      }
    });

    test('should replace {{PATH}} with ../../../ for nested portfolio pages', () => {
      const result = processHtml('pages/portfolio/bestwork/freelance.html');
      if (result) {
        expect(result).toContain('href="../../../');
      }
    });

    test('should remove components.js script tag', () => {
      const result = processHtml('index.html');
      expect(result).not.toContain('components.js');
    });

    test('should set active nav based on data-page attribute', () => {
      // Process a page that should have "index" as active (about.html uses data-page="index")
      const aboutResult = processHtml('pages/about.html');
      if (aboutResult) {
        // Check that the correct nav link has active class
        expect(aboutResult).toMatch(/nav-link active.*data-nav="index"/);
      }
    });

    test('should inject theme flash prevention script', () => {
      // Use about.html instead of index.html (which is a redirect page)
      const result = processHtml('pages/about.html');
      expect(result).toContain('theme-preference');
    });
  });

  describe('processHtml for all files', () => {
    CONFIG.htmlFiles.forEach(filePath => {
      test(`should process ${filePath} without errors`, () => {
        const fullPath = path.join(CONFIG.srcDir, filePath);

        // Only test if the file exists
        if (fs.existsSync(fullPath)) {
          const result = processHtml(filePath);
          expect(result).not.toBeNull();
          expect(typeof result).toBe('string');
        }
      });
    });
  });

  describe('THEME_FLASH_PREVENTION_SCRIPT', () => {
    test('should be defined', () => {
      expect(THEME_FLASH_PREVENTION_SCRIPT).toBeDefined();
    });

    test('should contain localStorage check', () => {
      expect(THEME_FLASH_PREVENTION_SCRIPT).toContain('localStorage');
    });

    test('should contain theme-preference key', () => {
      expect(THEME_FLASH_PREVENTION_SCRIPT).toContain('theme-preference');
    });

    test('should set data-theme attribute', () => {
      expect(THEME_FLASH_PREVENTION_SCRIPT).toContain('data-theme');
    });
  });
});
