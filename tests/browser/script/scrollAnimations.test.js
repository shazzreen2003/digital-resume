/**
 * Scroll Animations Tests
 * Tests for initScrollAnimations with IntersectionObserver
 */

const { initScrollAnimations } = require('../../../assets/js/script');

describe('Scroll Animations', () => {
  let mockObserverInstance;
  let observerCallback;

  beforeEach(() => {
    // Reset the IntersectionObserver mock to track instances
    mockObserverInstance = null;
    observerCallback = null;

    global.IntersectionObserver = jest.fn((callback, options) => {
      observerCallback = callback;
      mockObserverInstance = {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
        callback,
        options
      };
      return mockObserverInstance;
    });
  });

  describe('initScrollAnimations', () => {
    test('should not create observer if no animated elements exist', () => {
      document.body.innerHTML = '<div>No animated content</div>';

      initScrollAnimations();

      expect(global.IntersectionObserver).not.toHaveBeenCalled();
    });

    test('should create IntersectionObserver for animated elements', () => {
      document.body.innerHTML = `
        <div class="animate-on-scroll">Animated 1</div>
        <div class="animate-on-scroll">Animated 2</div>
      `;

      initScrollAnimations();

      expect(global.IntersectionObserver).toHaveBeenCalled();
    });

    test('should observe all animated elements', () => {
      document.body.innerHTML = `
        <div class="animate-on-scroll">Animated 1</div>
        <div class="animate-on-scroll">Animated 2</div>
        <div class="animate-on-scroll">Animated 3</div>
      `;

      initScrollAnimations();

      expect(mockObserverInstance.observe).toHaveBeenCalledTimes(3);
    });

    test('should use correct threshold option', () => {
      document.body.innerHTML = '<div class="animate-on-scroll">Animated</div>';

      initScrollAnimations();

      expect(mockObserverInstance.options.threshold).toBe(0.1);
    });

    test('should use correct rootMargin option', () => {
      document.body.innerHTML = '<div class="animate-on-scroll">Animated</div>';

      initScrollAnimations();

      expect(mockObserverInstance.options.rootMargin).toBe('0px 0px -50px 0px');
    });

    test('should add visible class when element intersects', () => {
      document.body.innerHTML = '<div class="animate-on-scroll">Animated</div>';
      const element = document.querySelector('.animate-on-scroll');

      initScrollAnimations();

      // Simulate intersection
      observerCallback([
        {
          isIntersecting: true,
          target: element
        }
      ]);

      expect(element.classList.contains('visible')).toBe(true);
    });

    test('should not add visible class when element is not intersecting', () => {
      document.body.innerHTML = '<div class="animate-on-scroll">Animated</div>';
      const element = document.querySelector('.animate-on-scroll');

      initScrollAnimations();

      // Simulate non-intersection
      observerCallback([
        {
          isIntersecting: false,
          target: element
        }
      ]);

      expect(element.classList.contains('visible')).toBe(false);
    });

    test('should handle multiple intersection entries', () => {
      document.body.innerHTML = `
        <div class="animate-on-scroll" id="el1">Animated 1</div>
        <div class="animate-on-scroll" id="el2">Animated 2</div>
      `;
      const el1 = document.getElementById('el1');
      const el2 = document.getElementById('el2');

      initScrollAnimations();

      // Simulate both elements intersecting
      observerCallback([
        { isIntersecting: true, target: el1 },
        { isIntersecting: false, target: el2 }
      ]);

      expect(el1.classList.contains('visible')).toBe(true);
      expect(el2.classList.contains('visible')).toBe(false);
    });

    test('should handle empty element list gracefully', () => {
      document.body.innerHTML = '';

      expect(() => initScrollAnimations()).not.toThrow();
    });

    test('should keep visible class once added', () => {
      document.body.innerHTML = '<div class="animate-on-scroll">Animated</div>';
      const element = document.querySelector('.animate-on-scroll');

      initScrollAnimations();

      // First intersection
      observerCallback([{ isIntersecting: true, target: element }]);
      expect(element.classList.contains('visible')).toBe(true);

      // Element scrolls out
      observerCallback([{ isIntersecting: false, target: element }]);

      // visible class should remain (animations typically don't remove once added)
      expect(element.classList.contains('visible')).toBe(true);
    });
  });
});
