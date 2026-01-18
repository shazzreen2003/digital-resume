/**
 * Component Loader for Resume Website
 * Dynamically loads navigation and footer components with correct path resolution
 */

(function(exports) {
  'use strict';

  // Get the base path by finding this script's location
  function getBasePath() {
    // Find the script element for components.js
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
      const src = scripts[i].src;
      if (src && src.includes('components.js')) {
        // Remove 'assets/js/components.js' from the path to get base
        const basePath = src.replace(/assets\/js\/components\.js.*$/, '');
        return basePath;
      }
    }

    // Fallback: try to determine from current location
    return getPathPrefixFromLocation();
  }

  // Fallback path detection from window.location
  function getPathPrefixFromLocation() {
    const path = window.location.pathname;

    // Check if we're in pages/portfolio/ subdirectory
    if (path.includes('/pages/portfolio/')) {
      // Check depth: /pages/portfolio/branding/file.html = ../../../
      // /pages/portfolio/file.html = ../../
      const afterPortfolio = path.split('/pages/portfolio/')[1];
      if (afterPortfolio && afterPortfolio.includes('/')) {
        return '../../../';
      }
      return '../../';
    }

    // Check if we're in the pages/ subdirectory (but not portfolio)
    if (path.includes('/pages/')) {
      return '../';
    }

    return '';
  }

  // Load a component and insert it into the page
  async function loadComponent(containerId, componentUrl, basePath) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Container #${containerId} not found`);
      return false;
    }

    try {
      const fullUrl = basePath + componentUrl;
      console.log(`Loading component from: ${fullUrl}`);

      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      let html = await response.text();

      // Replace {{PATH}} placeholders with the base path
      html = html.replace(/\{\{PATH\}\}/g, basePath);

      container.innerHTML = html;
      return true;
    } catch (error) {
      console.error(`Error loading component ${componentUrl}:`, error);

      // Show helpful error message
      container.innerHTML = `
        <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; margin: 10px; border-radius: 5px;">
          <strong>Component failed to load</strong><br>
          <small>If you're opening this file directly, please use a local server like VS Code Live Server.</small>
        </div>
      `;
      return false;
    }
  }

  // Set active navigation state based on data-page attribute
  function setActiveNav() {
    const currentPage = document.body.getAttribute('data-page');
    console.log('setActiveNav - currentPage:', currentPage);
    if (!currentPage) return;

    const navLinks = document.querySelectorAll('[data-nav]');
    console.log('setActiveNav - found navLinks:', navLinks.length);
    navLinks.forEach(link => {
      const navValue = link.getAttribute('data-nav');
      if (navValue === currentPage) {
        console.log('setActiveNav - activating:', navValue);
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Initialize components
  async function init() {
    const basePath = getBasePath();
    console.log(`Components base path: ${basePath}`);

    // Load navigation and footer in parallel
    const [navLoaded, footerLoaded] = await Promise.all([
      loadComponent('site-navigation', 'assets/components/navigation.html', basePath),
      loadComponent('site-footer', 'assets/components/footer.html', basePath)
    ]);

    // Set active navigation state after nav is loaded
    if (navLoaded) {
      setActiveNav();
    }

    // Dispatch event to notify that components are loaded
    document.dispatchEvent(new CustomEvent('componentsLoaded'));
  }

  // Run when DOM is ready (only in browser)
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  // Export functions for testing
  if (exports) {
    exports.getBasePath = getBasePath;
    exports.getPathPrefixFromLocation = getPathPrefixFromLocation;
    exports.loadComponent = loadComponent;
    exports.setActiveNav = setActiveNav;
    exports.init = init;
  }
})(typeof module !== 'undefined' && module.exports ? module.exports : null);
