/**
 * Utility Functions Tests
 * Tests for debounce and scrollToElement functions
 */

const { debounce, scrollToElement } = require('../../../assets/js/script');

describe('Utility Functions', () => {
  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('should delay function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('should only execute once for multiple rapid calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();
      debouncedFn();

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('should reset timer on each call', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      jest.advanceTimersByTime(50);

      debouncedFn();
      jest.advanceTimersByTime(50);

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(50);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('should pass arguments to debounced function', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('arg1', 'arg2', 'arg3');

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
    });

    test('should use last arguments when called multiple times', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('first');
      debouncedFn('second');
      debouncedFn('third');

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledWith('third');
    });

    test('should allow execution after wait period', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      jest.advanceTimersByTime(100);

      debouncedFn();
      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    test('should work with zero wait time', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 0);

      debouncedFn();

      jest.advanceTimersByTime(0);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('should handle this context correctly', () => {
      const obj = {
        value: 42,
        getValue: jest.fn(function() {
          return this.value;
        })
      };

      const debouncedGetValue = debounce(obj.getValue.bind(obj), 100);

      debouncedGetValue();
      jest.advanceTimersByTime(100);

      expect(obj.getValue).toHaveBeenCalled();
    });
  });

  describe('scrollToElement', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="section1">Section 1</div>
        <div id="section2">Section 2</div>
        <div class="target-class">Target</div>
      `;
    });

    test('should call scrollIntoView on matching element', () => {
      scrollToElement('#section1');

      expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    });

    test('should use smooth behavior', () => {
      scrollToElement('#section1');

      expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start'
      });
    });

    test('should not throw for non-existent element', () => {
      expect(() => scrollToElement('#nonexistent')).not.toThrow();
    });

    test('should not call scrollIntoView for non-existent element', () => {
      Element.prototype.scrollIntoView.mockClear();

      scrollToElement('#nonexistent');

      expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
    });

    test('should work with class selectors', () => {
      scrollToElement('.target-class');

      expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    });

    test('should work with complex selectors', () => {
      scrollToElement('div#section2');

      expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    });
  });
});
