/**
 * Build Script for Resume Website
 * Compiles HTML components into final static files
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
  cssDir: path.join(__dirname, 'assets', 'css'),

  // CSS modules in concatenation order
  cssModules: [
    'variables.css',
    'base.css',
    'components.css',
    'layouts.css',
    'responsive.css'
  ],

  // Files/folders to copy as-is (not process)
  assetsToCopy: ['assets/images', 'assets/js', 'assets/pdf'],

  // HTML files to process (relative to srcDir)
  htmlFiles: [
    'index.html',
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

// Calculate path prefix based on file depth
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

// Process HTML file - inject components
function processHtml(filePath) {
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

  // Get data-page attribute to set active nav
  const dataPageMatch = html.match(/data-page="([^"]+)"/);
  const currentPage = dataPageMatch ? dataPageMatch[1] : '';

  // Set active class on correct nav item
  if (currentPage) {
    // Replace class="nav-link" with class="nav-link active" for the matching data-nav
    navigation = navigation.replace(
      new RegExp(`class="nav-link"(\\s+href="[^"]*"\\s+data-nav="${currentPage}")`),
      'class="nav-link active"$1'
    );
  }

  // Replace placeholder divs with actual components
  html = html.replace(/<div id="site-navigation"><\/div>/, navigation);
  html = html.replace(/<div id="site-footer"><\/div>/, footer);

  // Remove the components.js script (no longer needed)
  html = html.replace(/\s*<!-- Component Loader -->\s*\n\s*<script src="[^"]*components\.js"><\/script>/g, '');

  return html;
}

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

// Concatenate CSS modules into a single styles.css
function buildCss() {
  const cssOutputDir = path.join(CONFIG.distDir, 'assets', 'css');
  fs.mkdirSync(cssOutputDir, { recursive: true });

  const header = `/* ============================================
   RESUME WEBSITE - CUSTOM STYLES
   Author: Shazzreen Elyana
   Description: Custom styles for multi-page resume website
   Generated from modular CSS files by build.js
   ============================================ */

`;

  let combinedCss = header;

  for (const cssFile of CONFIG.cssModules) {
    const cssPath = path.join(CONFIG.cssDir, cssFile);

    if (!fs.existsSync(cssPath)) {
      console.error(`   CSS module not found: ${cssFile}`);
      continue;
    }

    const cssContent = fs.readFileSync(cssPath, 'utf8');
    combinedCss += cssContent + '\n\n';
    console.log(`   ✓ ${cssFile}`);
  }

  const outputPath = path.join(cssOutputDir, 'styles.css');
  fs.writeFileSync(outputPath, combinedCss, 'utf8');

  return combinedCss.length;
}

// Main build function
function build() {
  console.log('🔨 Building resume website...\n');

  // Clean dist folder
  console.log('📁 Cleaning dist folder...');
  cleanDist();

  // Process and write HTML files
  console.log('📄 Processing HTML files...');
  let processedCount = 0;

  for (const filePath of CONFIG.htmlFiles) {
    const html = processHtml(filePath);

    if (html) {
      const destPath = path.join(CONFIG.distDir, filePath);
      const destDir = path.dirname(destPath);

      fs.mkdirSync(destDir, { recursive: true });
      fs.writeFileSync(destPath, html, 'utf8');

      console.log(`   ✓ ${filePath}`);
      processedCount++;
    } else {
      console.log(`   ✗ ${filePath} (failed)`);
    }
  }

  // Build CSS from modules
  console.log('\n🎨 Building CSS from modules...');
  const cssSize = buildCss();
  console.log(`   Combined CSS: ${(cssSize / 1024).toFixed(1)} KB`);

  // Copy assets (excluding CSS which is built separately)
  console.log('\n📦 Copying assets...');
  for (const assetPath of CONFIG.assetsToCopy) {
    const srcPath = path.join(CONFIG.srcDir, assetPath);
    const destPath = path.join(CONFIG.distDir, assetPath);

    if (fs.existsSync(srcPath)) {
      copyDir(srcPath, destPath);
      console.log(`   ✓ ${assetPath}`);
    }
  }

  // Don't copy components.js to dist (not needed)
  const componentsJsPath = path.join(CONFIG.distDir, 'assets', 'js', 'components.js');
  if (fs.existsSync(componentsJsPath)) {
    fs.unlinkSync(componentsJsPath);
  }

  console.log(`\n✅ Build complete! ${processedCount} files processed.`);
  console.log(`📂 Output: ${CONFIG.distDir}`);
  console.log('\nTo preview: npx serve dist');
}

// Run build
build();
