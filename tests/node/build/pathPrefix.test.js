/**
 * Path Prefix Tests
 * Tests for getPathPrefix function used in build system
 */

const { getPathPrefix, CONFIG } = require('../../../build');

describe('getPathPrefix', () => {
  describe('root level files', () => {
    test('should return empty string for index.html', () => {
      expect(getPathPrefix('index.html')).toBe('');
    });
  });

  describe('pages/ directory', () => {
    test('should return ../ for pages/about.html', () => {
      expect(getPathPrefix('pages/about.html')).toBe('../');
    });

    test('should return ../ for pages/skills.html', () => {
      expect(getPathPrefix('pages/skills.html')).toBe('../');
    });

    test('should return ../ for pages/contact.html', () => {
      expect(getPathPrefix('pages/contact.html')).toBe('../');
    });
  });

  describe('pages/portfolio/ directory', () => {
    test('should return ../../ for pages/portfolio/bestwork.html', () => {
      expect(getPathPrefix('pages/portfolio/bestwork.html')).toBe('../../');
    });

    test('should return ../../ for pages/portfolio/projects.html', () => {
      expect(getPathPrefix('pages/portfolio/projects.html')).toBe('../../');
    });
  });

  describe('pages/portfolio/bestwork/ directory', () => {
    test('should return ../../../ for freelance.html', () => {
      expect(getPathPrefix('pages/portfolio/bestwork/freelance.html')).toBe('../../../');
    });

    test('should return ../../../ for jxtravel.html', () => {
      expect(getPathPrefix('pages/portfolio/bestwork/jxtravel.html')).toBe('../../../');
    });

    test('should return ../../../ for pearliewhite.html', () => {
      expect(getPathPrefix('pages/portfolio/bestwork/pearliewhite.html')).toBe('../../../');
    });

    test('should return ../../../ for rimbrew.html', () => {
      expect(getPathPrefix('pages/portfolio/bestwork/rimbrew.html')).toBe('../../../');
    });

    test('should return ../../../ for careerbuddy.html', () => {
      expect(getPathPrefix('pages/portfolio/bestwork/careerbuddy.html')).toBe('../../../');
    });
  });

  describe('pages/portfolio/projects/ directory', () => {
    test('should return ../../../ for 3d.html', () => {
      expect(getPathPrefix('pages/portfolio/projects/3d.html')).toBe('../../../');
    });

    test('should return ../../../ for advertising.html', () => {
      expect(getPathPrefix('pages/portfolio/projects/advertising.html')).toBe('../../../');
    });

    test('should return ../../../ for branding.html', () => {
      expect(getPathPrefix('pages/portfolio/projects/branding.html')).toBe('../../../');
    });

    test('should return ../../../ for illustration.html', () => {
      expect(getPathPrefix('pages/portfolio/projects/illustration.html')).toBe('../../../');
    });

    test('should return ../../../ for packaging.html', () => {
      expect(getPathPrefix('pages/portfolio/projects/packaging.html')).toBe('../../../');
    });

    test('should return ../../../ for socialmedia.html', () => {
      expect(getPathPrefix('pages/portfolio/projects/socialmedia.html')).toBe('../../../');
    });
  });

  describe('edge cases', () => {
    test('should handle deeply nested paths', () => {
      expect(getPathPrefix('a/b/c/d/e/file.html')).toBe('../../../../../');
    });

    test('should handle paths with no depth', () => {
      expect(getPathPrefix('file.html')).toBe('');
    });
  });

  describe('CONFIG validation', () => {
    test('should have all HTML files with correct prefix', () => {
      CONFIG.htmlFiles.forEach(filePath => {
        const prefix = getPathPrefix(filePath);
        const depth = filePath.split('/').length - 1;
        const expectedPrefix = depth === 0 ? '' : '../'.repeat(depth);
        expect(prefix).toBe(expectedPrefix);
      });
    });
  });
});
