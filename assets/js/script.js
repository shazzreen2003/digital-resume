/* ============================================
   RESUME WEBSITE - JAVASCRIPT
   Author: Shazzreen Elyana
   Description: Form validation and interactive features
   ============================================ */

/* ============================================
   THEME MANAGEMENT
   ============================================ */
const ThemeManager = {
  STORAGE_KEY: 'theme-preference',

  init() {
    // Get stored preference or detect system preference
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Apply theme: stored preference > system preference > light
    const theme = stored || (systemPrefersDark ? 'dark' : 'light');
    this.setTheme(theme);

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });

    // Set up toggle button after components load
    document.addEventListener('componentsLoaded', () => this.setupToggle());
    // Fallback for production (components already inlined)
    if (document.getElementById('theme-toggle')) {
      this.setupToggle();
    }
  },

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.updateIcon(theme);
  },

  updateIcon(theme) {
    const icon = document.getElementById('theme-icon');
    if (icon) {
      icon.className = theme === 'dark' ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
    }
  },

  setupToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        this.setTheme(next);
        localStorage.setItem(this.STORAGE_KEY, next);
      });
      // Update icon to match current theme
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      this.updateIcon(current);
    }
  }
};

// Initialize theme immediately to prevent flash
ThemeManager.init();

// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {

  // Initialize all features
  initNavigation();
  initFormValidation();
  initScrollAnimations();

  // Re-setup theme toggle in case it wasn't ready before
  ThemeManager.setupToggle();
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

  if (navbarCollapse && navbarToggler) {
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navbarCollapse.classList.contains('show')) {
          navbarToggler.click();
        }
      });
    });
  }

  // Mobile dropdown toggle
  initMobileDropdowns();
}

/**
 * Initialize mobile dropdown functionality
 */
function initMobileDropdowns() {
  const dropdownItems = document.querySelectorAll('.nav-item.dropdown');

  dropdownItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    const arrow = item.querySelector('.dropdown-arrow');

    if (arrow && window.innerWidth < 992) {
      // On mobile, clicking the arrow toggles dropdown
      arrow.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        item.classList.toggle('show');
      });
    }
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992) {
      // Remove show class on desktop
      dropdownItems.forEach(item => item.classList.remove('show'));
    }
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
  const formData = new FormData(form);

  // Send to Formspree
  fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      // Show success message
      showSuccessMessage(form);
      // Reset form
      form.reset();
      // Clear all validation states
      const fields = form.querySelectorAll('.form-control');
      fields.forEach(field => clearFieldError(field));
    } else {
      throw new Error('Form submission failed');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showErrorMessage(form);
  });
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

/**
 * Display error message if form submission fails
 */
function showErrorMessage(form) {
  // Create error alert
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert alert-danger alert-dismissible fade show mt-3';
  alertDiv.setAttribute('role', 'alert');
  alertDiv.innerHTML = `
    <strong>Error!</strong> Something went wrong. Please try again or contact me directly via email.
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  // Insert alert after form
  form.insertAdjacentElement('afterend', alertDiv);

  // Auto-remove alert after 5 seconds
  setTimeout(() => {
    alertDiv.classList.remove('show');
    setTimeout(() => alertDiv.remove(), 150);
  }, 5000);
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

/* ============================================
   MODULE EXPORTS (for testing)
   ============================================ */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ThemeManager,
    initNavigation,
    initMobileDropdowns,
    highlightActivePage,
    initFormValidation,
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
    initScrollAnimations,
    scrollToElement,
    debounce
  };
}
