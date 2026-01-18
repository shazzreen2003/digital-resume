/**
 * Form Validation Tests
 * Tests for all validation functions and form submission handling
 */

const {
  validateName,
  validateEmail,
  validateSubject,
  validateMessage,
  showError,
  showSuccess,
  clearFieldError,
  handleFormSubmission,
  showSuccessMessage,
  showErrorMessage,
  initFormValidation
} = require('../../../assets/js/script');

describe('Form Validation', () => {
  let field;

  beforeEach(() => {
    // Create a basic field structure
    document.body.innerHTML = `
      <div class="form-group">
        <input type="text" id="testField" class="form-control" value="">
      </div>
    `;
    field = document.getElementById('testField');
  });

  describe('validateName', () => {
    test('should return false for empty name', () => {
      field.value = '';
      expect(validateName(field)).toBe(false);
      expect(field.classList.contains('is-invalid')).toBe(true);
    });

    test('should return false for name with only whitespace', () => {
      field.value = '   ';
      expect(validateName(field)).toBe(false);
    });

    test('should return false for name shorter than 2 characters', () => {
      field.value = 'A';
      expect(validateName(field)).toBe(false);
    });

    test('should return false for name without letters', () => {
      field.value = '123';
      expect(validateName(field)).toBe(false);
    });

    test('should return true for valid name', () => {
      field.value = 'John Doe';
      expect(validateName(field)).toBe(true);
      expect(field.classList.contains('is-valid')).toBe(true);
    });

    test('should return true for name with 2 characters', () => {
      field.value = 'Jo';
      expect(validateName(field)).toBe(true);
    });

    test('should accept names with numbers if they contain letters', () => {
      field.value = 'John3';
      expect(validateName(field)).toBe(true);
    });

    test('should display correct error message for empty name', () => {
      field.value = '';
      validateName(field);
      const feedback = document.querySelector('.invalid-feedback');
      expect(feedback.textContent).toBe('Please enter your full name');
    });

    test('should display correct error message for short name', () => {
      field.value = 'J';
      validateName(field);
      const feedback = document.querySelector('.invalid-feedback');
      expect(feedback.textContent).toBe('Name must be at least 2 characters long');
    });

    test('should display correct error message for name without letters', () => {
      field.value = '12345';
      validateName(field);
      const feedback = document.querySelector('.invalid-feedback');
      expect(feedback.textContent).toBe('Please enter a valid name');
    });
  });

  describe('validateEmail', () => {
    test('should return false for empty email', () => {
      field.value = '';
      expect(validateEmail(field)).toBe(false);
    });

    test('should return false for invalid email format', () => {
      field.value = 'notanemail';
      expect(validateEmail(field)).toBe(false);
    });

    test('should return false for email without @', () => {
      field.value = 'test.example.com';
      expect(validateEmail(field)).toBe(false);
    });

    test('should return false for email without domain', () => {
      field.value = 'test@';
      expect(validateEmail(field)).toBe(false);
    });

    test('should return false for email without TLD', () => {
      field.value = 'test@example';
      expect(validateEmail(field)).toBe(false);
    });

    test('should return true for valid email', () => {
      field.value = 'test@example.com';
      expect(validateEmail(field)).toBe(true);
    });

    test('should return true for email with subdomain', () => {
      field.value = 'test@mail.example.com';
      expect(validateEmail(field)).toBe(true);
    });

    test('should return true for email with plus sign', () => {
      field.value = 'test+tag@example.com';
      expect(validateEmail(field)).toBe(true);
    });

    test('should display correct error message for empty email', () => {
      field.value = '';
      validateEmail(field);
      const feedback = document.querySelector('.invalid-feedback');
      expect(feedback.textContent).toBe('Please enter your email address');
    });

    test('should display correct error message for invalid email', () => {
      field.value = 'invalid';
      validateEmail(field);
      const feedback = document.querySelector('.invalid-feedback');
      expect(feedback.textContent).toBe('Please enter a valid email address');
    });
  });

  describe('validateSubject', () => {
    test('should return false for empty subject', () => {
      field.value = '';
      expect(validateSubject(field)).toBe(false);
    });

    test('should return false for subject shorter than 3 characters', () => {
      field.value = 'Hi';
      expect(validateSubject(field)).toBe(false);
    });

    test('should return true for valid subject', () => {
      field.value = 'Hello there';
      expect(validateSubject(field)).toBe(true);
    });

    test('should return true for subject with exactly 3 characters', () => {
      field.value = 'Hey';
      expect(validateSubject(field)).toBe(true);
    });

    test('should display correct error message for empty subject', () => {
      field.value = '';
      validateSubject(field);
      const feedback = document.querySelector('.invalid-feedback');
      expect(feedback.textContent).toBe('Please enter a subject');
    });

    test('should display correct error message for short subject', () => {
      field.value = 'Hi';
      validateSubject(field);
      const feedback = document.querySelector('.invalid-feedback');
      expect(feedback.textContent).toBe('Subject must be at least 3 characters long');
    });
  });

  describe('validateMessage', () => {
    test('should return false for empty message', () => {
      field.value = '';
      expect(validateMessage(field)).toBe(false);
    });

    test('should return false for message shorter than 10 characters', () => {
      field.value = 'Hello';
      expect(validateMessage(field)).toBe(false);
    });

    test('should return true for valid message', () => {
      field.value = 'This is a valid message with enough characters.';
      expect(validateMessage(field)).toBe(true);
    });

    test('should return true for message with exactly 10 characters', () => {
      field.value = '1234567890';
      expect(validateMessage(field)).toBe(true);
    });

    test('should display correct error message for empty message', () => {
      field.value = '';
      validateMessage(field);
      const feedback = document.querySelector('.invalid-feedback');
      expect(feedback.textContent).toBe('Please enter your message');
    });

    test('should display correct error message for short message', () => {
      field.value = 'Short';
      validateMessage(field);
      const feedback = document.querySelector('.invalid-feedback');
      expect(feedback.textContent).toBe('Message must be at least 10 characters long');
    });
  });

  describe('showError', () => {
    test('should add is-invalid class to field', () => {
      showError(field, 'Test error');
      expect(field.classList.contains('is-invalid')).toBe(true);
    });

    test('should remove is-valid class if present', () => {
      field.classList.add('is-valid');
      showError(field, 'Test error');
      expect(field.classList.contains('is-valid')).toBe(false);
    });

    test('should create error feedback div', () => {
      showError(field, 'Test error message');
      const feedback = document.querySelector('.invalid-feedback');
      expect(feedback).not.toBeNull();
      expect(feedback.textContent).toBe('Test error message');
    });

    test('should replace existing error message', () => {
      showError(field, 'First error');
      showError(field, 'Second error');

      const feedbacks = document.querySelectorAll('.invalid-feedback');
      expect(feedbacks.length).toBe(1);
      expect(feedbacks[0].textContent).toBe('Second error');
    });
  });

  describe('showSuccess', () => {
    test('should add is-valid class to field', () => {
      showSuccess(field);
      expect(field.classList.contains('is-valid')).toBe(true);
    });

    test('should remove is-invalid class if present', () => {
      field.classList.add('is-invalid');
      showSuccess(field);
      expect(field.classList.contains('is-invalid')).toBe(false);
    });

    test('should remove existing error feedback', () => {
      showError(field, 'Error');
      showSuccess(field);
      const feedback = document.querySelector('.invalid-feedback');
      expect(feedback).toBeNull();
    });
  });

  describe('clearFieldError', () => {
    test('should remove is-invalid class', () => {
      field.classList.add('is-invalid');
      clearFieldError(field);
      expect(field.classList.contains('is-invalid')).toBe(false);
    });

    test('should remove is-valid class', () => {
      field.classList.add('is-valid');
      clearFieldError(field);
      expect(field.classList.contains('is-valid')).toBe(false);
    });

    test('should remove feedback element', () => {
      showError(field, 'Error');
      clearFieldError(field);
      const feedback = document.querySelector('.invalid-feedback');
      expect(feedback).toBeNull();
    });

    test('should handle field without feedback gracefully', () => {
      expect(() => clearFieldError(field)).not.toThrow();
    });
  });

  describe('showSuccessMessage', () => {
    let form;

    beforeEach(() => {
      jest.useFakeTimers();
      document.body.innerHTML = '<form id="testForm"></form>';
      form = document.getElementById('testForm');
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('should create success alert after form', () => {
      showSuccessMessage(form);

      const alert = document.querySelector('.alert-success');
      expect(alert).not.toBeNull();
      expect(alert.textContent).toContain('Success!');
    });

    test('should auto-remove alert after 5 seconds', () => {
      showSuccessMessage(form);

      jest.advanceTimersByTime(5000);

      const alert = document.querySelector('.alert-success');
      expect(alert.classList.contains('show')).toBe(false);

      jest.advanceTimersByTime(150);

      expect(document.querySelector('.alert-success')).toBeNull();
    });

    test('should scroll alert into view', () => {
      showSuccessMessage(form);

      expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    });
  });

  describe('showErrorMessage', () => {
    let form;

    beforeEach(() => {
      jest.useFakeTimers();
      document.body.innerHTML = '<form id="testForm"></form>';
      form = document.getElementById('testForm');
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('should create error alert after form', () => {
      showErrorMessage(form);

      const alert = document.querySelector('.alert-danger');
      expect(alert).not.toBeNull();
      expect(alert.textContent).toContain('Error!');
    });

    test('should auto-remove alert after 5 seconds', () => {
      showErrorMessage(form);

      jest.advanceTimersByTime(5000);

      const alert = document.querySelector('.alert-danger');
      expect(alert.classList.contains('show')).toBe(false);

      jest.advanceTimersByTime(150);

      expect(document.querySelector('.alert-danger')).toBeNull();
    });
  });

  describe('handleFormSubmission', () => {
    let form;

    beforeEach(() => {
      jest.useFakeTimers();
      document.body.innerHTML = `
        <form id="testForm" action="https://formspree.io/test">
          <input type="text" name="name" class="form-control" value="John Doe">
          <input type="email" name="email" class="form-control" value="john@example.com">
        </form>
      `;
      form = document.getElementById('testForm');
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('should call fetch with form action', async () => {
      global.fetch.mockResolvedValueOnce({ ok: true });

      handleFormSubmission(form);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://formspree.io/test',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Accept': 'application/json' }
        })
      );
    });

    test('should show success message on successful submission', async () => {
      global.fetch.mockResolvedValueOnce({ ok: true });

      handleFormSubmission(form);

      // Wait for promise to resolve
      await Promise.resolve();

      const alert = document.querySelector('.alert-success');
      expect(alert).not.toBeNull();
    });

    test('should reset form on successful submission', async () => {
      global.fetch.mockResolvedValueOnce({ ok: true });
      form.reset = jest.fn();

      handleFormSubmission(form);

      await Promise.resolve();

      expect(form.reset).toHaveBeenCalled();
    });

    test('should show error message on failed submission', async () => {
      global.fetch.mockResolvedValueOnce({ ok: false });

      handleFormSubmission(form);

      await Promise.resolve();
      await Promise.resolve(); // Need extra tick for catch

      const alert = document.querySelector('.alert-danger');
      expect(alert).not.toBeNull();
    });

    test('should show error message on network error', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      handleFormSubmission(form);

      await Promise.resolve();
      await Promise.resolve();

      const alert = document.querySelector('.alert-danger');
      expect(alert).not.toBeNull();
    });
  });

  describe('initFormValidation', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <form id="contactForm" action="https://formspree.io/test">
          <div class="form-group">
            <input type="text" id="name" class="form-control" value="">
          </div>
          <div class="form-group">
            <input type="email" id="email" class="form-control" value="">
          </div>
          <div class="form-group">
            <input type="text" id="subject" class="form-control" value="">
          </div>
          <div class="form-group">
            <textarea id="message" class="form-control"></textarea>
          </div>
          <button type="submit">Submit</button>
        </form>
      `;
    });

    test('should not throw if form does not exist', () => {
      document.body.innerHTML = '';
      expect(() => initFormValidation()).not.toThrow();
    });

    test('should validate name on blur', () => {
      initFormValidation();

      const nameField = document.getElementById('name');
      nameField.value = '';
      nameField.dispatchEvent(new Event('blur'));

      expect(nameField.classList.contains('is-invalid')).toBe(true);
    });

    test('should validate email on blur', () => {
      initFormValidation();

      const emailField = document.getElementById('email');
      emailField.value = 'invalid';
      emailField.dispatchEvent(new Event('blur'));

      expect(emailField.classList.contains('is-invalid')).toBe(true);
    });

    test('should clear error on focus', () => {
      initFormValidation();

      const nameField = document.getElementById('name');
      nameField.classList.add('is-invalid');
      nameField.dispatchEvent(new Event('focus'));

      expect(nameField.classList.contains('is-invalid')).toBe(false);
    });

    test('should prevent form submission with invalid fields', () => {
      initFormValidation();

      const form = document.getElementById('contactForm');
      const event = new Event('submit', { cancelable: true });
      event.preventDefault = jest.fn();

      form.dispatchEvent(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    test('should submit form when all fields are valid', () => {
      initFormValidation();

      document.getElementById('name').value = 'John Doe';
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('subject').value = 'Test Subject';
      document.getElementById('message').value = 'This is a test message with enough characters.';

      global.fetch.mockResolvedValueOnce({ ok: true });

      const form = document.getElementById('contactForm');
      const event = new Event('submit', { cancelable: true });
      form.dispatchEvent(event);

      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
