/**
 * Global Test Setup
 * Sets up JSDOM environment and mocks for browser tests
 */

// Mock localStorage
let store = {};

global.localStorage = {
  getItem: jest.fn((key) => store[key] || null),
  setItem: jest.fn((key, value) => {
    store[key] = value.toString();
  }),
  clear: jest.fn(() => {
    store = {};
  }),
  removeItem: jest.fn((key) => {
    delete store[key];
  })
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});

// Mock Element.scrollIntoView (not implemented in JSDOM)
Element.prototype.scrollIntoView = jest.fn();

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
    this.observedElements = [];
  }

  observe(element) {
    this.observedElements.push(element);
  }

  unobserve(element) {
    this.observedElements = this.observedElements.filter(el => el !== element);
  }

  disconnect() {
    this.observedElements = [];
  }

  // Helper method for testing
  triggerIntersection(element, isIntersecting) {
    this.callback([{
      target: element,
      isIntersecting,
      intersectionRatio: isIntersecting ? 1 : 0
    }]);
  }
};

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    text: () => Promise.resolve('<div>Component</div>'),
    json: () => Promise.resolve({})
  })
);

// Set up minimal DOM to prevent components.js from failing on import
if (typeof document !== 'undefined') {
  document.body.innerHTML = `
    <div id="site-navigation"></div>
    <div id="site-footer"></div>
  `;
  // Set readyState to loading to prevent immediate init
  Object.defineProperty(document, 'readyState', {
    writable: true,
    value: 'loading'
  });
}

// Suppress console.log from source code during tests (keeps output clean)
// Comment out these lines if you need to debug
const originalConsoleLog = console.log;
console.log = jest.fn();

// Reset mocks before each test
beforeEach(() => {
  // Clear localStorage store and reset mocks
  store = {};

  // Re-create localStorage mock if it was replaced
  if (!localStorage.getItem || !localStorage.getItem.mockClear) {
    global.localStorage = {
      getItem: jest.fn((key) => store[key] || null),
      setItem: jest.fn((key, value) => {
        store[key] = value.toString();
      }),
      clear: jest.fn(() => {
        store = {};
      }),
      removeItem: jest.fn((key) => {
        delete store[key];
      })
    };
  } else {
    localStorage.getItem.mockClear();
    localStorage.setItem.mockClear();
    localStorage.clear.mockClear();
    localStorage.removeItem.mockClear();
  }

  // Reset fetch mock
  fetch.mockClear();
  fetch.mockImplementation(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      text: () => Promise.resolve('<div>Component</div>'),
      json: () => Promise.resolve({})
    })
  );

  // Reset window.matchMedia
  if (window.matchMedia && window.matchMedia.mockClear) {
    window.matchMedia.mockClear();
  }
});
