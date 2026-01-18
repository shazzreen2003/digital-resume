/**
 * Build Script for Resume Website with i18n Support
 * Compiles HTML components into final static files for multiple languages
 *
 * Usage: node build.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  srcDir: __dirname,
  distDir: path.join(__dirname, 'dist'),
  componentsDir: path.join(__dirname, 'assets', 'components'),
  localesDir: path.join(__dirname, 'locales'),
  cssDir: path.join(__dirname, 'assets', 'css'),

  // Supported languages
  languages: ['en', 'ms'],
  defaultLanguage: 'en',

  // CSS files to concatenate (in order)
  cssOrder: [
    'variables.css',
    'base.css',
    'components.css',
    'layouts.css',
    'responsive.css',
    'dark-mode.css'
  ],

  // Files/folders to copy as-is (not process)
  assetsToCopy: ['assets/images', 'assets/js', 'assets/pdf'],

  // HTML files to process (relative to srcDir)
  htmlFiles: [
    'pages/about.html',
    'pages/skills.html',
    'pages/contact.html',
    'pages/portfolio/bestwork.html',
    'pages/portfolio/projects.html',
    // Best Work pages
    'pages/portfolio/bestwork/freelance.html',
    'pages/portfolio/bestwork/jxtravel.html',
    'pages/portfolio/bestwork/pearliewhite.html',
    'pages/portfolio/bestwork/rimbrew.html',
    'pages/portfolio/bestwork/careerbuddy.html',
    // Projects pages
    'pages/portfolio/projects/advertising.html',
    'pages/portfolio/projects/3d.html',
    'pages/portfolio/projects/illustration.html',
    'pages/portfolio/projects/branding.html',
    'pages/portfolio/projects/socialmedia.html',
    'pages/portfolio/projects/packaging.html'
  ]
};

// ============================================
// Translation Functions
// ============================================

// Load translation file for a language
function loadTranslations(lang) {
  const filePath = path.join(CONFIG.localesDir, `${lang}.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`Translation file not found: ${filePath}`);
    return {};
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Get nested translation value by dot notation key
function getTranslation(translations, key) {
  const keys = key.split('.');
  let value = translations;
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`  Warning: Translation key not found: ${key}`);
      return `[MISSING: ${key}]`;
    }
  }
  return value;
}

// Replace all {{t:key}} placeholders with translations
function applyTranslations(html, translations) {
  return html.replace(/\{\{t:([^}]+)\}\}/g, (match, key) => {
    return getTranslation(translations, key);
  });
}

// ============================================
// Language Switcher & SEO
// ============================================

// Generate language switcher HTML
function generateLangSwitcher(currentLang, filePath) {
  const translations = loadTranslations(currentLang);
  const otherLangCode = translations.meta.otherLangCode;
  const otherLangName = translations.meta.otherLangName;

  // Flag emojis
  const flagEmoji = {
    en: '🇬🇧',
    ms: '🇲🇾'
  };

  // Calculate path to other language version
  // From /en/pages/about.html to /ms/pages/about.html
  const depth = filePath.split('/').length;
  const toRoot = '../'.repeat(depth);
  const otherLangPath = `${toRoot}${otherLangCode}/${filePath}`;

  return `
        <li class="nav-item ms-lg-2">
          <a class="nav-link lang-switch" href="${otherLangPath}"
             title="${otherLangName}"
             aria-label="Switch to ${otherLangName}">
            <span class="lang-flag">${flagEmoji[otherLangCode]}</span>
            <span class="d-lg-none ms-2">${otherLangName}</span>
          </a>
        </li>`;
}

// Generate hreflang tags for SEO
function generateHreflangTags(filePath) {
  const tags = [];
  for (const lang of CONFIG.languages) {
    tags.push(`<link rel="alternate" hreflang="${lang}" href="/${lang}/${filePath}">`);
  }
  // x-default points to default language
  tags.push(`<link rel="alternate" hreflang="x-default" href="/${CONFIG.defaultLanguage}/${filePath}">`);
  return tags.join('\n  ');
}

// ============================================
// Path & Component Functions
// ============================================

// Calculate path prefix based on file depth within language folder
// Files are at dist/{lang}/pages/... so we need to account for that
function getPathPrefix(filePath) {
  const depth = filePath.split('/').length - 1;
  if (depth === 0) return '';
  return '../'.repeat(depth);
}

// Read component file
function readComponent(name) {
  const componentPath = path.join(CONFIG.componentsDir, `${name}.html`);
  if (!fs.existsSync(componentPath)) {
    console.error(`Component not found: ${componentPath}`);
    return '';
  }
  return fs.readFileSync(componentPath, 'utf8');
}

// Flash prevention script for dark/light mode
const THEME_FLASH_PREVENTION_SCRIPT = `<script>
  (function() {
    var stored = localStorage.getItem('theme-preference');
    var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (systemPrefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  })();
</script>`;

// Language preference script - saves current language to localStorage
const LANG_PREFERENCE_SCRIPT = `<script>
  (function() {
    // Detect current language from URL path
    var path = window.location.pathname;
    var lang = path.match(/\\/(en|ms)\\//);
    if (lang) {
      localStorage.setItem('lang-preference', lang[1]);
    }
  })();
</script>`;

// ============================================
// HTML Processing
// ============================================

// Process HTML file with language support
function processHtmlWithLang(filePath, lang, translations) {
  const fullPath = path.join(CONFIG.srcDir, filePath);

  if (!fs.existsSync(fullPath)) {
    console.error(`File not found: ${fullPath}`);
    return null;
  }

  let html = fs.readFileSync(fullPath, 'utf8');
  const pathPrefix = getPathPrefix(filePath);

  // Read components
  let navigation = readComponent('navigation');
  let footer = readComponent('footer');

  // Replace {{PATH}} placeholders in components
  navigation = navigation.replace(/\{\{PATH\}\}/g, pathPrefix);
  footer = footer.replace(/\{\{PATH\}\}/g, pathPrefix);

  // Generate and inject language switcher
  const langSwitcher = generateLangSwitcher(lang, filePath);
  navigation = navigation.replace(/\{\{LANG_SWITCHER\}\}/g, langSwitcher);

  // Apply translations to components
  navigation = applyTranslations(navigation, translations);
  footer = applyTranslations(footer, translations);

  // Get data-page attribute to set active nav
  const dataPageMatch = html.match(/data-page="([^"]+)"/);
  const currentPage = dataPageMatch ? dataPageMatch[1] : '';

  // Set active class on correct nav item
  if (currentPage) {
    navigation = navigation.replace(
      new RegExp(`class="nav-link"(\\s+href="[^"]*"\\s+data-nav="${currentPage}")`),
      'class="nav-link active"$1'
    );
  }

  // Replace placeholder divs with actual components
  html = html.replace(/<div id="site-navigation"><\/div>/, navigation);
  html = html.replace(/<div id="site-footer"><\/div>/, footer);

  // Replace language placeholder
  html = html.replace(/\{\{LANG\}\}/g, lang);
  html = html.replace(/lang="en"/g, `lang="${lang}"`);

  // Generate and inject hreflang tags
  const hreflangTags = generateHreflangTags(filePath);
  html = html.replace(/\{\{HREFLANG_TAGS\}\}/g, hreflangTags);

  // Apply translations to page content
  html = applyTranslations(html, translations);

  // Remove the components.js script (no longer needed)
  html = html.replace(/\s*<!-- Component Loader -->\s*\n\s*<script src="[^"]*components\.js"><\/script>/g, '');

  // Inject flash prevention script
  html = html.replace(
    /\s*<!-- Theme Flash Prevention.*?-->\s*\n\s*<script src="[^"]*theme-init\.js"><\/script>/,
    '\n  ' + THEME_FLASH_PREVENTION_SCRIPT
  );

  return html;
}

// ============================================
// File System Operations
// ============================================

// Copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`Source directory not found: ${src}`);
    return;
  }

  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Clean dist directory
function cleanDist() {
  if (fs.existsSync(CONFIG.distDir)) {
    fs.rmSync(CONFIG.distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(CONFIG.distDir, { recursive: true });
}

// Concatenate CSS files in order for production
function concatenateCss() {
  let combinedCss = '';

  for (const cssFile of CONFIG.cssOrder) {
    const cssPath = path.join(CONFIG.cssDir, cssFile);
    if (fs.existsSync(cssPath)) {
      const content = fs.readFileSync(cssPath, 'utf8');
      combinedCss += `/* === ${cssFile} === */\n${content}\n\n`;
    } else {
      console.warn(`  Warning: CSS file not found: ${cssFile}`);
    }
  }

  return combinedCss;
}

// Generate root index.html with redirect to English
function generateRootIndex() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=en/pages/about.html">
  <title>Redirecting... - Shazzreen Elyana</title>
  <link rel="canonical" href="en/pages/about.html">
  <link rel="alternate" hreflang="en" href="/en/pages/about.html">
  <link rel="alternate" hreflang="ms" href="/ms/pages/about.html">
  <link rel="alternate" hreflang="x-default" href="/en/pages/about.html">
</head>
<body>
  <p>Redirecting to <a href="en/pages/about.html">portfolio</a>...</p>
</body>
</html>`;

  fs.writeFileSync(path.join(CONFIG.distDir, 'index.html'), html, 'utf8');
}

