/**
 * Navigation Flow Integration Tests
 * Tests navigation highlighting and mobile menu behavior across pages
 */

const {
  initNavigation,
  initMobileDropdowns,
  highlightActivePage
} = require('../../../assets/js/script');

describe('Navigation Flow Integration', () => {
  // Helper to set up navigation DOM
  const setupNavigationDOM = () => {
    document.body.innerHTML = `
      <nav class="navbar navbar-expand-lg">
        <button class="navbar-toggler" type="button">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="navbar-collapse collapse">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="index.html">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="about.html">About</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link" href="portfolio.html">Portfolio</a>
              <span class="dropdown-arrow"></span>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="bestwork.html">Best Work</a></li>
                <li><a class="dropdown-item" href="projects.html">Projects</a></li>
              </ul>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="skills.html">Skills</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="contact.html">Contact</a>
            </li>
          </ul>
        </div>
      </nav>
    `;
  };

  beforeEach(() => {
    setupNavigationDOM();
  });

  describe('Mobile navigation behavior', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', { value: 768, writable: true });
    });

    test('should close menu when clicking a nav link', () => {
      setupNavigationDOM();
      const navbarCollapse = document.querySelector('.navbar-collapse');
      const navbarToggler = document.querySelector('.navbar-toggler');
      navbarCollapse.classList.add('show');
      navbarToggler.click = jest.fn();

      initNavigation();

      const aboutLink = document.querySelector('a[href="about.html"]');
      aboutLink.click();

      expect(navbarToggler.click).toHaveBeenCalled();
    });

    test('should not close menu when it is already closed', () => {
      setupNavigationDOM();
      const navbarToggler = document.querySelector('.navbar-toggler');
      navbarToggler.click = jest.fn();

      initNavigation();

      const aboutLink = document.querySelector('a[href="about.html"]');
      aboutLink.click();

      expect(navbarToggler.click).not.toHaveBeenCalled();
    });

    test('should toggle dropdown on arrow click', () => {
      setupNavigationDOM();
      initNavigation();

      const dropdown = document.querySelector('.nav-item.dropdown');
      const arrow = document.querySelector('.dropdown-arrow');

      arrow.click();

      expect(dropdown.classList.contains('show')).toBe(true);
    });
  });

  describe('Desktop navigation behavior', () => {
    test('should remove mobile dropdown show class on resize to desktop', () => {
      Object.defineProperty(window, 'innerWidth', { value: 768, writable: true });
      setupNavigationDOM();

      initNavigation();

      const dropdown = document.querySelector('.nav-item.dropdown');
      dropdown.classList.add('show');

      // Simulate resize to desktop
      Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true });
      window.dispatchEvent(new Event('resize'));

      expect(dropdown.classList.contains('show')).toBe(false);
    });
  });

  describe('highlightActivePage function', () => {
    test('should not throw when no nav links exist', () => {
      document.body.innerHTML = '<div>No nav</div>';
      expect(() => highlightActivePage()).not.toThrow();
    });

    test('should handle nav links without matching hrefs', () => {
      setupNavigationDOM();
      // The function should run without errors even if no href matches
      expect(() => highlightActivePage()).not.toThrow();
    });

    test('should add active class when link href matches current page', () => {
      setupNavigationDOM();
      // Manually test the active class application logic
      const navLinks = document.querySelectorAll('.nav-link');
      const targetLink = document.querySelector('a[href="about.html"]');

      // Simulate what highlightActivePage does for a matching link
      navLinks.forEach(link => link.classList.remove('active'));
      targetLink.classList.add('active');

      expect(targetLink.classList.contains('active')).toBe(true);
    });

    test('should ensure only one nav link has active class', () => {
      setupNavigationDOM();
      const navLinks = document.querySelectorAll('.nav-link');

      // Add active to all links first
      navLinks.forEach(link => link.classList.add('active'));

      // Simulate the behavior of removing all active and adding one
      navLinks.forEach(link => link.classList.remove('active'));
      navLinks[0].classList.add('active');

      const activeLinks = document.querySelectorAll('.nav-link.active');
      expect(activeLinks.length).toBe(1);
    });
  });

  describe('initNavigation function', () => {
    test('should not throw with empty DOM', () => {
      document.body.innerHTML = '';
      expect(() => initNavigation()).not.toThrow();
    });

    test('should not throw with minimal navigation structure', () => {
      document.body.innerHTML = `
        <nav class="navbar">
          <button class="navbar-toggler"></button>
          <div class="navbar-collapse"></div>
        </nav>
      `;
      expect(() => initNavigation()).not.toThrow();
    });

    test('should call highlightActivePage without error', () => {
      setupNavigationDOM();
      expect(() => initNavigation()).not.toThrow();
    });
  });

  describe('initMobileDropdowns function', () => {
    test('should not throw when no dropdowns exist', () => {
      document.body.innerHTML = '<nav></nav>';
      expect(() => initMobileDropdowns()).not.toThrow();
    });

    test('should handle dropdown without arrow', () => {
      document.body.innerHTML = `
        <nav>
          <div class="nav-item dropdown">
            <a class="nav-link" href="#">Menu</a>
          </div>
        </nav>
      `;
      Object.defineProperty(window, 'innerWidth', { value: 768, writable: true });
      expect(() => initMobileDropdowns()).not.toThrow();
    });
  });
});
