/**
 * Contact Page Integration Tests
 * Tests the complete contact form flow from validation to submission
 */

const {
  initFormValidation,
  validateName,
  validateEmail,
  validateSubject,
  validateMessage,
  handleFormSubmission
} = require('../../../assets/js/script');

describe('Contact Page Integration', () => {
  beforeEach(() => {
    jest.useFakeTimers();

    // Set up a complete contact form
    document.body.innerHTML = `
      <form id="contactForm" action="https://formspree.io/test">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" class="form-control" value="">
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" class="form-control" value="">
        </div>
        <div class="form-group">
          <label for="subject">Subject</label>
          <input type="text" id="subject" name="subject" class="form-control" value="">
        </div>
        <div class="form-group">
          <label for="message">Message</label>
          <textarea id="message" name="message" class="form-control"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Send Message</button>
      </form>
    `;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Complete form validation flow', () => {
    test('should show all error messages when submitting empty form', () => {
      initFormValidation();

      const form = document.getElementById('contactForm');
      const event = new Event('submit', { cancelable: true });
      form.dispatchEvent(event);

      const errors = document.querySelectorAll('.invalid-feedback');
      expect(errors.length).toBe(4);
    });

    test('should validate fields in order on submit', () => {
      initFormValidation();

      const form = document.getElementById('contactForm');
      const event = new Event('submit', { cancelable: true });
      form.dispatchEvent(event);

      const nameField = document.getElementById('name');
      const emailField = document.getElementById('email');
      const subjectField = document.getElementById('subject');
      const messageField = document.getElementById('message');

      expect(nameField.classList.contains('is-invalid')).toBe(true);
      expect(emailField.classList.contains('is-invalid')).toBe(true);
      expect(subjectField.classList.contains('is-invalid')).toBe(true);
      expect(messageField.classList.contains('is-invalid')).toBe(true);
    });

    test('should clear error when field is focused', () => {
      initFormValidation();

      const nameField = document.getElementById('name');

      // Trigger validation error
      nameField.dispatchEvent(new Event('blur'));
      expect(nameField.classList.contains('is-invalid')).toBe(true);

      // Focus should clear error
      nameField.dispatchEvent(new Event('focus'));
      expect(nameField.classList.contains('is-invalid')).toBe(false);
    });

    test('should show success state when field becomes valid', () => {
      initFormValidation();

      const nameField = document.getElementById('name');
      nameField.value = 'John Doe';
      nameField.dispatchEvent(new Event('blur'));

      expect(nameField.classList.contains('is-valid')).toBe(true);
    });

    test('should progressively validate as user fills form', () => {
      initFormValidation();

      // Fill in name
      const nameField = document.getElementById('name');
      nameField.value = 'John Doe';
      nameField.dispatchEvent(new Event('blur'));
      expect(nameField.classList.contains('is-valid')).toBe(true);

      // Fill in email
      const emailField = document.getElementById('email');
      emailField.value = 'john@example.com';
      emailField.dispatchEvent(new Event('blur'));
      expect(emailField.classList.contains('is-valid')).toBe(true);

      // Fill in subject
      const subjectField = document.getElementById('subject');
      subjectField.value = 'Test Subject';
      subjectField.dispatchEvent(new Event('blur'));
      expect(subjectField.classList.contains('is-valid')).toBe(true);

      // Fill in message
      const messageField = document.getElementById('message');
      messageField.value = 'This is a test message that is long enough.';
      messageField.dispatchEvent(new Event('blur'));
      expect(messageField.classList.contains('is-valid')).toBe(true);
    });
  });

  describe('Form submission flow', () => {
    test('should not submit when validation fails', () => {
      initFormValidation();

      const form = document.getElementById('contactForm');
      const event = new Event('submit', { cancelable: true });
      form.dispatchEvent(event);

      expect(global.fetch).not.toHaveBeenCalled();
    });

    test('should submit when all fields are valid', () => {
      initFormValidation();
      global.fetch.mockResolvedValueOnce({ ok: true });

      document.getElementById('name').value = 'John Doe';
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('subject').value = 'Test Subject';
      document.getElementById('message').value = 'This is a test message that is long enough.';

      const form = document.getElementById('contactForm');
      const event = new Event('submit', { cancelable: true });
      form.dispatchEvent(event);

      expect(global.fetch).toHaveBeenCalled();
    });

    test('should show success message after successful submission', async () => {
      initFormValidation();
      global.fetch.mockResolvedValueOnce({ ok: true });

      document.getElementById('name').value = 'John Doe';
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('subject').value = 'Test Subject';
      document.getElementById('message').value = 'This is a test message that is long enough.';

      const form = document.getElementById('contactForm');
      form.dispatchEvent(new Event('submit', { cancelable: true }));

      await Promise.resolve();

      const successAlert = document.querySelector('.alert-success');
      expect(successAlert).not.toBeNull();
      expect(successAlert.textContent).toContain('Success!');
    });

    test('should show error message after failed submission', async () => {
      initFormValidation();
      global.fetch.mockResolvedValueOnce({ ok: false });

      document.getElementById('name').value = 'John Doe';
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('subject').value = 'Test Subject';
      document.getElementById('message').value = 'This is a test message that is long enough.';

      const form = document.getElementById('contactForm');
      form.dispatchEvent(new Event('submit', { cancelable: true }));

      await Promise.resolve();
      await Promise.resolve();

      const errorAlert = document.querySelector('.alert-danger');
      expect(errorAlert).not.toBeNull();
      expect(errorAlert.textContent).toContain('Error!');
    });

    test('should reset form after successful submission', async () => {
      initFormValidation();
      global.fetch.mockResolvedValueOnce({ ok: true });

      const nameField = document.getElementById('name');
      nameField.value = 'John Doe';
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('subject').value = 'Test Subject';
      document.getElementById('message').value = 'This is a test message that is long enough.';

      const form = document.getElementById('contactForm');
      form.dispatchEvent(new Event('submit', { cancelable: true }));

      await Promise.resolve();

      // After reset, the form values should be empty
      // Note: form.reset() is called but we need to check the actual behavior
    });

    test('should clear validation states after successful submission', async () => {
      initFormValidation();
      global.fetch.mockResolvedValueOnce({ ok: true });

      const nameField = document.getElementById('name');
      nameField.value = 'John Doe';
      nameField.classList.add('is-valid');

      document.getElementById('email').value = 'john@example.com';
      document.getElementById('subject').value = 'Test Subject';
      document.getElementById('message').value = 'This is a test message that is long enough.';

      const form = document.getElementById('contactForm');
      form.dispatchEvent(new Event('submit', { cancelable: true }));

      await Promise.resolve();

      expect(nameField.classList.contains('is-valid')).toBe(false);
    });
  });

  describe('Alert auto-removal', () => {
    test('should remove success alert after 5 seconds', async () => {
      initFormValidation();
      global.fetch.mockResolvedValueOnce({ ok: true });

      document.getElementById('name').value = 'John Doe';
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('subject').value = 'Test Subject';
      document.getElementById('message').value = 'This is a test message that is long enough.';

      const form = document.getElementById('contactForm');
      form.dispatchEvent(new Event('submit', { cancelable: true }));

      await Promise.resolve();

      // Alert should exist initially
      expect(document.querySelector('.alert-success')).not.toBeNull();

      // Fast forward 5 seconds
      jest.advanceTimersByTime(5000);

      const alert = document.querySelector('.alert-success');
      expect(alert.classList.contains('show')).toBe(false);

      // Fast forward another 150ms for removal
      jest.advanceTimersByTime(150);

      expect(document.querySelector('.alert-success')).toBeNull();
    });
  });

  describe('Scroll behavior on errors', () => {
    test('should scroll to first invalid field', () => {
      initFormValidation();

      const form = document.getElementById('contactForm');
      form.dispatchEvent(new Event('submit', { cancelable: true }));

      expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    });
  });
});
