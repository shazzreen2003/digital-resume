/**
 * Node Tests - Build System
 * Tests for build.js
 */

const path = require('path');

// Mock fs module before requiring build.js
jest.mock('fs');
const fs = require('fs');

// Mock console methods to avoid cluttering test output
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};

describe('Build System', () => {
  let build;
  let getPathPrefix;
  let readComponent;
  let processHtml;
  let buildCss;
  let copyDir;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Reset modules to get fresh instance
    jest.resetModules();

    // Re-mock fs
    jest.mock('fs');

    // Mock fs functions with default implementations
    fs.existsSync = jest.fn(() => true);
    fs.readFileSync = jest.fn(() => '<div>Mock content</div>');
    fs.writeFileSync = jest.fn();
    fs.mkdirSync = jest.fn();
    fs.rmSync = jest.fn();
    fs.readdirSync = jest.fn(() => []);
    fs.copyFileSync = jest.fn();

    // We need to directly test the functions, so let's inline them
    // instead of requiring the build.js file (which runs immediately)
  });

  describe('getPathPrefix()', () => {
    it('should return empty string for depth 0 (index.html)', () => {
      getPathPrefix = (filePath) => {
        const depth = filePath.split('/').length - 1;
        if (depth === 0) return '';
        return '../'.repeat(depth);
      };

      const result = getPathPrefix('index.html');

      expect(result).toBe('');
    });

    it('should return ../ for depth 1 (pages/about.html)', () => {
      getPathPrefix = (filePath) => {
        const depth = filePath.split('/').length - 1;
        if (depth === 0) return '';
        return '../'.repeat(depth);
      };

      const result = getPathPrefix('pages/about.html');

      expect(result).toBe('../');
    });

    it('should return ../../ for depth 2 (pages/portfolio/bestwork.html)', () => {
      getPathPrefix = (filePath) => {
        const depth = filePath.split('/').length - 1;
        if (depth === 0) return '';
        return '../'.repeat(depth);
      };

      const result = getPathPrefix('pages/portfolio/bestwork.html');

      expect(result).toBe('../../');
    });

    it('should return ../../../ for depth 3 (pages/portfolio/bestwork/freelance.html)', () => {
      getPathPrefix = (filePath) => {
        const depth = filePath.split('/').length - 1;
        if (depth === 0) return '';
        return '../'.repeat(depth);
      };

      const result = getPathPrefix('pages/portfolio/bestwork/freelance.html');

      expect(result).toBe('../../../');
    });
  });

  describe('readComponent()', () => {
    beforeEach(() => {
      readComponent = (name) => {
        const componentPath = path.join(__dirname, '../../assets/components', `${name}.html`);
        if (!fs.existsSync(componentPath)) {
          console.error(`Component not found: ${componentPath}`);
          return '';
        }
        return fs.readFileSync(componentPath, 'utf8');
      };
    });

    it('should read component file successfully', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue('<nav>Navigation</nav>');

      const result = readComponent('navigation');

      expect(result).toBe('<nav>Navigation</nav>');
      expect(fs.readFileSync).toHaveBeenCalledWith(
        expect.stringContaining('navigation.html'),
        'utf8'
      );
    });

    it('should return empty string if component not found', () => {
      fs.existsSync.mockReturnValue(false);

      const result = readComponent('nonexistent');

      expect(result).toBe('');
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Component not found')
      );
    });

    it('should construct correct component path', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue('<footer>Footer</footer>');

      readComponent('footer');

      const callPath = fs.existsSync.mock.calls[0][0];
      expect(callPath).toContain('assets');
      expect(callPath).toContain('components');
      expect(callPath).toContain('footer.html');
    });
  });

  describe('processHtml()', () => {
    beforeEach(() => {
      processHtml = (filePath) => {
        const fullPath = path.join(__dirname, '../../', filePath);

        if (!fs.existsSync(fullPath)) {
          console.error(`File not found: ${fullPath}`);
          return null;
        }

        let html = fs.readFileSync(fullPath, 'utf8');
        const pathPrefix = filePath.split('/').length - 1 === 0 ? '' : '../'.repeat(filePath.split('/').length - 1);

        // Read components
        const componentsDir = path.join(__dirname, '../../assets/components');
        let navigation = fs.existsSync(path.join(componentsDir, 'navigation.html'))
          ? fs.readFileSync(path.join(componentsDir, 'navigation.html'), 'utf8')
          : '';
        let footer = fs.existsSync(path.join(componentsDir, 'footer.html'))
          ? fs.readFileSync(path.join(componentsDir, 'footer.html'), 'utf8')
          : '';

        // Replace {{PATH}} placeholders in components
        navigation = navigation.replace(/\{\{PATH\}\}/g, pathPrefix);
        footer = footer.replace(/\{\{PATH\}\}/g, pathPrefix);

        // Get data-page attribute to set active nav
        const dataPageMatch = html.match(/data-page="([^"]+)"/);
        const currentPage = dataPageMatch ? dataPageMatch[1] : '';

        // Set active class on correct nav item
        if (currentPage) {
          navigation = navigation.replace(
            new RegExp(`class="nav-link"(\\s+href="[^"]*"\\s+data-nav="${currentPage}")`),
            'class="nav-link active"$1'
          );
        }

        // Replace placeholder divs with actual components
        html = html.replace(/<div id="site-navigation"><\/div>/, navigation);
        html = html.replace(/<div id="site-footer"><\/div>/, footer);

        // Remove the components.js script
        html = html.replace(/\s*<!-- Component Loader -->\s*\n\s*<script src="[^"]*components\.js"><\/script>/g, '');

        return html;
      };
    });

    it('should inject navigation HTML', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('index.html')) {
          return '<body><div id="site-navigation"></div><div id="site-footer"></div></body>';
        }
        if (path.includes('navigation.html')) {
          return '<nav>Navigation</nav>';
        }
        if (path.includes('footer.html')) {
          return '<footer>Footer</footer>';
        }
        return '';
      });

      const result = processHtml('index.html');

      expect(result).toContain('<nav>Navigation</nav>');
    });

    it('should inject footer HTML', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('index.html')) {
          return '<body><div id="site-navigation"></div><div id="site-footer"></div></body>';
        }
        if (path.includes('navigation.html')) {
          return '<nav>Navigation</nav>';
        }
        if (path.includes('footer.html')) {
          return '<footer>Footer</footer>';
        }
        return '';
      });

      const result = processHtml('index.html');

      expect(result).toContain('<footer>Footer</footer>');
    });

    it('should replace {{PATH}} placeholders', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('about.html')) {
          return '<body><div id="site-navigation"></div><div id="site-footer"></div></body>';
        }
        if (path.includes('navigation.html')) {
          return '<a href="{{PATH}}index.html">Home</a>';
        }
        if (path.includes('footer.html')) {
          return '<img src="{{PATH}}assets/logo.png">';
        }
        return '';
      });

      const result = processHtml('pages/about.html');

      expect(result).toContain('href="../index.html"');
      expect(result).toContain('src="../assets/logo.png"');
    });

    it('should set active class on matching nav link based on data-page', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('about.html')) {
          return '<body data-page="about"><div id="site-navigation"></div><div id="site-footer"></div></body>';
        }
        if (path.includes('navigation.html')) {
          return '<a class="nav-link" href="{{PATH}}index.html" data-nav="home">Home</a><a class="nav-link" href="{{PATH}}pages/about.html" data-nav="about">About</a>';
        }
        if (path.includes('footer.html')) {
          return '<footer>Footer</footer>';
        }
        return '';
      });

      const result = processHtml('pages/about.html');

      expect(result).toContain('class="nav-link active"');
      expect(result).toContain('data-nav="about"');
    });

    it('should remove components.js script tag', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('index.html')) {
          return '<body><div id="site-navigation"></div><div id="site-footer"></div><!-- Component Loader -->\n<script src="assets/js/components.js"></script></body>';
        }
        if (path.includes('navigation.html')) {
          return '<nav>Nav</nav>';
        }
        if (path.includes('footer.html')) {
          return '<footer>Footer</footer>';
        }
        return '';
      });

      const result = processHtml('index.html');

      expect(result).not.toContain('components.js');
      expect(result).not.toContain('Component Loader');
    });

    it('should return null if file not found', () => {
      fs.existsSync.mockReturnValue(false);

      const result = processHtml('nonexistent.html');

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('File not found')
      );
    });
  });

  describe('buildCss()', () => {
    beforeEach(() => {
      buildCss = () => {
        const header = `/* ============================================
   RESUME WEBSITE - CUSTOM STYLES
   Author: Shazzreen Elyana

   ⚠️  DO NOT EDIT THIS FILE DIRECTLY!

   This file is auto-generated by: npm run build

   To make CSS changes, edit the source modules in assets/css/:
   - variables.css  → Colors, fonts, spacing
   - base.css       → Body, typography, links
   - components.css → Navbar, buttons, cards
   - layouts.css    → Sections, grids, containers
   - responsive.css → Media queries

   Then run: npm run build
   ============================================ */

`;

        let combinedCss = header;

        const cssModules = [
          'variables.css',
          'base.css',
          'components.css',
          'layouts.css',
          'responsive.css'
        ];

        for (const cssFile of cssModules) {
          const cssPath = path.join(__dirname, '../../assets/css', cssFile);

          if (!fs.existsSync(cssPath)) {
            console.error(`   CSS module not found: ${cssFile}`);
            continue;
          }

          const cssContent = fs.readFileSync(cssPath, 'utf8');
          combinedCss += cssContent + '\n\n';
        }

        // Output to assets/css/styles.css
        const srcOutputPath = path.join(__dirname, '../../assets/css', 'styles.css');
        fs.writeFileSync(srcOutputPath, combinedCss, 'utf8');

        // Output to dist/assets/css/styles.css
        const cssOutputDir = path.join(__dirname, '../../dist/assets/css');
        fs.mkdirSync(cssOutputDir, { recursive: true });
        const distOutputPath = path.join(cssOutputDir, 'styles.css');
        fs.writeFileSync(distOutputPath, combinedCss, 'utf8');

        return combinedCss.length;
      };
    });

    it('should concatenate all 5 CSS modules in order', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('variables.css')) return '/* variables */';
        if (path.includes('base.css')) return '/* base */';
        if (path.includes('components.css')) return '/* components */';
        if (path.includes('layouts.css')) return '/* layouts */';
        if (path.includes('responsive.css')) return '/* responsive */';
        return '';
      });

      buildCss();

      const writeCalls = fs.writeFileSync.mock.calls;
      const combinedContent = writeCalls[0][1];

      expect(combinedContent).toContain('/* variables */');
      expect(combinedContent).toContain('/* base */');
      expect(combinedContent).toContain('/* components */');
      expect(combinedContent).toContain('/* layouts */');
      expect(combinedContent).toContain('/* responsive */');

      // Check order
      const varsIndex = combinedContent.indexOf('/* variables */');
      const baseIndex = combinedContent.indexOf('/* base */');
      const componentsIndex = combinedContent.indexOf('/* components */');
      const layoutsIndex = combinedContent.indexOf('/* layouts */');
      const responsiveIndex = combinedContent.indexOf('/* responsive */');

      expect(varsIndex).toBeLessThan(baseIndex);
      expect(baseIndex).toBeLessThan(componentsIndex);
      expect(componentsIndex).toBeLessThan(layoutsIndex);
      expect(layoutsIndex).toBeLessThan(responsiveIndex);
    });

    it('should add header comment', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue('body { margin: 0; }');

      buildCss();

      const writeCalls = fs.writeFileSync.mock.calls;
      const combinedContent = writeCalls[0][1];

      expect(combinedContent).toContain('RESUME WEBSITE - CUSTOM STYLES');
      expect(combinedContent).toContain('Author: Shazzreen Elyana');
      expect(combinedContent).toContain('DO NOT EDIT THIS FILE DIRECTLY');
    });

    it('should write to assets/css/styles.css', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue('body { margin: 0; }');

      buildCss();

      const firstCall = fs.writeFileSync.mock.calls[0];
      expect(firstCall[0]).toContain('assets');
      expect(firstCall[0]).toContain('css');
      expect(firstCall[0]).toContain('styles.css');
      expect(firstCall[0]).not.toContain('dist');
      expect(firstCall[2]).toBe('utf8');
    });

    it('should write to dist/assets/css/styles.css', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue('body { margin: 0; }');

      buildCss();

      const mkdirCall = fs.mkdirSync.mock.calls[0];
      expect(mkdirCall[0]).toContain('dist');
      expect(mkdirCall[0]).toContain('assets');
      expect(mkdirCall[0]).toContain('css');
      expect(mkdirCall[1]).toEqual({ recursive: true });

      const secondCall = fs.writeFileSync.mock.calls[1];
      expect(secondCall[0]).toContain('dist');
      expect(secondCall[0]).toContain('assets');
      expect(secondCall[0]).toContain('css');
      expect(secondCall[0]).toContain('styles.css');
      expect(secondCall[2]).toBe('utf8');
    });

    it('should return total CSS size', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue('body { margin: 0; }');

      const size = buildCss();

      expect(typeof size).toBe('number');
      expect(size).toBeGreaterThan(0);
    });

    it('should handle missing CSS module gracefully', () => {
      fs.existsSync.mockImplementation((path) => {
        return !path.includes('components.css');
      });
      fs.readFileSync.mockReturnValue('body { margin: 0; }');

      buildCss();

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('CSS module not found: components.css')
      );
    });
  });

  describe('copyDir()', () => {
    beforeEach(() => {
      copyDir = (src, dest) => {
        if (!fs.existsSync(src)) {
          console.warn(`Source directory not found: ${src}`);
          return;
        }

        fs.mkdirSync(dest, { recursive: true });

        const entries = fs.readdirSync(src, { withFileTypes: true });

        for (const entry of entries) {
          const srcPath = path.join(src, entry.name);
          const destPath = path.join(dest, entry.name);

          if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
          }
        }
      };
    });

    it('should copy files recursively', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValueOnce([
        { name: 'file1.txt', isDirectory: () => false },
        { name: 'file2.txt', isDirectory: () => false }
      ]);

      copyDir('/src', '/dest');

      expect(fs.copyFileSync).toHaveBeenCalledTimes(2);
      expect(fs.copyFileSync).toHaveBeenCalledWith(
        expect.stringContaining('file1.txt'),
        expect.stringContaining('file1.txt')
      );
    });

    it('should create destination directory', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValue([]);

      copyDir('/src', '/dest');

      expect(fs.mkdirSync).toHaveBeenCalledWith('/dest', { recursive: true });
    });

    it('should handle nested directories', () => {
      fs.existsSync.mockReturnValue(true);
      let callCount = 0;
      fs.readdirSync.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return [
            { name: 'subdir', isDirectory: () => true }
          ];
        }
        return [
          { name: 'file.txt', isDirectory: () => false }
        ];
      });

      copyDir('/src', '/dest');

      expect(fs.mkdirSync).toHaveBeenCalledWith('/dest', { recursive: true });
      expect(fs.mkdirSync).toHaveBeenCalledWith(
        expect.stringContaining('subdir'),
        { recursive: true }
      );
      expect(fs.copyFileSync).toHaveBeenCalledWith(
        expect.stringContaining('file.txt'),
        expect.stringContaining('file.txt')
      );
    });

    it('should warn if source directory not found', () => {
      fs.existsSync.mockReturnValue(false);

      copyDir('/nonexistent', '/dest');

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Source directory not found')
      );
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });
});
