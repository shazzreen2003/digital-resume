// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Contact Form Tests
 * Tests for form validation, submission, and error handling
 */

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pages/contact.html');
    await page.waitForSelector('#contactForm', { state: 'visible' });
  });

  test.describe('Form Elements', () => {
    test('form contains all required fields', async ({ page }) => {
      await expect(page.locator('#name')).toBeVisible();
      await expect(page.locator('#email')).toBeVisible();
      await expect(page.locator('#subject')).toBeVisible();
      await expect(page.locator('#message')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('fields have correct labels', async ({ page }) => {
      await expect(page.locator('label[for="name"]')).toContainText('Full Name');
      await expect(page.locator('label[for="email"]')).toContainText('Email Address');
      await expect(page.locator('label[for="subject"]')).toContainText('Subject');
      await expect(page.locator('label[for="message"]')).toContainText('Message');
    });

    test('fields have correct placeholders', async ({ page }) => {
      await expect(page.locator('#name')).toHaveAttribute('placeholder', 'Enter your full name');
      await expect(page.locator('#email')).toHaveAttribute('placeholder', 'your.email@example.com');
      await expect(page.locator('#subject')).toHaveAttribute('placeholder', 'What is this about?');
    });
  });

  test.describe('Empty Form Validation', () => {
    test('submitting empty form shows all errors', async ({ page }) => {
      // Submit empty form
      await page.click('button[type="submit"]');

      // Check for error states on all fields
      await expect(page.locator('#name')).toHaveClass(/is-invalid/);
      await expect(page.locator('#email')).toHaveClass(/is-invalid/);
      await expect(page.locator('#subject')).toHaveClass(/is-invalid/);
      await expect(page.locator('#message')).toHaveClass(/is-invalid/);
    });

    test('empty name field shows error message', async ({ page }) => {
      await page.click('button[type="submit"]');
      const errorMsg = page.locator('#name ~ .invalid-feedback');
      await expect(errorMsg).toContainText('Please enter your full name');
    });

    test('empty email field shows error message', async ({ page }) => {
      await page.click('button[type="submit"]');
      const errorMsg = page.locator('#email ~ .invalid-feedback');
      await expect(errorMsg).toContainText('Please enter your email address');
    });

    test('empty subject field shows error message', async ({ page }) => {
      await page.click('button[type="submit"]');
      const errorMsg = page.locator('#subject ~ .invalid-feedback');
      await expect(errorMsg).toContainText('Please enter a subject');
    });

    test('empty message field shows error message', async ({ page }) => {
      await page.click('button[type="submit"]');
      const errorMsg = page.locator('#message ~ .invalid-feedback');
      await expect(errorMsg).toContainText('Please enter your message');
    });
  });

  test.describe('Name Field Validation', () => {
    test('single character name shows error', async ({ page }) => {
      await page.fill('#name', 'A');
      await page.locator('#name').blur();

      await expect(page.locator('#name')).toHaveClass(/is-invalid/);
      const errorMsg = page.locator('#name ~ .invalid-feedback');
      await expect(errorMsg).toContainText('at least 2 characters');
    });

    test('numbers only name shows error', async ({ page }) => {
      await page.fill('#name', '12345');
      await page.locator('#name').blur();

      await expect(page.locator('#name')).toHaveClass(/is-invalid/);
      const errorMsg = page.locator('#name ~ .invalid-feedback');
      await expect(errorMsg).toContainText('valid name');
    });

    test('valid name shows success', async ({ page }) => {
      await page.fill('#name', 'John Doe');
      await page.locator('#name').blur();

      await expect(page.locator('#name')).toHaveClass(/is-valid/);
      await expect(page.locator('#name')).not.toHaveClass(/is-invalid/);
    });
  });

  test.describe('Email Field Validation', () => {
    test('invalid email format "notanemail" shows error', async ({ page }) => {
      await page.fill('#email', 'notanemail');
      await page.locator('#email').blur();

      await expect(page.locator('#email')).toHaveClass(/is-invalid/);
      const errorMsg = page.locator('#email ~ .invalid-feedback');
      await expect(errorMsg).toContainText('valid email');
    });

    test('invalid email format "test@" shows error', async ({ page }) => {
      await page.fill('#email', 'test@');
      await page.locator('#email').blur();

      await expect(page.locator('#email')).toHaveClass(/is-invalid/);
    });

    test('invalid email format "test@domain" shows error', async ({ page }) => {
      await page.fill('#email', 'test@domain');
      await page.locator('#email').blur();

      await expect(page.locator('#email')).toHaveClass(/is-invalid/);
    });

    test('valid email shows success', async ({ page }) => {
      await page.fill('#email', 'test@example.com');
      await page.locator('#email').blur();

      await expect(page.locator('#email')).toHaveClass(/is-valid/);
    });
  });

  test.describe('Subject Field Validation', () => {
    test('2 character subject shows error', async ({ page }) => {
      await page.fill('#subject', 'Hi');
      await page.locator('#subject').blur();

      await expect(page.locator('#subject')).toHaveClass(/is-invalid/);
      const errorMsg = page.locator('#subject ~ .invalid-feedback');
      await expect(errorMsg).toContainText('at least 3 characters');
    });

    test('valid subject shows success', async ({ page }) => {
      await page.fill('#subject', 'Design Inquiry');
      await page.locator('#subject').blur();

      await expect(page.locator('#subject')).toHaveClass(/is-valid/);
    });
  });

  test.describe('Message Field Validation', () => {
    test('short message (8 chars) shows error', async ({ page }) => {
      await page.fill('#message', 'Hi there');
      await page.locator('#message').blur();

      await expect(page.locator('#message')).toHaveClass(/is-invalid/);
      const errorMsg = page.locator('#message ~ .invalid-feedback');
      await expect(errorMsg).toContainText('at least 10 characters');
    });

    test('valid message shows success', async ({ page }) => {
      await page.fill('#message', 'This is a valid message with more than 10 characters.');
      await page.locator('#message').blur();

      await expect(page.locator('#message')).toHaveClass(/is-valid/);
    });
  });

  test.describe('Error Clearing', () => {
    test('error clears on focus', async ({ page }) => {
      // Submit to trigger error
      await page.click('button[type="submit"]');
      await expect(page.locator('#name')).toHaveClass(/is-invalid/);

      // Focus should clear error
      await page.locator('#name').focus();
      await expect(page.locator('#name')).not.toHaveClass(/is-invalid/);
      await expect(page.locator('#name')).not.toHaveClass(/is-valid/);
    });

    test('error clears when valid data entered', async ({ page }) => {
      // Submit to trigger error
      await page.click('button[type="submit"]');
      await expect(page.locator('#name')).toHaveClass(/is-invalid/);

      // Enter valid data
      await page.fill('#name', 'John Doe');
      await page.locator('#name').blur();

      await expect(page.locator('#name')).not.toHaveClass(/is-invalid/);
      await expect(page.locator('#name')).toHaveClass(/is-valid/);
    });
  });

  test.describe('Form Submission', () => {
    test('valid form submission shows success alert', async ({ page }) => {
      // Intercept Formspree API and return mock success
      await page.route('https://formspree.io/**', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true })
        });
      });

      // Fill form with valid data
      await page.fill('#name', 'John Doe');
      await page.fill('#email', 'test@example.com');
      await page.fill('#subject', 'Test Subject');
      await page.fill('#message', 'This is a test message for the contact form.');

      // Submit
      await page.click('button[type="submit"]');

      // Verify success alert
      await expect(page.locator('.alert-success')).toBeVisible();
      await expect(page.locator('.alert-success')).toContainText('Success');
    });

    test('form resets after successful submission', async ({ page }) => {
      // Intercept Formspree API
      await page.route('https://formspree.io/**', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true })
        });
      });

      // Fill and submit form
      await page.fill('#name', 'John Doe');
      await page.fill('#email', 'test@example.com');
      await page.fill('#subject', 'Test Subject');
      await page.fill('#message', 'This is a test message for the contact form.');
      await page.click('button[type="submit"]');

      // Wait for success
      await expect(page.locator('.alert-success')).toBeVisible();

      // Verify fields are cleared
      await expect(page.locator('#name')).toHaveValue('');
      await expect(page.locator('#email')).toHaveValue('');
      await expect(page.locator('#subject')).toHaveValue('');
      await expect(page.locator('#message')).toHaveValue('');
    });

    test('form submission failure shows error alert', async ({ page }) => {
      // Intercept Formspree API and return error
      await page.route('https://formspree.io/**', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Server error' })
        });
      });

      // Fill form with valid data
      await page.fill('#name', 'John Doe');
      await page.fill('#email', 'test@example.com');
      await page.fill('#subject', 'Test Subject');
      await page.fill('#message', 'This is a test message for the contact form.');

      // Submit
      await page.click('button[type="submit"]');

      // Verify error alert
      await expect(page.locator('.alert-danger')).toBeVisible();
      await expect(page.locator('.alert-danger')).toContainText('Error');
    });

    test('validation states clear after successful submission', async ({ page }) => {
      // Intercept Formspree API
      await page.route('https://formspree.io/**', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true })
        });
      });

      // Fill and submit form
      await page.fill('#name', 'John Doe');
      await page.fill('#email', 'test@example.com');
      await page.fill('#subject', 'Test Subject');
      await page.fill('#message', 'This is a test message for the contact form.');
      await page.click('button[type="submit"]');

      // Wait for success
      await expect(page.locator('.alert-success')).toBeVisible();

      // Verify validation states are cleared
      await expect(page.locator('#name')).not.toHaveClass(/is-valid/);
      await expect(page.locator('#name')).not.toHaveClass(/is-invalid/);
    });
  });

  test.describe('User Flow: Contact Form Submission', () => {
    test('complete contact form flow', async ({ page }) => {
      // Intercept Formspree API
      await page.route('https://formspree.io/**', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true })
        });
      });

      // Step 1: Try to submit empty form
      await page.click('button[type="submit"]');
      await expect(page.locator('.is-invalid')).toHaveCount(4);

      // Step 2: Fill name and blur
      await page.fill('#name', 'John Doe');
      await page.locator('#name').blur();
      await expect(page.locator('#name')).toHaveClass(/is-valid/);

      // Step 3: Fill email with invalid format
      await page.fill('#email', 'invalid');
      await page.locator('#email').blur();
      await expect(page.locator('#email')).toHaveClass(/is-invalid/);

      // Step 4: Fix email
      await page.fill('#email', 'john@example.com');
      await page.locator('#email').blur();
      await expect(page.locator('#email')).toHaveClass(/is-valid/);

      // Step 5: Fill subject and message
      await page.fill('#subject', 'Project Inquiry');
      await page.fill('#message', 'I would like to discuss a potential design project with you.');

      // Step 6: Submit form
      await page.click('button[type="submit"]');

      // Step 7: Verify success
      await expect(page.locator('.alert-success')).toBeVisible();
      await expect(page.locator('#name')).toHaveValue('');
    });
  });
});
