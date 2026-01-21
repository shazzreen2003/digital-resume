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

// Page-specific metadata for SEO
const PAGE_METADATA = {
  'index.html': {
    title: 'Shazzreen Elyana - Graphic Designer Portfolio',
    description: 'Creative graphic designer specializing in branding, UI/UX design, print design, and digital graphics. View my portfolio and get in touch.',
    ogType: 'website',
    image: '/assets/images/common/profile-photo.png',
    structuredDataType: 'WebSite'
  },
  'pages/about.html': {
    title: 'About Me - Shazzreen Elyana | Graphic Designer',
    description: 'Passionate graphic designer creating meaningful visual experiences. Currently pursuing Bachelor\'s degree in Graphic Design at UiTM.',
    ogType: 'profile',
    image: '/assets/images/common/profile-photo.png',
    structuredDataType: 'Person'
  },
  'pages/skills.html': {
    title: 'My Skills - Shazzreen Elyana | Graphic Design & UI/UX',
    description: 'Expertise in Adobe Creative Suite, Figma, branding, UI/UX design, print design, and digital graphics.',
    ogType: 'website',
    image: '/assets/images/common/profile-photo.png',
    structuredDataType: 'WebSite'
  },
  'pages/contact.html': {
    title: 'Contact Me - Shazzreen Elyana | Let\'s Work Together',
    description: 'Get in touch for graphic design projects. Available for freelance work and collaborations.',
    ogType: 'website',
    image: '/assets/images/common/profile-photo.png',
    structuredDataType: 'WebSite'
  },
  'pages/portfolio/bestwork.html': {
    title: 'Best Work - Shazzreen Elyana | Featured Design Projects',
    description: 'Curated selection of top graphic design projects including branding, UI/UX, and print design.',
    ogType: 'website',
    image: '/assets/images/common/profile-photo.png',
    structuredDataType: 'WebSite'
  },
  'pages/portfolio/projects.html': {
    title: 'All Projects - Shazzreen Elyana | Design Portfolio',
    description: 'Browse all design projects including advertising, 3D, illustration, branding, social media, and packaging.',
    ogType: 'website',
    image: '/assets/images/common/profile-photo.png',
    structuredDataType: 'WebSite'
  },
  'pages/portfolio/bestwork/freelance.html': {
    title: 'Freelance Graphics - Shazzreen Elyana',
    description: 'Collection of freelance graphic design work showcasing diverse visual communication projects.',
    ogType: 'article',
    image: '/assets/images/thumbnails/freelance-thumb.jpg',
    structuredDataType: 'CreativeWork',
    projectData: {
      name: 'Freelance Graphics',
      dateCreated: '2024',
      keywords: ['Graphic Design', 'Freelance', 'Visual Communication']
    }
  },
  'pages/portfolio/bestwork/jxtravel.html': {
    title: 'JX Travel Website Design - Shazzreen Elyana',
    description: 'Modern travel website design featuring intuitive navigation and engaging visual storytelling for JX Travel.',
    ogType: 'article',
    image: '/assets/images/thumbnails/jxtravel-thumb.jpg',
    structuredDataType: 'CreativeWork',
    projectData: {
      name: 'JX Travel Website Design',
      dateCreated: '2024',
      keywords: ['Web Design', 'UI/UX', 'Travel', 'Figma']
    }
  },
  'pages/portfolio/bestwork/pearliewhite.html': {
    title: 'Pearlie White Branding - Shazzreen Elyana',
    description: 'Complete branding project for Pearlie White featuring logo design, brand identity, and visual guidelines.',
    ogType: 'article',
    image: '/assets/images/thumbnails/pearliewhite-thumb.jpg',
    structuredDataType: 'CreativeWork',
    projectData: {
      name: 'Pearlie White Branding',
      dateCreated: '2024',
      keywords: ['Branding', 'Logo Design', 'Brand Identity', 'Adobe Illustrator']
    }
  },
  'pages/portfolio/bestwork/rimbrew.html': {
    title: 'Rim Brew Café Branding - Shazzreen Elyana',
    description: 'Comprehensive café branding including logo, menu design, and brand collateral for Rim Brew.',
    ogType: 'article',
    image: '/assets/images/thumbnails/rimbrew-thumb.jpg',
    structuredDataType: 'CreativeWork',
    projectData: {
      name: 'Rim Brew Café Branding',
      dateCreated: '2024',
      keywords: ['Branding', 'Café', 'Print Design', 'Adobe Illustrator']
    }
  },
  'pages/portfolio/bestwork/careerbuddy.html': {
    title: 'Career Buddy UI/UX Design - Shazzreen Elyana',
    description: 'Mobile app UI/UX design project focused on helping users navigate their career journey with intuitive navigation and modern design.',
    ogType: 'article',
    image: '/assets/images/thumbnails/career-buddy-thumb.jpg',
    structuredDataType: 'CreativeWork',
    projectData: {
      name: 'Career Buddy UI/UX Design',
      dateCreated: '2024',
      keywords: ['UI/UX Design', 'Mobile App', 'Figma']
    }
  },
  'pages/portfolio/projects/advertising.html': {
    title: 'Advertising Projects - Shazzreen Elyana',
    description: 'Creative advertising designs and campaigns showcasing compelling visual communication.',
    ogType: 'article',
    image: '/assets/images/thumbnails/advertising-thumb.jpg',
    structuredDataType: 'CreativeWork',
    projectData: {
      name: 'Advertising Projects',
      dateCreated: '2024',
      keywords: ['Advertising', 'Visual Communication', 'Print Design']
    }
  },
  'pages/portfolio/projects/3d.html': {
    title: '3D Design Projects - Shazzreen Elyana',
    description: 'Three-dimensional design work including modeling and rendering projects.',
    ogType: 'article',
    image: '/assets/images/thumbnails/3d-thumb.jpg',
    structuredDataType: 'CreativeWork',
    projectData: {
      name: '3D Design Projects',
      dateCreated: '2024',
      keywords: ['3D Design', '3D Modeling', 'Rendering']
    }
  },
  'pages/portfolio/projects/illustration.html': {
    title: 'Illustration Projects - Shazzreen Elyana',
    description: 'Original illustrations and digital artwork showcasing creative storytelling through visuals.',
    ogType: 'article',
    image: '/assets/images/thumbnails/illustration-thumb.jpg',
    structuredDataType: 'CreativeWork',
    projectData: {
      name: 'Illustration Projects',
      dateCreated: '2024',
      keywords: ['Illustration', 'Digital Art', 'Adobe Illustrator']
    }
  },
  'pages/portfolio/projects/branding.html': {
    title: 'Branding Projects - Shazzreen Elyana',
    description: 'Brand identity design projects including logos, style guides, and brand collateral.',
    ogType: 'article',
    image: '/assets/images/thumbnails/branding-thumb.jpg',
    structuredDataType: 'CreativeWork',
    projectData: {
      name: 'Branding Projects',
      dateCreated: '2024',
      keywords: ['Branding', 'Logo Design', 'Brand Identity']
    }
  },
  'pages/portfolio/projects/socialmedia.html': {
    title: 'Social Media Graphics - Shazzreen Elyana',
    description: 'Social media content design including posts, stories, and promotional graphics.',
    ogType: 'article',
    image: '/assets/images/thumbnails/socialmedia-thumb.jpg',
    structuredDataType: 'CreativeWork',
    projectData: {
      name: 'Social Media Graphics',
      dateCreated: '2024',
      keywords: ['Social Media', 'Digital Graphics', 'Content Design']
    }
  },
  'pages/portfolio/projects/packaging.html': {
    title: 'Packaging Design Projects - Shazzreen Elyana',
    description: 'Product packaging design showcasing creative solutions for brand presentation.',
    ogType: 'article',
    image: '/assets/images/thumbnails/packaging-thumb.jpg',
    structuredDataType: 'CreativeWork',
    projectData: {
      name: 'Packaging Design Projects',
      dateCreated: '2024',
      keywords: ['Packaging Design', 'Product Design', 'Print Design']
    }
  }
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

// Load SEO configuration
function loadSeoConfig() {
  const configPath = path.join(CONFIG.srcDir, 'seo-config.json');
  if (!fs.existsSync(configPath)) {
    console.error('SEO config not found: seo-config.json');
    return null;
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

// Generate SEO meta tags for a page
function generateSeoMeta(filePath, seoConfig) {
  const pageMetadata = PAGE_METADATA[filePath];
  if (!pageMetadata) {
    console.warn(`No metadata found for: ${filePath}`);
    return '';
  }

  // Read SEO meta template
  const templatePath = path.join(CONFIG.componentsDir, 'seo-meta.html');
  if (!fs.existsSync(templatePath)) {
    console.error('SEO meta template not found');
    return '';
  }
  let seoMeta = fs.readFileSync(templatePath, 'utf8');

  // Calculate path prefix for images
  const pathPrefix = getPathPrefix(filePath);
  const fullImageUrl = seoConfig.baseUrl + pageMetadata.image;
  const canonicalUrl = seoConfig.baseUrl + '/' + filePath;

  // Replace placeholders
  seoMeta = seoMeta.replace(/\{\{SITE_NAME\}\}/g, seoConfig.siteName);
  seoMeta = seoMeta.replace(/\{\{LOCALE\}\}/g, seoConfig.locale);
  seoMeta = seoMeta.replace(/\{\{OG_TYPE\}\}/g, pageMetadata.ogType);
  seoMeta = seoMeta.replace(/\{\{OG_TITLE\}\}/g, pageMetadata.title);
  seoMeta = seoMeta.replace(/\{\{OG_DESCRIPTION\}\}/g, pageMetadata.description);
  seoMeta = seoMeta.replace(/\{\{OG_URL\}\}/g, canonicalUrl);
  seoMeta = seoMeta.replace(/\{\{OG_IMAGE\}\}/g, fullImageUrl);
  seoMeta = seoMeta.replace(/\{\{OG_IMAGE_ALT\}\}/g, pageMetadata.title + ' - ' + seoConfig.siteName);

  // Add article-specific meta tags for article pages
  let articleMeta = '';
  if (pageMetadata.ogType === 'article') {
    articleMeta = `  <meta property="article:author" content="${seoConfig.author.name}">\n`;
    if (pageMetadata.projectData && pageMetadata.projectData.dateCreated) {
      articleMeta += `  <meta property="article:published_time" content="${pageMetadata.projectData.dateCreated}-01-01T00:00:00+00:00">`;
    }
  }
  seoMeta = seoMeta.replace(/\{\{ARTICLE_META\}\}/g, articleMeta);

  seoMeta = seoMeta.replace(/\{\{TWITTER_TITLE\}\}/g, pageMetadata.title);
  seoMeta = seoMeta.replace(/\{\{TWITTER_DESCRIPTION\}\}/g, pageMetadata.description);
  seoMeta = seoMeta.replace(/\{\{TWITTER_IMAGE\}\}/g, fullImageUrl);
  seoMeta = seoMeta.replace(/\{\{CANONICAL_URL\}\}/g, canonicalUrl);
  seoMeta = seoMeta.replace(/\{\{ROBOTS\}\}/g, seoConfig.defaultRobots);

  return seoMeta;
}

// Generate structured data (Schema.org JSON-LD) for a page
function generateStructuredData(filePath, seoConfig) {
  const pageMetadata = PAGE_METADATA[filePath];
  if (!pageMetadata) {
    return '';
  }

  const schemas = [];

  // WebSite schema for all pages
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: seoConfig.siteName,
    description: 'Graphic designer portfolio showcasing branding, UI/UX, print design, and digital graphics',
    url: seoConfig.baseUrl,
    author: {
      '@type': 'Person',
      name: seoConfig.author.name
    }
  });

  // Person schema for about page
  if (pageMetadata.structuredDataType === 'Person') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: seoConfig.author.name,
      jobTitle: seoConfig.author.jobTitle,
      url: seoConfig.baseUrl,
      image: seoConfig.baseUrl + seoConfig.defaultImage,
      email: seoConfig.author.email,
      telephone: seoConfig.author.telephone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: seoConfig.author.location.city,
        addressCountry: seoConfig.author.location.country
      },
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: seoConfig.organization.university
      },
      knowsAbout: seoConfig.skills,
      sameAs: [
        seoConfig.social.behance,
        seoConfig.social.linkedin
      ]
    });
  }

  // CreativeWork schema for portfolio detail pages
  if (pageMetadata.structuredDataType === 'CreativeWork' && pageMetadata.projectData) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: pageMetadata.projectData.name,
      description: pageMetadata.description,
      author: {
        '@type': 'Person',
        name: seoConfig.author.name
      },
      dateCreated: pageMetadata.projectData.dateCreated,
      image: seoConfig.baseUrl + pageMetadata.image,
      keywords: pageMetadata.projectData.keywords
    });
  }

  // Generate BreadcrumbList for nested pages
  const pathParts = filePath.split('/');
  if (pathParts.length > 1) {
    const breadcrumbItems = [];
    let currentPath = '';

    // Home
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: seoConfig.baseUrl
    });

    // Build breadcrumbs from path
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      if (part === 'index.html' || !part) continue;

      currentPath += (currentPath ? '/' : '') + part;
      const isLast = i === pathParts.length - 1;

      // Determine name from part
      let name = part.replace('.html', '').replace(/[-_]/g, ' ');
      name = name.charAt(0).toUpperCase() + name.slice(1);

      breadcrumbItems.push({
        '@type': 'ListItem',
        position: breadcrumbItems.length + 1,
        name: name,
        item: isLast ? undefined : seoConfig.baseUrl + '/' + currentPath
      });
    }

    if (breadcrumbItems.length > 1) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems
      });
    }
  }

  return `<script type="application/ld+json">\n${JSON.stringify(schemas, null, 2)}\n  </script>`;
}

