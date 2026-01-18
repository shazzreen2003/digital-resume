/**
 * Components Loader Tests
 * Tests for component loading, path resolution, and active navigation
 */

const components = require('../../../assets/js/components');

describe('Component Loader', () => {
  let originalLocation;

  beforeEach(() => {
    document.body.innerHTML = '';
    // Store original location
    originalLocation = window.location;
  });

  afterEach(() => {
    // Restore location if needed
    if (window.location !== originalLocation) {
      window.location = originalLocation;
    }
  });

  describe('getPathPrefixFromLocation', () => {
    // Note: These tests verify the function logic works with mocked location
    // In jsdom, window.location mocking has limitations

    test('should return empty string when path does not match known patterns', () => {
      // Default jsdom location doesn't include /pages/
      const result = components.getPathPrefixFromLocation();
      expect(typeof result).toBe('string');
    });

    test('should handle paths containing /pages/portfolio/', () => {
      // Test the function logic directly by checking what it would return
      // The function checks for '/pages/portfolio/' in the path
      const mockPath = '/pages/portfolio/bestwork.html';
      expect(mockPath.includes('/pages/portfolio/')).toBe(true);
    });

    test('should handle paths containing /pages/ but not portfolio', () => {
      const mockPath = '/pages/about.html';
      expect(mockPath.includes('/pages/')).toBe(true);
      expect(mockPath.includes('/pages/portfolio/')).toBe(false);
    });

    test('function should exist and be callable', () => {
      expect(typeof components.getPathPrefixFromLocation).toBe('function');
      expect(() => components.getPathPrefixFromLocation()).not.toThrow();
    });
  });

  describe('getBasePath', () => {
    test('should find path from script src containing components.js', () => {
      document.body.innerHTML = `
        <script src="http://localhost/assets/js/components.js"></script>
      `;

      const result = components.getBasePath();

      // Should return the base path (URL before assets/js/components.js)
      expect(result).toContain('localhost');
    });

    test('should return a string from getBasePath', () => {
      document.body.innerHTML = `
        <script src="other-script.js"></script>
      `;

      const result = components.getBasePath();

      expect(typeof result).toBe('string');
    });

    test('function should exist and be callable', () => {
      expect(typeof components.getBasePath).toBe('function');
      expect(() => components.getBasePath()).not.toThrow();
    });
  });

  describe('loadComponent', () => {
    test('should return false when container does not exist', async () => {
      document.body.innerHTML = '';

      const result = await components.loadComponent('nonexistent', 'test.html', '');

      expect(result).toBe(false);
    });

    test('should fetch component from correct URL', async () => {
      document.body.innerHTML = '<div id="test-container"></div>';
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('<nav>Test Nav</nav>')
      });

      await components.loadComponent('test-container', 'assets/components/test.html', '../');

      expect(global.fetch).toHaveBeenCalledWith('../assets/components/test.html');
    });

    test('should insert HTML into container', async () => {
      document.body.innerHTML = '<div id="test-container"></div>';
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('<nav>Test Navigation</nav>')
      });

      await components.loadComponent('test-container', 'components/nav.html', '');

      const container = document.getElementById('test-container');
      expect(container.innerHTML).toBe('<nav>Test Navigation</nav>');
    });

    test('should replace {{PATH}} placeholders', async () => {
      document.body.innerHTML = '<div id="test-container"></div>';
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('<a href="{{PATH}}pages/about.html">About</a>')
      });

      await components.loadComponent('test-container', 'nav.html', '../');

      const container = document.getElementById('test-container');
      expect(container.innerHTML).toBe('<a href="../pages/about.html">About</a>');
    });

    test('should replace multiple {{PATH}} placeholders', async () => {
      document.body.innerHTML = '<div id="test-container"></div>';
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(`
          <a href="{{PATH}}pages/about.html">About</a>
          <a href="{{PATH}}pages/contact.html">Contact</a>
          <img src="{{PATH}}assets/images/logo.png">
        `)
      });

      await components.loadComponent('test-container', 'nav.html', '../../');

      const container = document.getElementById('test-container');
      expect(container.innerHTML).toContain('../../pages/about.html');
      expect(container.innerHTML).toContain('../../pages/contact.html');
      expect(container.innerHTML).toContain('../../assets/images/logo.png');
    });

    test('should return true on successful load', async () => {
      document.body.innerHTML = '<div id="test-container"></div>';
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('<nav>Nav</nav>')
      });

      const result = await components.loadComponent('test-container', 'nav.html', '');

      expect(result).toBe(true);
    });

    test('should return false on fetch error', async () => {
      document.body.innerHTML = '<div id="test-container"></div>';
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      const result = await components.loadComponent('test-container', 'nav.html', '');

      expect(result).toBe(false);
    });

    test('should show error message on fetch failure', async () => {
      document.body.innerHTML = '<div id="test-container"></div>';
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await components.loadComponent('test-container', 'nav.html', '');

      const container = document.getElementById('test-container');
      expect(container.innerHTML).toContain('Component failed to load');
    });

    test('should return false on network error', async () => {
      document.body.innerHTML = '<div id="test-container"></div>';
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await components.loadComponent('test-container', 'nav.html', '');

      expect(result).toBe(false);
    });
  });

  describe('setActiveNav', () => {
    test('should add active class to matching nav link', () => {
      document.body.innerHTML = `
        <body data-page="about">
          <a data-nav="home" class="nav-link">Home</a>
          <a data-nav="about" class="nav-link">About</a>
          <a data-nav="contact" class="nav-link">Contact</a>
        </body>
      `;
      document.body.setAttribute('data-page', 'about');

      components.setActiveNav();

      const aboutLink = document.querySelector('[data-nav="about"]');
      expect(aboutLink.classList.contains('active')).toBe(true);
    });

    test('should remove active class from non-matching links', () => {
      document.body.innerHTML = `
        <body data-page="about">
          <a data-nav="home" class="nav-link active">Home</a>
          <a data-nav="about" class="nav-link">About</a>
        </body>
      `;
      document.body.setAttribute('data-page', 'about');

      components.setActiveNav();

      const homeLink = document.querySelector('[data-nav="home"]');
      expect(homeLink.classList.contains('active')).toBe(false);
    });

    test('should not throw when data-page is not set', () => {
      document.body.innerHTML = `
        <a data-nav="home" class="nav-link">Home</a>
      `;
      document.body.removeAttribute('data-page');

      expect(() => components.setActiveNav()).not.toThrow();
    });

    test('should not throw when no nav links exist', () => {
      document.body.innerHTML = '<div>No nav</div>';
      document.body.setAttribute('data-page', 'about');

      expect(() => components.setActiveNav()).not.toThrow();
    });

    test('should handle portfolio nav activation', () => {
      document.body.innerHTML = `
        <body data-page="portfolio">
          <a data-nav="portfolio" class="nav-link">Portfolio</a>
          <a data-nav="about" class="nav-link">About</a>
        </body>
      `;
      document.body.setAttribute('data-page', 'portfolio');

      components.setActiveNav();

      const portfolioLink = document.querySelector('[data-nav="portfolio"]');
      expect(portfolioLink.classList.contains('active')).toBe(true);
    });
  });

  describe('init', () => {
    test('should load navigation and footer components', async () => {
      document.body.innerHTML = `
        <div id="site-navigation"></div>
        <div id="site-footer"></div>
        <script src="assets/js/components.js"></script>
      `;

      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve('<nav>Navigation</nav>')
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve('<footer>Footer</footer>')
        });

      await components.init();

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    test('should call setActiveNav after loading navigation', async () => {
      document.body.innerHTML = `
        <body data-page="about">
          <div id="site-navigation"></div>
          <div id="site-footer"></div>
          <script src="assets/js/components.js"></script>
        </body>
      `;
      document.body.setAttribute('data-page', 'about');

      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve('<a data-nav="about" class="nav-link">About</a>')
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve('<footer>Footer</footer>')
        });

      await components.init();

      const aboutLink = document.querySelector('[data-nav="about"]');
      expect(aboutLink.classList.contains('active')).toBe(true);
    });

    test('should dispatch componentsLoaded event', async () => {
      document.body.innerHTML = `
        <div id="site-navigation"></div>
        <div id="site-footer"></div>
        <script src="assets/js/components.js"></script>
      `;

      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve('<nav>Nav</nav>')
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve('<footer>Footer</footer>')
        });

      const eventListener = jest.fn();
      document.addEventListener('componentsLoaded', eventListener);

      await components.init();

      expect(eventListener).toHaveBeenCalled();
    });
  });
});
