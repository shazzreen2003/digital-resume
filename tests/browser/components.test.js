/**
 * Browser Tests - Component Loader
 * Tests for assets/js/components.js
 */

const {
  getPathPrefixFromLocation,
  loadComponent,
  setActiveNav,
  init
} = require('../../assets/js/components.js');

describe('Component Loader', () => {
  describe('getPathPrefixFromLocation()', () => {
    // Use history.pushState() to mock window.location.pathname in JSDOM
    const originalPathname = window.location.pathname;

    afterEach(() => {
      // Restore original pathname after each test
      window.history.pushState({}, '', originalPathname);
    });

    it('should return empty string for index.html', () => {
      window.history.pushState({}, '', '/index.html');
      const result = getPathPrefixFromLocation();
      expect(result).toBe('');
    });

    it('should return empty string for root path', () => {
      window.history.pushState({}, '', '/');
      const result = getPathPrefixFromLocation();
      expect(result).toBe('');
    });

    it('should return ../ for pages/about.html', () => {
      window.history.pushState({}, '', '/pages/about.html');
      const result = getPathPrefixFromLocation();
      expect(result).toBe('../');
    });

    it('should return ../ for pages/skills.html', () => {
      window.history.pushState({}, '', '/pages/skills.html');
      const result = getPathPrefixFromLocation();
      expect(result).toBe('../');
    });

    it('should return ../../ for pages/portfolio/bestwork.html', () => {
      window.history.pushState({}, '', '/pages/portfolio/bestwork.html');
      const result = getPathPrefixFromLocation();
      expect(result).toBe('../../');
    });

    it('should return ../../ for pages/portfolio/projects.html', () => {
      window.history.pushState({}, '', '/pages/portfolio/projects.html');
      const result = getPathPrefixFromLocation();
      expect(result).toBe('../../');
    });

    it('should return ../../../ for pages/portfolio/bestwork/freelance.html', () => {
      window.history.pushState({}, '', '/pages/portfolio/bestwork/freelance.html');
      const result = getPathPrefixFromLocation();
      expect(result).toBe('../../../');
    });

    it('should return ../../../ for pages/portfolio/projects/branding.html', () => {
      window.history.pushState({}, '', '/pages/portfolio/projects/branding.html');
      const result = getPathPrefixFromLocation();
      expect(result).toBe('../../../');
    });

    it('should handle paths without .html extension', () => {
      window.history.pushState({}, '', '/pages/about');
      const result = getPathPrefixFromLocation();
      expect(result).toBe('../');
    });
  });

  describe('loadComponent()', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="test-container"></div>';
      fetch.mockClear();
    });

    it('should replace {{PATH}} placeholders with basePath', async () => {
      const html = '<nav><a href="{{PATH}}index.html">Home</a><img src="{{PATH}}assets/logo.png"></nav>';
      fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(html)
      });

      const container = document.getElementById('test-container');

      await loadComponent('test-container', 'components/nav.html', '../');

      expect(container.innerHTML).toBe('<nav><a href="../index.html">Home</a><img src="../assets/logo.png"></nav>');
    });

    it('should inject HTML into container', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('<div>Test Component</div>')
      });

      await loadComponent('test-container', 'components/nav.html', '');

      const container = document.getElementById('test-container');
      expect(container.innerHTML).toBe('<div>Test Component</div>');
    });

    it('should return true on success', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('<div>Component</div>')
      });

      const result = await loadComponent('test-container', 'components/nav.html', '');

      expect(result).toBe(true);
    });

    it('should fetch with correct URL', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('<div>Component</div>')
      });

      await loadComponent('test-container', 'assets/components/nav.html', '../');

      expect(fetch).toHaveBeenCalledWith('../assets/components/nav.html');
    });

    it('should show error message on fetch failure', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await loadComponent('test-container', 'components/nav.html', '');

      const container = document.getElementById('test-container');
      expect(container.innerHTML).toContain('Component failed to load');

      consoleSpy.mockRestore();
    });

    it('should return false on failure', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      const result = await loadComponent('test-container', 'components/nav.html', '');

      expect(result).toBe(false);

      consoleSpy.mockRestore();
    });

    it('should handle network errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await loadComponent('test-container', 'components/nav.html', '');

      expect(result).toBe(false);
      const container = document.getElementById('test-container');
      expect(container.innerHTML).toContain('Component failed to load');

      consoleSpy.mockRestore();
    });

    it('should warn if container not found', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const result = await loadComponent('nonexistent-container', 'components/nav.html', '');

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Container #nonexistent-container not found');

      consoleSpy.mockRestore();
    });

    it('should handle multiple {{PATH}} replacements', async () => {
      const html = `
        <a href="{{PATH}}index.html">Home</a>
        <a href="{{PATH}}pages/about.html">About</a>
        <img src="{{PATH}}assets/images/logo.png">
      `;
      fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(html)
      });

      await loadComponent('test-container', 'components/nav.html', '../../');

      const container = document.getElementById('test-container');
      expect(container.innerHTML).toContain('href="../../index.html"');
      expect(container.innerHTML).toContain('href="../../pages/about.html"');
      expect(container.innerHTML).toContain('src="../../assets/images/logo.png"');
    });

    it('should handle empty basePath', async () => {
      const html = '<a href="{{PATH}}index.html">Home</a>';
      fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(html)
      });

      await loadComponent('test-container', 'components/nav.html', '');

      const container = document.getElementById('test-container');
      expect(container.innerHTML).toBe('<a href="index.html">Home</a>');
    });
  });

  describe('setActiveNav()', () => {
    beforeEach(() => {
      document.body.setAttribute('data-page', 'about');
      document.body.innerHTML = `
        <nav>
          <a class="nav-link" data-nav="home">Home</a>
          <a class="nav-link" data-nav="about">About</a>
          <a class="nav-link" data-nav="contact">Contact</a>
        </nav>
      `;
    });

    it('should read data-page from body', () => {
      const getAttributeSpy = jest.spyOn(document.body, 'getAttribute');

      setActiveNav();

      expect(getAttributeSpy).toHaveBeenCalledWith('data-page');

      getAttributeSpy.mockRestore();
    });

    it('should add active class to matching data-nav link', () => {
      setActiveNav();

      const aboutLink = document.querySelector('[data-nav="about"]');
      expect(aboutLink.classList.contains('active')).toBe(true);
    });

    it('should remove active from other links', () => {
      // Pre-set home as active
      document.querySelector('[data-nav="home"]').classList.add('active');

      setActiveNav();

      const homeLink = document.querySelector('[data-nav="home"]');
      const contactLink = document.querySelector('[data-nav="contact"]');

      expect(homeLink.classList.contains('active')).toBe(false);
      expect(contactLink.classList.contains('active')).toBe(false);
    });

    it('should only activate one link', () => {
      setActiveNav();

      const activeLinks = document.querySelectorAll('.nav-link.active');
      expect(activeLinks.length).toBe(1);
    });

    it('should handle missing data-page attribute', () => {
      document.body.removeAttribute('data-page');

      expect(() => setActiveNav()).not.toThrow();

      const activeLinks = document.querySelectorAll('.nav-link.active');
      expect(activeLinks.length).toBe(0);
    });

    it('should handle no matching nav link', () => {
      document.body.setAttribute('data-page', 'nonexistent');

      setActiveNav();

      const activeLinks = document.querySelectorAll('.nav-link.active');
      expect(activeLinks.length).toBe(0);
    });
  });

  describe('init()', () => {
    beforeEach(() => {
      document.body.setAttribute('data-page', 'home');
      document.body.innerHTML = `
        <div id="site-navigation"></div>
        <div id="site-footer"></div>
      `;
      fetch.mockClear();
    });

    it('should load navigation and footer in parallel', async () => {
      fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<div>Component</div>')
      });

      await init();

      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('should load navigation component', async () => {
      fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<nav>Navigation</nav>')
      });

      await init();

      const navContainer = document.getElementById('site-navigation');
      expect(navContainer.innerHTML).toContain('Navigation');
    });

    it('should load footer component', async () => {
      fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<footer>Footer</footer>')
      });

      await init();

      const footerContainer = document.getElementById('site-footer');
      expect(footerContainer.innerHTML).toContain('Footer');
    });

    it('should call setActiveNav after successful load', async () => {
      document.body.setAttribute('data-page', 'about');
      document.body.innerHTML = `
        <div id="site-navigation">
          <a class="nav-link" data-nav="home">Home</a>
          <a class="nav-link" data-nav="about">About</a>
        </div>
        <div id="site-footer"></div>
      `;

      fetch.mockImplementation((url) => {
        if (url.includes('navigation.html')) {
          return Promise.resolve({
            ok: true,
            text: () => Promise.resolve(`
              <a class="nav-link" data-nav="home">Home</a>
              <a class="nav-link" data-nav="about">About</a>
            `)
          });
        }
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve('<footer>Footer</footer>')
        });
      });

      await init();

      const aboutLink = document.querySelector('[data-nav="about"]');
      expect(aboutLink.classList.contains('active')).toBe(true);
    });

    it('should dispatch componentsLoaded event', async () => {
      fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<div>Component</div>')
      });

      const dispatchEventSpy = jest.spyOn(document, 'dispatchEvent');

      await init();

      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'componentsLoaded'
        })
      );

      dispatchEventSpy.mockRestore();
    });

    it('should handle navigation load failure gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      fetch.mockImplementation((url) => {
        if (url.includes('navigation.html')) {
          return Promise.resolve({
            ok: false,
            status: 404,
            statusText: 'Not Found'
          });
        }
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve('<footer>Footer</footer>')
        });
      });

      await expect(init()).resolves.not.toThrow();

      consoleSpy.mockRestore();
    });

    it('should handle footer load failure gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      fetch.mockImplementation((url) => {
        if (url.includes('footer.html')) {
          return Promise.resolve({
            ok: false,
            status: 404,
            statusText: 'Not Found'
          });
        }
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve('<nav>Navigation</nav>')
        });
      });

      await expect(init()).resolves.not.toThrow();

      consoleSpy.mockRestore();
    });

    it('should not call setActiveNav if navigation fails to load', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      document.body.innerHTML = `
        <body data-page="about">
          <div id="site-navigation"></div>
          <div id="site-footer"></div>
          <a class="nav-link" data-nav="about">About</a>
        </body>
      `;

      fetch.mockImplementation((url) => {
        if (url.includes('navigation.html')) {
          return Promise.resolve({
            ok: false,
            status: 404
          });
        }
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve('<footer>Footer</footer>')
        });
      });

      await init();

      // About link should not have active class since nav didn't load
      const aboutLink = document.querySelector('[data-nav="about"]');
      expect(aboutLink.classList.contains('active')).toBe(false);

      consoleSpy.mockRestore();
    });
  });
});
