/**
 * HTML Processing Tests
 * Tests for processHtmlWithLang and component injection
 */

const fs = require('fs');
const path = require('path');
const {
  processHtmlWithLang,
  readComponent,
  loadTranslations,
  CONFIG,
  THEME_FLASH_PREVENTION_SCRIPT
} = require('../../../build');

describe('HTML Processing', () => {
  // Load English translations for testing
  let translations;

  beforeAll(() => {
    translations = loadTranslations('en');
  });

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

  describe('processHtmlWithLang', () => {
    test('should return null for non-existent file', () => {
      const result = processHtmlWithLang('nonexistent.html', 'en', translations);
      expect(result).toBeNull();
    });

    test('should process about.html successfully', () => {
      const result = processHtmlWithLang('pages/about.html', 'en', translations);
      expect(result).not.toBeNull();
    });

    test('should replace navigation placeholder', () => {
      const result = processHtmlWithLang('pages/about.html', 'en', translations);
      expect(result).not.toContain('<div id="site-navigation"></div>');
    });

    test('should replace footer placeholder', () => {
      const result = processHtmlWithLang('pages/about.html', 'en', translations);
      expect(result).not.toContain('<div id="site-footer"></div>');
    });

    test('should replace {{PATH}} with ../ for pages directory', () => {
      const result = processHtmlWithLang('pages/about.html', 'en', translations);
      if (result) {
        expect(result).toContain('href="../');
      }
    });

    test('should replace {{PATH}} with ../../ for portfolio directory', () => {
      const result = processHtmlWithLang('pages/portfolio/bestwork.html', 'en', translations);
      if (result) {
        expect(result).toContain('href="../../');
      }
    });

    test('should replace {{PATH}} with ../../../ for nested portfolio pages', () => {
      const result = processHtmlWithLang('pages/portfolio/bestwork/freelance.html', 'en', translations);
      if (result) {
        expect(result).toContain('href="../../../');
      }
    });

    test('should remove components.js script tag', () => {
      const result = processHtmlWithLang('pages/about.html', 'en', translations);
      expect(result).not.toContain('components.js');
    });

    test('should set active nav based on data-page attribute', () => {
      const aboutResult = processHtmlWithLang('pages/about.html', 'en', translations);
      if (aboutResult) {
        // Check that the correct nav link has active class
        expect(aboutResult).toMatch(/nav-link active/);
      }
    });

    test('should inject theme flash prevention script', () => {
      const result = processHtmlWithLang('pages/about.html', 'en', translations);
      expect(result).toContain('theme-preference');
    });

    test('should set correct lang attribute for English', () => {
      const result = processHtmlWithLang('pages/about.html', 'en', translations);
      expect(result).toContain('lang="en"');
    });

    test('should set correct lang attribute for Malay', () => {
      const msTranslations = loadTranslations('ms');
      const result = processHtmlWithLang('pages/about.html', 'ms', msTranslations);
      expect(result).toContain('lang="ms"');
    });
  });

  describe('processHtmlWithLang for all files', () => {
    CONFIG.htmlFiles.forEach(filePath => {
      test(`should process ${filePath} without errors`, () => {
        const fullPath = path.join(CONFIG.srcDir, filePath);

        // Only test if the file exists
        if (fs.existsSync(fullPath)) {
          const result = processHtmlWithLang(filePath, 'en', translations);
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