// Generate language-specific index.html that redirects to about page
function generateLangIndex(lang) {
  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=pages/about.html">
  <title>Redirecting... - Shazzreen Elyana</title>
  <link rel="canonical" href="pages/about.html">
</head>
<body>
  <p>Redirecting to <a href="pages/about.html">portfolio</a>...</p>
</body>
</html>`;

  fs.writeFileSync(path.join(CONFIG.distDir, lang, 'index.html'), html, 'utf8');
}

// ============================================
// Main Build Function
// ============================================

function build() {
  console.log('Building resume website with i18n support...\n');

  // Clean dist folder
  console.log('Cleaning dist folder...');
  cleanDist();

  // Load all translations
  const translations = {};
  for (const lang of CONFIG.languages) {
    translations[lang] = loadTranslations(lang);
    console.log(`Loaded translations for: ${lang}`);
  }

  // Process HTML files for each language
  console.log('\nProcessing HTML files...');
  let processedCount = 0;

  for (const lang of CONFIG.languages) {
    console.log(`\n[${lang.toUpperCase()}] Processing...`);

    for (const filePath of CONFIG.htmlFiles) {
      const html = processHtmlWithLang(filePath, lang, translations[lang]);

      if (html) {
        // Output to dist/{lang}/path/file.html
        const destPath = path.join(CONFIG.distDir, lang, filePath);
        const destDir = path.dirname(destPath);

        fs.mkdirSync(destDir, { recursive: true });
        fs.writeFileSync(destPath, html, 'utf8');

        console.log(`   ${filePath}`);
        processedCount++;
      } else {
        console.log(`   ${filePath} (failed)`);
      }
    }

    // Generate language-specific index.html
    generateLangIndex(lang);
    console.log(`   index.html (redirect)`);
  }

  // Generate root index.html
  generateRootIndex();
  console.log('\nGenerated root index.html (redirect to English)');

  // Concatenate CSS files
  console.log('\nConcatenating CSS files...');
  const combinedCss = concatenateCss();
  console.log(`   Combined ${CONFIG.cssOrder.length} CSS files`);

  // Copy assets to each language folder
  console.log('\nCopying assets...');
  for (const lang of CONFIG.languages) {
    for (const assetPath of CONFIG.assetsToCopy) {
      const srcPath = path.join(CONFIG.srcDir, assetPath);
      const destPath = path.join(CONFIG.distDir, lang, assetPath);

      if (fs.existsSync(srcPath)) {
        copyDir(srcPath, destPath);
      }
    }

    // Write combined CSS to dist/{lang}/assets/css/main.css
    const cssDestDir = path.join(CONFIG.distDir, lang, 'assets', 'css');
    fs.mkdirSync(cssDestDir, { recursive: true });
    fs.writeFileSync(path.join(cssDestDir, 'main.css'), combinedCss, 'utf8');

    console.log(`   Assets copied to dist/${lang}/`);

    // Remove components.js from dist (not needed)
    const componentsJsPath = path.join(CONFIG.distDir, lang, 'assets', 'js', 'components.js');
    if (fs.existsSync(componentsJsPath)) {
      fs.unlinkSync(componentsJsPath);
    }
  }

  console.log(`\nBuild complete! ${processedCount} files processed.`);
  console.log(`Output: ${CONFIG.distDir}`);
  console.log('\nStructure:');
  console.log('  dist/');
  console.log('  ├── index.html (redirect to English)');
  console.log('  ├── en/');
  console.log('  │   ├── index.html (redirect to about)');
  console.log('  │   ├── pages/about.html');
  console.log('  │   ├── pages/skills.html');
  console.log('  │   └── ...');
  console.log('  └── ms/');
  console.log('      ├── index.html (redirect to about)');
  console.log('      ├── pages/about.html');
  console.log('      └── ...');
  console.log('\nTo preview: npx serve dist');
}

// Module exports for testing
module.exports = {
  CONFIG,
  loadTranslations,
  getTranslation,
  applyTranslations,
  generateLangSwitcher,
  generateHreflangTags,
  getPathPrefix,
  readComponent,
  processHtmlWithLang,
  copyDir,
  cleanDist,
  concatenateCss,
  build,
  THEME_FLASH_PREVENTION_SCRIPT
};

// Run build only when called directly
if (require.main === module) {
  build();
}
