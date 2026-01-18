/**
 * Theme Initialization Script
 * Must be loaded in <head> before CSS to prevent flash of incorrect theme
 */
(function() {
  var stored = localStorage.getItem('theme-preference');
  var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = stored || (systemPrefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();
