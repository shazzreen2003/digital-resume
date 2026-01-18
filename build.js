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

  // Files/folders to copy as-is (not process)
  assetsToCopy: ['assets/css', 'assets/images', 'assets/js', 'assets/pdf'],

  // HTML files to process (relative to srcDir)
  htmlFiles: [
    'index.html',
    'pages/about.html',
    'pages/skills.html',
    'pages/contact.html',
    'pages/portfolio/bestwork.html',
    'pages/portfolio/projects.html',
    'pages/portfolio/branding/index.html',
    'pages/portfolio/branding/pearliewhite.html',
    'pages/portfolio/branding/rimbrew.html',
    'pages/portfolio/freelance/index.html',
    'pages/portfolio/uiux/careerbuddy.html',
    'pages/portfolio/uiux/jxtravel.html',
    'pages/portfolio/print/advertising.html',
    'pages/portfolio/print/packaging.html',
    'pages/portfolio/digital/3d.html',
    'pages/portfolio/digital/illustration.html',
    'pages/portfolio/digital/socialmedia.html'
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

  // Copy assets
  console.log('\n📦 Copying assets...');
  for (const assetPath of CONFIG.assetsToCopy) {
    const srcPath = path.join(CONFIG.srcDir, assetPath);
    const destPath = path.join(CONFIG.distDir, assetPath);

    // Skip components folder - not needed in dist
    if (assetPath === 'assets/components') continue;

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