// Generate sitemap.xml
function generateSitemap(seoConfig) {
  const currentDate = new Date().toISOString().split('T')[0];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Define priorities and change frequencies
  const urlConfig = {
    'index.html': { priority: '1.0', changefreq: 'monthly' },
    'pages/about.html': { priority: '1.0', changefreq: 'monthly' },
    'pages/skills.html': { priority: '0.9', changefreq: 'monthly' },
    'pages/contact.html': { priority: '0.9', changefreq: 'monthly' },
    'pages/portfolio/bestwork.html': { priority: '0.9', changefreq: 'weekly' },
    'pages/portfolio/projects.html': { priority: '0.9', changefreq: 'weekly' }
  };

  for (const filePath of CONFIG.htmlFiles) {
    const url = seoConfig.baseUrl + '/' + filePath;
    const config = urlConfig[filePath] || {
      priority: filePath.includes('/bestwork/') ? '0.8' : '0.7',
      changefreq: 'weekly'
    };

    sitemap += `  <url>
    <loc>${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${config.changefreq}</changefreq>
    <priority>${config.priority}</priority>
  </url>
`;
  }

  sitemap += `</urlset>`;

  // Write to dist directory
  const sitemapPath = path.join(CONFIG.distDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  console.log('   ✓ sitemap.xml');
}

// Generate robots.txt
function generateRobotsTxt(seoConfig) {
  const robotsTxt = `# Robots.txt for ${seoConfig.siteName}
# Generated: ${new Date().toISOString()}

User-agent: *
Allow: /

Sitemap: ${seoConfig.baseUrl}/sitemap.xml
`;

  const robotsPath = path.join(CONFIG.distDir, 'robots.txt');
  fs.writeFileSync(robotsPath, robotsTxt, 'utf8');
  console.log('   ✓ robots.txt');
}

// Process HTML file - inject components
function processHtml(filePath, seoConfig) {
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

  // Inject SEO meta tags and structured data
  if (seoConfig) {
    const seoMeta = generateSeoMeta(filePath, seoConfig);
    const structuredData = generateStructuredData(filePath, seoConfig);

    // Inject before closing </head> tag
    html = html.replace('</head>', `  ${seoMeta}\n  ${structuredData}\n</head>`);
  }

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
  const header = `/* ============================================
   RESUME WEBSITE - CUSTOM STYLES
   Author: Shazzreen Elyana

   ⚠️  DO NOT EDIT THIS FILE DIRECTLY!

   This file is auto-generated by: npm run build

   To make CSS changes, edit the source modules in assets/css/:
   - variables.css  → Colors, fonts, spacing
   - base.css       → Body, typography, links
   - components.css → Navbar, buttons, cards
   - layouts.css    → Sections, grids, containers
   - responsive.css → Media queries

   Then run: npm run build
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

  // Output to assets/css/styles.css (for dev)
  const srcOutputPath = path.join(CONFIG.cssDir, 'styles.css');
  fs.writeFileSync(srcOutputPath, combinedCss, 'utf8');
  console.log(`   → assets/css/styles.css`);

  // Output to dist/assets/css/styles.css (for prod)
  const cssOutputDir = path.join(CONFIG.distDir, 'assets', 'css');
  fs.mkdirSync(cssOutputDir, { recursive: true });
  const distOutputPath = path.join(cssOutputDir, 'styles.css');
  fs.writeFileSync(distOutputPath, combinedCss, 'utf8');
  console.log(`   → dist/assets/css/styles.css`);

  return combinedCss.length;
}

// Main build function
function build() {
  console.log('🔨 Building resume website...\n');

  // Load SEO configuration
  const seoConfig = loadSeoConfig();
  if (!seoConfig) {
    console.error('Failed to load SEO config. Continuing without SEO features.');
  }

  // Clean dist folder
  console.log('📁 Cleaning dist folder...');
  cleanDist();

  // Process and write HTML files
  console.log('📄 Processing HTML files...');
  let processedCount = 0;

  for (const filePath of CONFIG.htmlFiles) {
    const html = processHtml(filePath, seoConfig);

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

  // Build concatenated CSS
  console.log('\n🎨 Building CSS...');
  const cssSize = buildCss();
  console.log(`   Total: ${(cssSize / 1024).toFixed(1)} KB`);

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

  // Generate SEO files
  if (seoConfig) {
    console.log('\n🔍 Generating SEO files...');
    generateSitemap(seoConfig);
    generateRobotsTxt(seoConfig);
  }

  console.log(`\n✅ Build complete! ${processedCount} files processed.`);
  console.log(`📂 Output: ${CONFIG.distDir}`);
  console.log('\nTo preview: npx serve dist');
}

// Run build
build();
