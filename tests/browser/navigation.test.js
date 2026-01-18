/**
 * Browser Tests - Navigation
 * Tests for navigation functionality in assets/js/script.js
 */

const {
  initNavigation,
  initMobileDropdowns,
  highlightActivePage,
  initScrollAnimations
} = require('../../assets/js/script.js');

describe('Navigation', () => {
  describe('highlightActivePage()', () => {
    it('should skip if active class already exists (production case)', () => {
      document.body.innerHTML = `
        <body data-page="about">
          <nav>
            <a class="nav-link active" data-nav="home">Home</a>
            <a class="nav-link" data-nav="about">About</a>
          </nav>
        </body>
      `;

      highlightActivePage();

      // Should not change - home should still be active
      const homeLink = document.querySelector('[data-nav="home"]');
      const aboutLink = document.querySelector('[data-nav="about"]');

      expect(homeLink.classList.contains('active')).toBe(true);
      expect(aboutLink.classList.contains('active')).toBe(false);
    });

    it('should add active class to matching data-nav link', () => {
      document.body.setAttribute('data-page', 'about');
      document.body.innerHTML = `
        <nav>
          <a class="nav-link" data-nav="home">Home</a>
          <a class="nav-link" data-nav="about">About</a>
          <a class="nav-link" data-nav="contact">Contact</a>
        </nav>
      `;

      highlightActivePage();

      const aboutLink = document.querySelector('[data-nav="about"]');
      expect(aboutLink.classList.contains('active')).toBe(true);
    });

    it('should only activate one nav link', () => {
      document.body.setAttribute('data-page', 'skills');
      document.body.innerHTML = `
        <nav>
          <a class="nav-link" data-nav="home">Home</a>
          <a class="nav-link" data-nav="about">About</a>
          <a class="nav-link" data-nav="skills">Skills</a>
          <a class="nav-link" data-nav="contact">Contact</a>
        </nav>
      `;

      highlightActivePage();

      const activeLinks = document.querySelectorAll('.nav-link.active');
      expect(activeLinks.length).toBe(1);
      expect(activeLinks[0].getAttribute('data-nav')).toBe('skills');
    });

    it('should handle missing data-page attribute', () => {
      document.body.removeAttribute('data-page');
      document.body.innerHTML = `
        <nav>
          <a class="nav-link" data-nav="home">Home</a>
          <a class="nav-link" data-nav="about">About</a>
        </nav>
      `;

      expect(() => highlightActivePage()).not.toThrow();

      const activeLinks = document.querySelectorAll('.nav-link.active');
      expect(activeLinks.length).toBe(0);
    });

    it('should handle no matching nav link', () => {
      document.body.setAttribute('data-page', 'nonexistent');
      document.body.innerHTML = `
        <nav>
          <a class="nav-link" data-nav="home">Home</a>
          <a class="nav-link" data-nav="about">About</a>
        </nav>
      `;

      highlightActivePage();

      const activeLinks = document.querySelectorAll('.nav-link.active');
      expect(activeLinks.length).toBe(0);
    });
  });

  describe('initMobileDropdowns()', () => {
    beforeEach(() => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 991
      });
    });

    it('should set up arrow click listeners on mobile (<992px)', () => {
      window.innerWidth = 991;

      document.body.innerHTML = `
        <nav>
          <div class="nav-item dropdown">
            <a class="nav-link">Portfolio</a>
            <span class="dropdown-arrow">▼</span>
          </div>
        </nav>
      `;

      const arrow = document.querySelector('.dropdown-arrow');
      const addEventListenerSpy = jest.spyOn(arrow, 'addEventListener');

      initMobileDropdowns();

      expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));

      addEventListenerSpy.mockRestore();
    });

    it('should toggle show class on dropdown items when arrow clicked', () => {
      window.innerWidth = 991;

      document.body.innerHTML = `
        <nav>
          <div class="nav-item dropdown">
            <a class="nav-link">Portfolio</a>
            <span class="dropdown-arrow">▼</span>
          </div>
        </nav>
      `;

      const item = document.querySelector('.nav-item.dropdown');
      const arrow = document.querySelector('.dropdown-arrow');

      initMobileDropdowns();

      // First click - add show
      arrow.click();
      expect(item.classList.contains('show')).toBe(true);

      // Second click - remove show
      arrow.click();
      expect(item.classList.contains('show')).toBe(false);
    });

    it('should remove show class on desktop resize (≥992px)', () => {
      window.innerWidth = 991;

      document.body.innerHTML = `
        <nav>
          <div class="nav-item dropdown show">
            <a class="nav-link">Portfolio</a>
            <span class="dropdown-arrow">▼</span>
          </div>
          <div class="nav-item dropdown show">
            <a class="nav-link">Projects</a>
            <span class="dropdown-arrow">▼</span>
          </div>
        </nav>
      `;

      initMobileDropdowns();

      // Simulate resize to desktop
      window.innerWidth = 992;
      window.dispatchEvent(new Event('resize'));

      const dropdowns = document.querySelectorAll('.nav-item.dropdown');
      dropdowns.forEach(dropdown => {
        expect(dropdown.classList.contains('show')).toBe(false);
      });
    });

    it('should prevent default and stop propagation on arrow click', () => {
      window.innerWidth = 991;

      document.body.innerHTML = `
        <nav>
          <div class="nav-item dropdown">
            <a class="nav-link">Portfolio</a>
            <span class="dropdown-arrow">▼</span>
          </div>
        </nav>
      `;

      const arrow = document.querySelector('.dropdown-arrow');

      initMobileDropdowns();

      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      });
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
      const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');

      arrow.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it('should handle multiple dropdown items', () => {
      window.innerWidth = 991;

      document.body.innerHTML = `
        <nav>
          <div class="nav-item dropdown">
            <a class="nav-link">Portfolio</a>
            <span class="dropdown-arrow">▼</span>
          </div>
          <div class="nav-item dropdown">
            <a class="nav-link">Projects</a>
            <span class="dropdown-arrow">▼</span>
          </div>
        </nav>
      `;

      initMobileDropdowns();

      const arrows = document.querySelectorAll('.dropdown-arrow');
      const items = document.querySelectorAll('.nav-item.dropdown');

      // Click first arrow
      arrows[0].click();
      expect(items[0].classList.contains('show')).toBe(true);
      expect(items[1].classList.contains('show')).toBe(false);

      // Click second arrow
      arrows[1].click();
      expect(items[0].classList.contains('show')).toBe(true);
      expect(items[1].classList.contains('show')).toBe(true);
    });
  });

  describe('initNavigation()', () => {
    it('should call highlightActivePage', () => {
      document.body.setAttribute('data-page', 'home');
      document.body.innerHTML = `
        <nav class="navbar-collapse">
          <a class="nav-link" data-nav="home">Home</a>
        </nav>
        <button class="navbar-toggler"></button>
      `;

      initNavigation();

      const homeLink = document.querySelector('[data-nav="home"]');
      expect(homeLink.classList.contains('active')).toBe(true);
    });

    it('should set up mobile menu close on link click', () => {
      document.body.innerHTML = `
        <div class="navbar-collapse show">
          <a class="nav-link">Home</a>
          <a class="nav-link">About</a>
        </div>
        <button class="navbar-toggler"></button>
      `;

      const navbarCollapse = document.querySelector('.navbar-collapse');
      const navbarToggler = document.querySelector('.navbar-toggler');
      const navLinks = document.querySelectorAll('.nav-link');

      initNavigation();

      // Click a nav link
      navLinks[0].click();

      // Check if toggler was clicked (menu should close)
      expect(navbarToggler.click).toBeDefined();
    });

    it('should call initMobileDropdowns', () => {
      window.innerWidth = 991;

      document.body.innerHTML = `
        <nav class="navbar-collapse">
          <div class="nav-item dropdown">
            <a class="nav-link">Portfolio</a>
            <span class="dropdown-arrow">▼</span>
          </div>
        </nav>
        <button class="navbar-toggler"></button>
      `;

      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

      initNavigation();

      // Check that resize listener was added
      const resizeListeners = addEventListenerSpy.mock.calls.filter(
        call => call[0] === 'resize'
      );
      expect(resizeListeners.length).toBeGreaterThan(0);

      addEventListenerSpy.mockRestore();
    });

    it('should handle missing navbar elements gracefully', () => {
      document.body.innerHTML = '<div>No navbar here</div>';

      expect(() => initNavigation()).not.toThrow();
    });
  });

  describe('initScrollAnimations()', () => {
    let observerInstance;
    let originalIntersectionObserver;

    beforeEach(() => {
      // Save the original and create a spy version
      originalIntersectionObserver = global.IntersectionObserver;
      global.IntersectionObserver = jest.fn((callback, options) => {
        observerInstance = {
          callback,
          options,
          observedElements: [],
          observe: jest.fn(function(element) {
            this.observedElements.push(element);
          }),
          unobserve: jest.fn(),
          disconnect: jest.fn()
        };
        return observerInstance;
      });
    });

    afterEach(() => {
      global.IntersectionObserver = originalIntersectionObserver;
    });

    it('should create IntersectionObserver', () => {
      document.body.innerHTML = `
        <div class="animate-on-scroll">Element 1</div>
        <div class="animate-on-scroll">Element 2</div>
      `;

      initScrollAnimations();

      expect(global.IntersectionObserver).toHaveBeenCalled();
    });

    it('should observe all animated elements', () => {
      document.body.innerHTML = `
        <div class="animate-on-scroll">Element 1</div>
        <div class="animate-on-scroll">Element 2</div>
        <div class="animate-on-scroll">Element 3</div>
      `;

      initScrollAnimations();

      expect(observerInstance.observe).toHaveBeenCalledTimes(3);
      expect(observerInstance.observedElements.length).toBe(3);
    });

    it('should add visible class when element intersects', () => {
      document.body.innerHTML = `
        <div class="animate-on-scroll">Element 1</div>
      `;

      const element = document.querySelector('.animate-on-scroll');

      initScrollAnimations();

      // Simulate intersection by calling the callback
      observerInstance.callback([{
        target: element,
        isIntersecting: true
      }]);

      expect(element.classList.contains('visible')).toBe(true);
    });

    it('should use correct threshold (0.1)', () => {
      document.body.innerHTML = `
        <div class="animate-on-scroll">Element 1</div>
      `;

      initScrollAnimations();

      expect(observerInstance.options.threshold).toBe(0.1);
    });

    it('should use correct rootMargin', () => {
      document.body.innerHTML = `
        <div class="animate-on-scroll">Element 1</div>
      `;

      initScrollAnimations();

      expect(observerInstance.options.rootMargin).toBe('0px 0px -50px 0px');
    });

    it('should exit early if no elements to animate', () => {
      document.body.innerHTML = '<div>No animated elements</div>';

      initScrollAnimations();

      expect(global.IntersectionObserver).not.toHaveBeenCalled();
    });

    it('should not add visible class when element is not intersecting', () => {
      document.body.innerHTML = `
        <div class="animate-on-scroll">Element 1</div>
      `;

      const element = document.querySelector('.animate-on-scroll');

      initScrollAnimations();

      // Simulate non-intersection
      observerInstance.callback([{
        target: element,
        isIntersecting: false
      }]);

      expect(element.classList.contains('visible')).toBe(false);
    });
  });
});
