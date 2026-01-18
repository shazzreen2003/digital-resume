/**
 * Theme Manager Tests
 * Tests for ThemeManager functionality
 */

const { ThemeManager } = require('../../../assets/js/script');

describe('ThemeManager', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-theme');
  });

  describe('init', () => {
    // Note: ThemeManager.init() is called at module import time,
    // so we test the behavior after that initial call

    test('should set a theme on document element when called', () => {
      // Call init() and verify it sets a theme
      ThemeManager.init();
      const theme = document.documentElement.getAttribute('data-theme');
      expect(['light', 'dark']).toContain(theme);
    });

    test('init should be callable without error', () => {
      expect(() => ThemeManager.init()).not.toThrow();
    });

    test('should respond to setTheme after init', () => {
      ThemeManager.setTheme('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

      ThemeManager.setTheme('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });

  describe('setTheme', () => {
    test('should set data-theme attribute on documentElement', () => {
      ThemeManager.setTheme('dark');

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    test('should set light theme', () => {
      ThemeManager.setTheme('light');

      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    test('should update icon when setting theme', () => {
      document.body.innerHTML = '<i id="theme-icon" class="bi bi-sun-fill"></i>';

      ThemeManager.setTheme('dark');

      const icon = document.getElementById('theme-icon');
      expect(icon.className).toBe('bi bi-moon-fill');
    });
  });

  describe('updateIcon', () => {
    test('should set moon icon for dark theme', () => {
      document.body.innerHTML = '<i id="theme-icon" class="bi bi-sun-fill"></i>';

      ThemeManager.updateIcon('dark');

      const icon = document.getElementById('theme-icon');
      expect(icon.className).toBe('bi bi-moon-fill');
    });

    test('should set sun icon for light theme', () => {
      document.body.innerHTML = '<i id="theme-icon" class="bi bi-moon-fill"></i>';

      ThemeManager.updateIcon('light');

      const icon = document.getElementById('theme-icon');
      expect(icon.className).toBe('bi bi-sun-fill');
    });

    test('should not throw when icon element does not exist', () => {
      document.body.innerHTML = '';

      expect(() => ThemeManager.updateIcon('dark')).not.toThrow();
    });
  });

  describe('setupToggle', () => {
    test('should add click listener to toggle button', () => {
      document.body.innerHTML = '<button id="theme-toggle"><i id="theme-icon" class="bi bi-sun-fill"></i></button>';
      document.documentElement.setAttribute('data-theme', 'light');

      ThemeManager.setupToggle();

      const toggle = document.getElementById('theme-toggle');
      toggle.click();

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme-preference', 'dark');
    });

    test('should toggle from dark to light', () => {
      document.body.innerHTML = '<button id="theme-toggle"><i id="theme-icon" class="bi bi-moon-fill"></i></button>';
      document.documentElement.setAttribute('data-theme', 'dark');

      ThemeManager.setupToggle();

      const toggle = document.getElementById('theme-toggle');
      toggle.click();

      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    test('should not throw when toggle element does not exist', () => {
      document.body.innerHTML = '';

      expect(() => ThemeManager.setupToggle()).not.toThrow();
    });

    test('should update icon to match current theme', () => {
      document.body.innerHTML = '<button id="theme-toggle"><i id="theme-icon" class="bi bi-sun-fill"></i></button>';
      document.documentElement.setAttribute('data-theme', 'dark');

      ThemeManager.setupToggle();

      const icon = document.getElementById('theme-icon');
      expect(icon.className).toBe('bi bi-moon-fill');
    });
  });
});
