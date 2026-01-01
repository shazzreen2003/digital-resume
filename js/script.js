/* ============================================
   RESUME WEBSITE - JAVASCRIPT
   Author: Shazzreen Elyana
   Description: Form validation and interactive features
   ============================================ */

// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {

  // Initialize all features
  initNavigation();
  initFormValidation();
  initScrollAnimations();

});

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
  // Highlight active page in navigation
  highlightActivePage();

  // Close mobile menu when clicking a link
  const navLinks = document.querySelectorAll('.nav-link');
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.querySelector('.navbar-collapse');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse.classList.contains('show')) {
        navbarToggler.click();
      }
    });
  });
}

/**
 * Highlight the active page in navigation menu
 */
function highlightActivePage() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');

    // Check if current page matches link
    if (linkPage === currentPage ||
        (currentPage === '' && linkPage === 'index.html') ||
        (currentPage === 'index.html' && linkPage === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ============================================
   FORM VALIDATION
   ============================================ */
function initFormValidation() {
  const contactForm = document.getElementById('contactForm');

  if (!contactForm) return; // Exit if form doesn't exist on current page

  // Get form fields
  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');
  const subjectField = document.getElementById('subject');
  const messageField = document.getElementById('message');

  // Real-time validation on input
  nameField.addEventListener('blur', () => validateName(nameField));
  emailField.addEventListener('blur', () => validateEmail(emailField));
  subjectField.addEventListener('blur', () => validateSubject(subjectField));
  messageField.addEventListener('blur', () => validateMessage(messageField));

  // Remove error styling on focus
  [nameField, emailField, subjectField, messageField].forEach(field => {
    field.addEventListener('focus', () => {
      clearFieldError(field);
    });
  });

  // Form submission handler
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validate all fields
    const isNameValid = validateName(nameField);
    const isEmailValid = validateEmail(emailField);
    const isSubjectValid = validateSubject(subjectField);
    const isMessageValid = validateMessage(messageField);

    // Check if all fields are valid
    if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
      handleFormSubmission(contactForm);
    } else {
      // Scroll to first error
      const firstError = contactForm.querySelector('.is-invalid');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
}

/**
 * Validate name field
 */
function validateName(field) {
  const value = field.value.trim();

  if (value === '') {
    showError(field, 'Please enter your full name');
    return false;
  }

  if (value.length < 2) {
    showError(field, 'Name must be at least 2 characters long');
    return false;
  }

  // Check if name contains at least one letter
  if (!/[a-zA-Z]/.test(value)) {
    showError(field, 'Please enter a valid name');
    return false;
  }

  showSuccess(field);
  return true;
}

/**
 * Validate email field
 */
function validateEmail(field) {
  const value = field.value.trim();

  if (value === '') {
    showError(field, 'Please enter your email address');
    return false;
  }

  // Email regex pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(value)) {
    showError(field, 'Please enter a valid email address');
    return false;
  }

  showSuccess(field);
  return true;
}

/**
 * Validate subject field
 */
function validateSubject(field) {
  const value = field.value.trim();

  if (value === '') {
    showError(field, 'Please enter a subject');
    return false;
  }

  if (value.length < 3) {
    showError(field, 'Subject must be at least 3 characters long');
    return false;
  }

  showSuccess(field);
  return true;
}

/**
 * Validate message field
 */
function validateMessage(field) {
  const value = field.value.trim();

  if (value === '') {
    showError(field, 'Please enter your message');
    return false;
  }

  if (value.length < 10) {
    showError(field, 'Message must be at least 10 characters long');
    return false;
  }

  showSuccess(field);
  return true;
}

/**
 * Show error message for a field
 */
function showError(field, message) {
  // Remove any existing feedback
  clearFieldError(field);

  // Add invalid class
  field.classList.add('is-invalid');
  field.classList.remove('is-valid');

  // Create and append error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'invalid-feedback';
  errorDiv.textContent = message;
  field.parentElement.appendChild(errorDiv);
}

/**
 * Show success state for a field
 */
function showSuccess(field) {
  // Remove any existing feedback
  clearFieldError(field);

  // Add valid class
  field.classList.add('is-valid');
  field.classList.remove('is-invalid');
}

/**
 * Clear error state from a field
 */
function clearFieldError(field) {
  field.classList.remove('is-invalid', 'is-valid');

  // Remove any existing feedback messages
  const feedback = field.parentElement.querySelector('.invalid-feedback, .valid-feedback');
  if (feedback) {
    feedback.remove();
  }
}

/**
 * Handle successful form submission
 */
function handleFormSubmission(form) {
  // Get form data
  const formData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    subject: form.subject.value.trim(),
    message: form.message.value.trim()
  };

  // Log form data (for development/testing)
  console.log('Form submitted successfully:', formData);

  // Show success message
  showSuccessMessage(form);

  // Reset form
  form.reset();

  // Clear all validation states
  const fields = form.querySelectorAll('.form-control');
  fields.forEach(field => clearFieldError(field));

  // Note: In production, you would send this data to a backend service
  // Example with Formspree:
  // fetch('https://formspree.io/f/YOUR_FORM_ID', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(formData)
  // });
}

/**
 * Display success message after form submission
 */
function showSuccessMessage(form) {
  // Create success alert
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert alert-success alert-dismissible fade show mt-3';
  alertDiv.setAttribute('role', 'alert');
  alertDiv.innerHTML = `
    <strong>Success!</strong> Your message has been sent. I'll get back to you soon!
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  // Insert alert after form
  form.insertAdjacentElement('afterend', alertDiv);

  // Auto-remove alert after 5 seconds
  setTimeout(() => {
    alertDiv.classList.remove('show');
    setTimeout(() => alertDiv.remove(), 150);
  }, 5000);

  // Scroll to success message
  alertDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ============================================
   SCROLL ANIMATIONS (OPTIONAL)
   ============================================ */
function initScrollAnimations() {
  // Get all elements with animation class
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (animatedElements.length === 0) return; // Exit if no elements to animate

  // Create intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe all animated elements
  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/**
 * Smooth scroll to element
 * Usage: scrollToElement('#section-id')
 */
function scrollToElement(selector) {
  const element = document.querySelector(selector);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Debounce function to limit function calls
 * Useful for scroll and resize event handlers
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
