/**
 * Browser Tests - Theme Manager and Form Validation
 * Tests for assets/js/script.js
 */

const {
  ThemeManager,
  validateName,
  validateEmail,
  validateSubject,
  validateMessage,
  showError,
  showSuccess,
  clearFieldError,
  handleFormSubmission,
  scrollToElement,
  debounce
} = require('../../assets/js/script.js');

describe('ThemeManager', () => {
  beforeEach(() => {
    // Setup DOM
    document.documentElement.setAttribute('data-theme', '');
    document.body.innerHTML = `
      <i id="theme-icon"></i>
      <button id="theme-toggle">Toggle</button>
    `;
    // Clear localStorage
    localStorage.clear();
  });

  describe('init()', () => {
    it('should detect system preference when no stored value', () => {
      // localStorage is already clear, so getItem will return null
      window.matchMedia.mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      }));

      ThemeManager.init();

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('should use stored preference over system preference', () => {
      localStorage.setItem('theme-preference', 'light');
      window.matchMedia.mockImplementation(query => ({
        matches: true, // System prefers dark
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      }));

      ThemeManager.init();

      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('should default to light theme when system preference is light', () => {
      // localStorage is already clear, so getItem will return null
      window.matchMedia.mockImplementation(query => ({
        matches: false, // System prefers light
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      }));

      ThemeManager.init();

      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('should set up media query change listener', () => {
      const addEventListenerMock = jest.fn();
      // localStorage is already clear
      window.matchMedia.mockImplementation(query => ({
        matches: false,
        media: query,
        addEventListener: addEventListenerMock,
        removeEventListener: jest.fn()
      }));

      ThemeManager.init();

      expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
    });
  });

  describe('setTheme()', () => {
    it('should update data-theme attribute to dark', () => {
      ThemeManager.setTheme('dark');

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('should update data-theme attribute to light', () => {
      ThemeManager.setTheme('light');

      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('should call updateIcon with correct theme', () => {
      const updateIconSpy = jest.spyOn(ThemeManager, 'updateIcon');

      ThemeManager.setTheme('dark');

      expect(updateIconSpy).toHaveBeenCalledWith('dark');

      updateIconSpy.mockRestore();
    });
  });

  describe('updateIcon()', () => {
    it('should change icon class to bi-moon-fill for dark theme', () => {
      const icon = document.getElementById('theme-icon');

      ThemeManager.updateIcon('dark');

      expect(icon.className).toBe('bi bi-moon-fill');
    });

    it('should change icon class to bi-sun-fill for light theme', () => {
      const icon = document.getElementById('theme-icon');

      ThemeManager.updateIcon('light');

      expect(icon.className).toBe('bi bi-sun-fill');
    });

    it('should not error if icon element does not exist', () => {
      document.getElementById('theme-icon').remove();

      expect(() => ThemeManager.updateIcon('dark')).not.toThrow();
    });
  });

  describe('setupToggle()', () => {
    it('should add click listener to toggle button', () => {
      const toggle = document.getElementById('theme-toggle');
      const addEventListenerSpy = jest.spyOn(toggle, 'addEventListener');

      ThemeManager.setupToggle();

      expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));

      addEventListenerSpy.mockRestore();
    });

    it('should toggle from light to dark', () => {
      document.documentElement.setAttribute('data-theme', 'light');

      ThemeManager.setupToggle();
      document.getElementById('theme-toggle').click();

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      // Verify the value was stored in localStorage
      expect(localStorage.getItem('theme-preference')).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      document.documentElement.setAttribute('data-theme', 'dark');

      ThemeManager.setupToggle();
      document.getElementById('theme-toggle').click();

      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      // Verify the value was stored in localStorage
      expect(localStorage.getItem('theme-preference')).toBe('light');
    });

    it('should save preference to localStorage', () => {
      document.documentElement.setAttribute('data-theme', 'light');

      ThemeManager.setupToggle();
      document.getElementById('theme-toggle').click();

      // Verify the value was stored
      expect(localStorage.getItem('theme-preference')).toBe('dark');
    });

    it('should not error if toggle button does not exist', () => {
      document.getElementById('theme-toggle').remove();

      expect(() => ThemeManager.setupToggle()).not.toThrow();
    });
  });
});

describe('Form Validation', () => {
  let field;

  beforeEach(() => {
    // Create a mock form field
    document.body.innerHTML = `
      <div class="form-group">
        <input type="text" id="testField" class="form-control">
      </div>
    `;
    field = document.getElementById('testField');
  });

  describe('validateName()', () => {
    it('should return false for empty name', () => {
      field.value = '';

      const result = validateName(field);

      expect(result).toBe(false);
      expect(field.classList.contains('is-invalid')).toBe(true);
    });

    it('should return false for name with 1 character', () => {
      field.value = 'A';

      const result = validateName(field);

      expect(result).toBe(false);
      expect(field.parentElement.querySelector('.invalid-feedback').textContent)
        .toBe('Name must be at least 2 characters long');
    });

    it('should return false for numbers only', () => {
      field.value = '123';

      const result = validateName(field);

      expect(result).toBe(false);
      expect(field.parentElement.querySelector('.invalid-feedback').textContent)
        .toBe('Please enter a valid name');
    });

    it('should return true for valid name "John Doe"', () => {
      field.value = 'John Doe';

      const result = validateName(field);

      expect(result).toBe(true);
      expect(field.classList.contains('is-valid')).toBe(true);
    });

    it('should return true for name with minimum 2 characters', () => {
      field.value = 'Jo';

      const result = validateName(field);

      expect(result).toBe(true);
    });

    it('should trim whitespace', () => {
      field.value = '  John Doe  ';

      const result = validateName(field);

      expect(result).toBe(true);
    });
  });

  describe('validateEmail()', () => {
    it('should return false for empty email', () => {
      field.value = '';

      const result = validateEmail(field);

      expect(result).toBe(false);
      expect(field.classList.contains('is-invalid')).toBe(true);
      expect(field.parentElement.querySelector('.invalid-feedback').textContent)
        .toBe('Please enter your email address');
    });

    it('should return false for invalid email "notanemail"', () => {
      field.value = 'notanemail';

      const result = validateEmail(field);

      expect(result).toBe(false);
      expect(field.parentElement.querySelector('.invalid-feedback').textContent)
        .toBe('Please enter a valid email address');
    });

    it('should return false for invalid email "test@"', () => {
      field.value = 'test@';

      const result = validateEmail(field);

      expect(result).toBe(false);
    });

    it('should return false for email without domain', () => {
      field.value = 'test@example';

      const result = validateEmail(field);

      expect(result).toBe(false);
    });

    it('should return true for valid email "test@example.com"', () => {
      field.value = 'test@example.com';

      const result = validateEmail(field);

      expect(result).toBe(true);
      expect(field.classList.contains('is-valid')).toBe(true);
    });

    it('should trim whitespace', () => {
      field.value = '  test@example.com  ';

      const result = validateEmail(field);

      expect(result).toBe(true);
    });
  });

  describe('validateSubject()', () => {
    it('should return false for empty subject', () => {
      field.value = '';

      const result = validateSubject(field);

      expect(result).toBe(false);
      expect(field.classList.contains('is-invalid')).toBe(true);
      expect(field.parentElement.querySelector('.invalid-feedback').textContent)
        .toBe('Please enter a subject');
    });

    it('should return false for 2 characters', () => {
      field.value = 'Hi';

      const result = validateSubject(field);

      expect(result).toBe(false);
      expect(field.parentElement.querySelector('.invalid-feedback').textContent)
        .toBe('Subject must be at least 3 characters long');
    });

    it('should return true for valid subject with 3 characters', () => {
      field.value = 'Hey';

      const result = validateSubject(field);

      expect(result).toBe(true);
      expect(field.classList.contains('is-valid')).toBe(true);
    });

    it('should return true for longer subject', () => {
      field.value = 'Project Inquiry';

      const result = validateSubject(field);

      expect(result).toBe(true);
    });
  });

  describe('validateMessage()', () => {
    it('should return false for empty message', () => {
      field.value = '';

      const result = validateMessage(field);

      expect(result).toBe(false);
      expect(field.classList.contains('is-invalid')).toBe(true);
      expect(field.parentElement.querySelector('.invalid-feedback').textContent)
        .toBe('Please enter your message');
    });

    it('should return false for 8 characters', () => {
      field.value = 'Hello!!!';

      const result = validateMessage(field);

      expect(result).toBe(false);
      expect(field.parentElement.querySelector('.invalid-feedback').textContent)
        .toBe('Message must be at least 10 characters long');
    });

    it('should return true for valid message with 10 characters', () => {
      field.value = 'Hello there';

      const result = validateMessage(field);

      expect(result).toBe(true);
      expect(field.classList.contains('is-valid')).toBe(true);
    });

    it('should return true for longer message', () => {
      field.value = 'I would like to discuss a project with you.';

      const result = validateMessage(field);

      expect(result).toBe(true);
    });
  });

  describe('showError()', () => {
    it('should add is-invalid class', () => {
      showError(field, 'Error message');

      expect(field.classList.contains('is-invalid')).toBe(true);
    });

    it('should remove is-valid class', () => {
      field.classList.add('is-valid');

      showError(field, 'Error message');

      expect(field.classList.contains('is-valid')).toBe(false);
    });

    it('should create feedback div with message', () => {
      showError(field, 'Test error message');

      const feedback = field.parentElement.querySelector('.invalid-feedback');
      expect(feedback).not.toBeNull();
      expect(feedback.textContent).toBe('Test error message');
    });

    it('should replace existing error message', () => {
      showError(field, 'First error');
      showError(field, 'Second error');

      const feedbacks = field.parentElement.querySelectorAll('.invalid-feedback');
      expect(feedbacks.length).toBe(1);
      expect(feedbacks[0].textContent).toBe('Second error');
    });
  });

  describe('showSuccess()', () => {
    it('should add is-valid class', () => {
      showSuccess(field);

      expect(field.classList.contains('is-valid')).toBe(true);
    });

    it('should remove is-invalid class', () => {
      field.classList.add('is-invalid');

      showSuccess(field);

      expect(field.classList.contains('is-invalid')).toBe(false);
    });

    it('should clear existing error messages', () => {
      showError(field, 'Error');

      showSuccess(field);

      const feedback = field.parentElement.querySelector('.invalid-feedback');
      expect(feedback).toBeNull();
    });
  });

  describe('clearFieldError()', () => {
    it('should remove is-invalid class', () => {
      field.classList.add('is-invalid');

      clearFieldError(field);

      expect(field.classList.contains('is-invalid')).toBe(false);
    });

    it('should remove is-valid class', () => {
      field.classList.add('is-valid');

      clearFieldError(field);

      expect(field.classList.contains('is-valid')).toBe(false);
    });

    it('should remove invalid-feedback div', () => {
      showError(field, 'Error');

      clearFieldError(field);

      const feedback = field.parentElement.querySelector('.invalid-feedback');
      expect(feedback).toBeNull();
    });
  });

  describe('handleFormSubmission()', () => {
    let form;

    beforeEach(() => {
      document.body.innerHTML = `
        <form id="contactForm" action="https://formspree.io/test">
          <input type="text" id="name" class="form-control">
          <input type="email" id="email" class="form-control">
        </form>
      `;
      form = document.getElementById('contactForm');
    });

    it('should call fetch with correct parameters', async () => {
      // Suppress scrollIntoView error from JSDOM limitation
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200
      });

      await handleFormSubmission(form);

      expect(fetch).toHaveBeenCalledWith(
        'https://formspree.io/test',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          }
        })
      );

      consoleSpy.mockRestore();
    });

    it('should show success message on successful submission', async () => {
      // Suppress scrollIntoView error from JSDOM limitation
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200
      });

      await handleFormSubmission(form);

      const successAlert = document.querySelector('.alert-success');
      expect(successAlert).not.toBeNull();
      expect(successAlert.textContent).toContain('Success!');

      consoleSpy.mockRestore();
    });

    it('should reset form on successful submission', async () => {
      // Suppress scrollIntoView error from JSDOM limitation
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200
      });

      await handleFormSubmission(form);

      // Check that form fields are cleared
      const nameField = document.getElementById('name');
      const emailField = document.getElementById('email');
      expect(nameField.value).toBe('');
      expect(emailField.value).toBe('');

      consoleSpy.mockRestore();
    });

    it('should show error message on failed submission', (done) => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      handleFormSubmission(form);

      // Wait for async operations to complete
      setTimeout(() => {
        const errorAlert = document.querySelector('.alert-danger');
        expect(errorAlert).not.toBeNull();
        expect(errorAlert.textContent).toContain('Error!');
        consoleSpy.mockRestore();
        done();
      }, 10);
    });

    it('should show error message on network error', (done) => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      fetch.mockRejectedValueOnce(new Error('Network error'));

      handleFormSubmission(form);

      // Wait for async operations to complete
      setTimeout(() => {
        const errorAlert = document.querySelector('.alert-danger');
        expect(errorAlert).not.toBeNull();
        consoleSpy.mockRestore();
        done();
      }, 10);
    });
  });
});

describe('Utility Functions', () => {
  describe('scrollToElement()', () => {
    it('should call scrollIntoView on element', () => {
      document.body.innerHTML = '<div id="test-section"></div>';
      const element = document.getElementById('test-section');
      const scrollIntoViewMock = jest.fn();
      element.scrollIntoView = scrollIntoViewMock;

      scrollToElement('#test-section');

      expect(scrollIntoViewMock).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start'
      });
    });

    it('should handle selector not found gracefully', () => {
      expect(() => scrollToElement('#nonexistent')).not.toThrow();
    });
  });

  describe('debounce()', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should delay function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should cancel previous timeout', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should execute with correct arguments', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('arg1', 'arg2');

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });
});
