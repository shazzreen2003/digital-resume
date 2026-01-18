/**
 * Build System Integration Tests
 * Tests for the complete build process
 */

const fs = require('fs');
const path = require('path');
const { CONFIG, copyDir, cleanDist, build } = require('../../../build');

describe('Build System', () => {
  const testDistDir = path.join(__dirname, 'test-dist');

  beforeEach(() => {
    // Clean up test directory before each test
    if (fs.existsSync(testDistDir)) {
      fs.rmSync(testDistDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    // Clean up test directory after each test
    if (fs.existsSync(testDistDir)) {
      fs.rmSync(testDistDir, { recursive: true, force: true });
    }
  });

  describe('CONFIG', () => {
    test('should have srcDir defined', () => {
      expect(CONFIG.srcDir).toBeDefined();
      expect(typeof CONFIG.srcDir).toBe('string');
    });

    test('should have distDir defined', () => {
      expect(CONFIG.distDir).toBeDefined();
      expect(typeof CONFIG.distDir).toBe('string');
    });

    test('should have componentsDir defined', () => {
      expect(CONFIG.componentsDir).toBeDefined();
      expect(fs.existsSync(CONFIG.componentsDir)).toBe(true);
    });

    test('should have 17 HTML files configured', () => {
      expect(CONFIG.htmlFiles.length).toBe(17);
    });

    test('should include index.html', () => {
      expect(CONFIG.htmlFiles).toContain('index.html');
    });

    test('should include all pages files', () => {
      expect(CONFIG.htmlFiles).toContain('pages/about.html');
      expect(CONFIG.htmlFiles).toContain('pages/skills.html');
      expect(CONFIG.htmlFiles).toContain('pages/contact.html');
    });

    test('should include portfolio index files', () => {
      expect(CONFIG.htmlFiles).toContain('pages/portfolio/bestwork.html');
      expect(CONFIG.htmlFiles).toContain('pages/portfolio/projects.html');
    });

    test('should include all bestwork files', () => {
      const bestworkFiles = [
        'pages/portfolio/bestwork/freelance.html',
        'pages/portfolio/bestwork/jxtravel.html',
        'pages/portfolio/bestwork/pearliewhite.html',
        'pages/portfolio/bestwork/rimbrew.html',
        'pages/portfolio/bestwork/careerbuddy.html'
      ];
      bestworkFiles.forEach(file => {
        expect(CONFIG.htmlFiles).toContain(file);
      });
    });

    test('should include all projects files', () => {
      const projectsFiles = [
        'pages/portfolio/projects/advertising.html',
        'pages/portfolio/projects/3d.html',
        'pages/portfolio/projects/illustration.html',
        'pages/portfolio/projects/branding.html',
        'pages/portfolio/projects/socialmedia.html',
        'pages/portfolio/projects/packaging.html'
      ];
      projectsFiles.forEach(file => {
        expect(CONFIG.htmlFiles).toContain(file);
      });
    });

    test('should have assets to copy defined', () => {
      expect(CONFIG.assetsToCopy).toBeDefined();
      expect(Array.isArray(CONFIG.assetsToCopy)).toBe(true);
    });

    test('should include required asset folders', () => {
      expect(CONFIG.assetsToCopy).toContain('assets/css');
      expect(CONFIG.assetsToCopy).toContain('assets/images');
      expect(CONFIG.assetsToCopy).toContain('assets/js');
    });
  });

  describe('copyDir', () => {
    const srcDir = path.join(__dirname, 'test-src');
    const destDir = path.join(__dirname, 'test-dest');

    beforeEach(() => {
      // Create test source directory with files
      fs.mkdirSync(srcDir, { recursive: true });
      fs.writeFileSync(path.join(srcDir, 'file1.txt'), 'content1');
      fs.writeFileSync(path.join(srcDir, 'file2.txt'), 'content2');

      // Create subdirectory
      fs.mkdirSync(path.join(srcDir, 'subdir'), { recursive: true });
      fs.writeFileSync(path.join(srcDir, 'subdir', 'file3.txt'), 'content3');
    });

    afterEach(() => {
      // Clean up test directories
      if (fs.existsSync(srcDir)) {
        fs.rmSync(srcDir, { recursive: true, force: true });
      }
      if (fs.existsSync(destDir)) {
        fs.rmSync(destDir, { recursive: true, force: true });
      }
    });

    test('should copy files to destination', () => {
      copyDir(srcDir, destDir);

      expect(fs.existsSync(path.join(destDir, 'file1.txt'))).toBe(true);
      expect(fs.existsSync(path.join(destDir, 'file2.txt'))).toBe(true);
    });

    test('should copy subdirectories recursively', () => {
      copyDir(srcDir, destDir);

      expect(fs.existsSync(path.join(destDir, 'subdir'))).toBe(true);
      expect(fs.existsSync(path.join(destDir, 'subdir', 'file3.txt'))).toBe(true);
    });

    test('should preserve file contents', () => {
      copyDir(srcDir, destDir);

      const content = fs.readFileSync(path.join(destDir, 'file1.txt'), 'utf8');
      expect(content).toBe('content1');
    });

    test('should not throw for non-existent source', () => {
      expect(() => copyDir('/nonexistent/path', destDir)).not.toThrow();
    });
  });

  describe('cleanDist', () => {
    test('should create dist directory if it does not exist', () => {
      // Temporarily modify CONFIG for testing
      const originalDistDir = CONFIG.distDir;
      CONFIG.distDir = testDistDir;

      cleanDist();

      expect(fs.existsSync(testDistDir)).toBe(true);

      // Restore original
      CONFIG.distDir = originalDistDir;
    });

    test('should remove existing contents', () => {
      const originalDistDir = CONFIG.distDir;
      CONFIG.distDir = testDistDir;

      // Create directory with content
      fs.mkdirSync(testDistDir, { recursive: true });
      fs.writeFileSync(path.join(testDistDir, 'old-file.txt'), 'old content');

      cleanDist();

      expect(fs.existsSync(path.join(testDistDir, 'old-file.txt'))).toBe(false);

      CONFIG.distDir = originalDistDir;
    });
  });

  describe('build integration', () => {
    // Note: These tests run the actual build, which may take time
    // Consider skipping in CI environments if needed

    test('should complete without throwing errors', () => {
      expect(() => build()).not.toThrow();
    });

    test('should create dist directory', () => {
      build();
      expect(fs.existsSync(CONFIG.distDir)).toBe(true);
    });

    test('should create index.html in dist', () => {
      build();
      expect(fs.existsSync(path.join(CONFIG.distDir, 'index.html'))).toBe(true);
    });

    test('should create pages directory in dist', () => {
      build();
      expect(fs.existsSync(path.join(CONFIG.distDir, 'pages'))).toBe(true);
    });

    test('should copy assets to dist', () => {
      build();
      expect(fs.existsSync(path.join(CONFIG.distDir, 'assets', 'css'))).toBe(true);
      expect(fs.existsSync(path.join(CONFIG.distDir, 'assets', 'js'))).toBe(true);
    });

    test('should not include components.js in dist', () => {
      build();
      expect(fs.existsSync(path.join(CONFIG.distDir, 'assets', 'js', 'components.js'))).toBe(false);
    });

    test('should process all 17 HTML files', () => {
      build();

      CONFIG.htmlFiles.forEach(filePath => {
        const distPath = path.join(CONFIG.distDir, filePath);
        expect(fs.existsSync(distPath)).toBe(true);
      });
    });

    test('built HTML files should have navigation injected', () => {
      build();

      // Use about.html instead of index.html (which is a redirect page)
      const aboutHtml = fs.readFileSync(path.join(CONFIG.distDir, 'pages', 'about.html'), 'utf8');
      expect(aboutHtml).not.toContain('<div id="site-navigation"></div>');
      expect(aboutHtml).toContain('<nav');
    });

    test('built HTML files should have footer injected', () => {
      build();

      // Use about.html instead of index.html (which is a redirect page)
      const aboutHtml = fs.readFileSync(path.join(CONFIG.distDir, 'pages', 'about.html'), 'utf8');
      expect(aboutHtml).not.toContain('<div id="site-footer"></div>');
      expect(aboutHtml).toContain('<footer');
    });
  });
});
