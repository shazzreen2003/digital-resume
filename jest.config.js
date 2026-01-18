/**
 * Jest Configuration for Resume Website
 * Two test environments: browser (jsdom) and node
 */

module.exports = {
  projects: [
    // Browser tests (DOM manipulation, UI interactions)
    {
      displayName: 'browser',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/tests/browser/**/*.test.js'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|webp|svg|pdf)$': '<rootDir>/tests/__mocks__/fileMock.js'
      },
      transform: {
        '^.+\\.js$': 'babel-jest'
      }
    },
    // Node tests (build system)
    {
      displayName: 'node',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/tests/node/**/*.test.js'],
      transform: {
        '^.+\\.js$': 'babel-jest'
      }
    }
  ],
  collectCoverageFrom: [
    'assets/js/**/*.js',
    '!assets/js/theme-init.js', // Initialization script, tested via ThemeManager
    '!**/node_modules/**',
    '!**/dist/**',
    '!build.js' // Build-time script, not runtime code
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true
};
