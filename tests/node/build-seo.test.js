/**
 * Node Tests - SEO Build Functions
 * Tests for SEO-related functions in build.js
 */

const path = require('path');

// Mock fs module before requiring functions
jest.mock('fs');
const fs = require('fs');

// Mock console methods to avoid cluttering test output
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};

describe('SEO Build Functions', () => {
  let loadSeoConfig;
  let generateSeoMeta;
  let generateStructuredData;
  let generateSitemap;
  let generateRobotsTxt;

  // Mock SEO config
  const mockSeoConfig = {
    baseUrl: 'https://www.yanasharif.com',
    siteName: 'Shazzreen Elyana - Graphic Designer',
    locale: 'en_US',
    defaultRobots: 'index, follow',
    defaultImage: '/assets/images/common/profile-photo.png',
    author: {
      name: 'Shazzreen Elyana',
      email: 'nshazzreene@gmail.com',
      telephone: '+60135449715',
      jobTitle: 'Graphic Designer',
      location: {
        city: 'Kajang',
        country: 'MY'
      }
    },
    social: {
      behance: 'https://www.behance.net/yana03',
      linkedin: 'https://www.linkedin.com/in/yana-sharif/'
    },
    organization: {
      university: 'Universiti Teknologi MARA (UiTM)'
    },
    skills: ['Graphic Design', 'Branding', 'UI/UX Design']
  };

  // Mock page metadata
  const mockPageMetadata = {
    'pages/about.html': {
      title: 'About Me - Shazzreen Elyana | Graphic Designer',
      description: 'Passionate graphic designer creating meaningful visual experiences.',
      ogType: 'profile',
      image: '/assets/images/common/profile-photo.png',
      structuredDataType: 'Person'
    },
    'pages/portfolio/bestwork/careerbuddy.html': {
      title: 'Career Buddy UI/UX Design - Shazzreen Elyana',
      description: 'Mobile app UI/UX design project focused on helping users navigate their career journey.',
      ogType: 'article',
      image: '/assets/images/thumbnails/career-buddy-thumb.jpg',
      structuredDataType: 'CreativeWork',
      projectData: {
        name: 'Career Buddy UI/UX Design',
        dateCreated: '2024',
        keywords: ['UI/UX Design', 'Mobile App', 'Figma']
      }
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    // Mock fs functions
    fs.existsSync = jest.fn(() => true);
    fs.readFileSync = jest.fn();
    fs.writeFileSync = jest.fn();
  });

  describe('loadSeoConfig()', () => {
    beforeEach(() => {
      loadSeoConfig = () => {
        const configPath = path.join(__dirname, '../../seo-config.json');
        if (!fs.existsSync(configPath)) {
          console.error('SEO config not found: seo-config.json');
          return null;
        }
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
      };
    });

    test('should load and parse SEO config successfully', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(mockSeoConfig));

      const result = loadSeoConfig();

      expect(result).toEqual(mockSeoConfig);
      expect(result.baseUrl).toBe('https://www.yanasharif.com');
      expect(result.siteName).toBe('Shazzreen Elyana - Graphic Designer');
    });

    test('should return null if config file not found', () => {
      fs.existsSync.mockReturnValue(false);

      const result = loadSeoConfig();

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith('SEO config not found: seo-config.json');
    });

    test('should parse JSON from file content', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue('{"baseUrl": "https://example.com", "siteName": "Test Site"}');

      const result = loadSeoConfig();

      expect(result.baseUrl).toBe('https://example.com');
      expect(result.siteName).toBe('Test Site');
    });
  });

  describe('generateSeoMeta()', () => {
    beforeEach(() => {
      generateSeoMeta = (filePath, seoConfig, pageMetadata) => {
        const metadata = pageMetadata[filePath];
        if (!metadata) {
          console.warn(`No metadata found for: ${filePath}`);
          return '';
        }

        const seoMetaTemplate = `<!-- Open Graph Meta Tags -->
  <meta property="og:site_name" content="{{SITE_NAME}}">
  <meta property="og:locale" content="{{LOCALE}}">
  <meta property="og:type" content="{{OG_TYPE}}">
  <meta property="og:title" content="{{OG_TITLE}}">
  <meta property="og:description" content="{{OG_DESCRIPTION}}">
  <meta property="og:url" content="{{OG_URL}}">
  <meta property="og:image" content="{{OG_IMAGE}}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">

  <!-- Twitter Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{{TWITTER_TITLE}}">
  <meta name="twitter:description" content="{{TWITTER_DESCRIPTION}}">
  <meta name="twitter:image" content="{{TWITTER_IMAGE}}">

  <!-- Canonical URL -->
  <link rel="canonical" href="{{CANONICAL_URL}}">

  <!-- Robots Meta Tag -->
  <meta name="robots" content="{{ROBOTS}}">`;

        const fullImageUrl = seoConfig.baseUrl + metadata.image;
        const canonicalUrl = seoConfig.baseUrl + '/' + filePath;

        let seoMeta = seoMetaTemplate;
        seoMeta = seoMeta.replace(/\{\{SITE_NAME\}\}/g, seoConfig.siteName);
        seoMeta = seoMeta.replace(/\{\{LOCALE\}\}/g, seoConfig.locale);
        seoMeta = seoMeta.replace(/\{\{OG_TYPE\}\}/g, metadata.ogType);
        seoMeta = seoMeta.replace(/\{\{OG_TITLE\}\}/g, metadata.title);
        seoMeta = seoMeta.replace(/\{\{OG_DESCRIPTION\}\}/g, metadata.description);
        seoMeta = seoMeta.replace(/\{\{OG_URL\}\}/g, canonicalUrl);
        seoMeta = seoMeta.replace(/\{\{OG_IMAGE\}\}/g, fullImageUrl);
        seoMeta = seoMeta.replace(/\{\{TWITTER_TITLE\}\}/g, metadata.title);
        seoMeta = seoMeta.replace(/\{\{TWITTER_DESCRIPTION\}\}/g, metadata.description);
        seoMeta = seoMeta.replace(/\{\{TWITTER_IMAGE\}\}/g, fullImageUrl);
        seoMeta = seoMeta.replace(/\{\{CANONICAL_URL\}\}/g, canonicalUrl);
        seoMeta = seoMeta.replace(/\{\{ROBOTS\}\}/g, seoConfig.defaultRobots);

        return seoMeta;
      };
    });

    test('should generate Open Graph meta tags', () => {
      const result = generateSeoMeta('pages/about.html', mockSeoConfig, mockPageMetadata);

      expect(result).toContain('<meta property="og:site_name" content="Shazzreen Elyana - Graphic Designer">');
      expect(result).toContain('<meta property="og:locale" content="en_US">');
      expect(result).toContain('<meta property="og:type" content="profile">');
      expect(result).toContain('<meta property="og:title" content="About Me - Shazzreen Elyana | Graphic Designer">');
    });

    test('should generate Twitter Card meta tags', () => {
      const result = generateSeoMeta('pages/about.html', mockSeoConfig, mockPageMetadata);

      expect(result).toContain('<meta name="twitter:card" content="summary_large_image">');
      expect(result).toContain('<meta name="twitter:title"');
      expect(result).toContain('<meta name="twitter:description"');
      expect(result).toContain('<meta name="twitter:image"');
    });

    test('should generate canonical URL correctly', () => {
      const result = generateSeoMeta('pages/about.html', mockSeoConfig, mockPageMetadata);

      expect(result).toContain('<link rel="canonical" href="https://www.yanasharif.com/pages/about.html">');
    });

    test('should generate robots meta tag', () => {
      const result = generateSeoMeta('pages/about.html', mockSeoConfig, mockPageMetadata);

      expect(result).toContain('<meta name="robots" content="index, follow">');
    });

    test('should use full URL for images', () => {
      const result = generateSeoMeta('pages/about.html', mockSeoConfig, mockPageMetadata);

      expect(result).toContain('https://www.yanasharif.com/assets/images/common/profile-photo.png');
    });

    test('should handle portfolio pages with article type', () => {
      const result = generateSeoMeta('pages/portfolio/bestwork/careerbuddy.html', mockSeoConfig, mockPageMetadata);

      expect(result).toContain('<meta property="og:type" content="article">');
      expect(result).toContain('Career Buddy UI/UX Design');
      expect(result).toContain('career-buddy-thumb.jpg');
    });

    test('should return empty string if no metadata found', () => {
      const result = generateSeoMeta('nonexistent.html', mockSeoConfig, mockPageMetadata);

      expect(result).toBe('');
      expect(console.warn).toHaveBeenCalledWith('No metadata found for: nonexistent.html');
    });
  });

  describe('generateStructuredData()', () => {
    beforeEach(() => {
      generateStructuredData = (filePath, seoConfig, pageMetadata) => {
        const metadata = pageMetadata[filePath];
        if (!metadata) {
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
        if (metadata.structuredDataType === 'Person') {
          schemas.push({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: seoConfig.author.name,
            jobTitle: seoConfig.author.jobTitle,
            url: seoConfig.baseUrl,
            email: seoConfig.author.email
          });
        }

        // CreativeWork schema for portfolio pages
        if (metadata.structuredDataType === 'CreativeWork' && metadata.projectData) {
          schemas.push({
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: metadata.projectData.name,
            description: metadata.description,
            author: {
              '@type': 'Person',
              name: seoConfig.author.name
            },
            dateCreated: metadata.projectData.dateCreated,
            keywords: metadata.projectData.keywords
          });
        }

        return `<script type="application/ld+json">\n${JSON.stringify(schemas, null, 2)}\n  </script>`;
      };
    });

    test('should generate WebSite schema for all pages', () => {
      const result = generateStructuredData('pages/about.html', mockSeoConfig, mockPageMetadata);

      expect(result).toContain('"@type": "WebSite"');
      expect(result).toContain('"name": "Shazzreen Elyana - Graphic Designer"');
      expect(result).toContain('<script type="application/ld+json">');
      expect(result).toContain('</script>');
    });

    test('should generate Person schema for about page', () => {
      const result = generateStructuredData('pages/about.html', mockSeoConfig, mockPageMetadata);

      expect(result).toContain('"@type": "Person"');
      expect(result).toContain('"name": "Shazzreen Elyana"');
      expect(result).toContain('"jobTitle": "Graphic Designer"');
      expect(result).toContain('"email": "nshazzreene@gmail.com"');
    });

    test('should generate CreativeWork schema for portfolio pages', () => {
      const result = generateStructuredData('pages/portfolio/bestwork/careerbuddy.html', mockSeoConfig, mockPageMetadata);

      expect(result).toContain('"@type": "CreativeWork"');
      expect(result).toContain('"name": "Career Buddy UI/UX Design"');
      expect(result).toContain('"dateCreated": "2024"');
      expect(result).toContain('"UI/UX Design"');
      expect(result).toContain('"Mobile App"');
    });

    test('should generate valid JSON-LD structure', () => {
      const result = generateStructuredData('pages/about.html', mockSeoConfig, mockPageMetadata);

      // Extract JSON from script tag
      const jsonMatch = result.match(/<script type="application\/ld\+json">\n([\s\S]+)\n  <\/script>/);
      expect(jsonMatch).toBeTruthy();

      // Should be valid JSON
      const json = JSON.parse(jsonMatch[1]);
      expect(Array.isArray(json)).toBeTruthy();
      expect(json.length).toBeGreaterThan(0);
    });

    test('should return empty string if no metadata found', () => {
      const result = generateStructuredData('nonexistent.html', mockSeoConfig, mockPageMetadata);

      expect(result).toBe('');
    });
  });

  describe('generateSitemap()', () => {
    beforeEach(() => {
      generateSitemap = (seoConfig, htmlFiles) => {
        const currentDate = new Date().toISOString().split('T')[0];

        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

        const urlConfig = {
          'index.html': { priority: '1.0', changefreq: 'monthly' },
          'pages/about.html': { priority: '1.0', changefreq: 'monthly' }
        };

        for (const filePath of htmlFiles) {
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

        fs.writeFileSync('/dist/sitemap.xml', sitemap, 'utf8');
        return sitemap;
      };
    });

    test('should generate valid XML structure', () => {
      const htmlFiles = ['index.html', 'pages/about.html'];
      const result = generateSitemap(mockSeoConfig, htmlFiles);

      expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(result).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(result).toContain('</urlset>');
    });

    test('should include all HTML files as URLs', () => {
      const htmlFiles = ['index.html', 'pages/about.html', 'pages/skills.html'];
      const result = generateSitemap(mockSeoConfig, htmlFiles);

      expect(result).toContain('<loc>https://www.yanasharif.com/index.html</loc>');
      expect(result).toContain('<loc>https://www.yanasharif.com/pages/about.html</loc>');
      expect(result).toContain('<loc>https://www.yanasharif.com/pages/skills.html</loc>');
    });

    test('should set correct priorities for main pages', () => {
      const htmlFiles = ['index.html', 'pages/about.html'];
      const result = generateSitemap(mockSeoConfig, htmlFiles);

      expect(result).toContain('<priority>1.0</priority>');
    });

    test('should set correct priorities for portfolio pages', () => {
      const htmlFiles = ['pages/portfolio/bestwork/careerbuddy.html'];
      const result = generateSitemap(mockSeoConfig, htmlFiles);

      expect(result).toContain('<priority>0.8</priority>');
    });

    test('should include lastmod with current date', () => {
      const htmlFiles = ['index.html'];
      const result = generateSitemap(mockSeoConfig, htmlFiles);

      expect(result).toContain('<lastmod>');
      expect(result).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
    });

    test('should include changefreq', () => {
      const htmlFiles = ['index.html'];
      const result = generateSitemap(mockSeoConfig, htmlFiles);

      expect(result).toContain('<changefreq>monthly</changefreq>');
    });

    test('should write to file system', () => {
      const htmlFiles = ['index.html'];
      generateSitemap(mockSeoConfig, htmlFiles);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/dist/sitemap.xml',
        expect.stringContaining('<?xml version'),
        'utf8'
      );
    });
  });

  describe('generateRobotsTxt()', () => {
    beforeEach(() => {
      generateRobotsTxt = (seoConfig) => {
        const robotsTxt = `# Robots.txt for ${seoConfig.siteName}
# Generated: ${new Date().toISOString()}

User-agent: *
Allow: /

Sitemap: ${seoConfig.baseUrl}/sitemap.xml
`;

        fs.writeFileSync('/dist/robots.txt', robotsTxt, 'utf8');
        return robotsTxt;
      };
    });

    test('should generate valid robots.txt format', () => {
      const result = generateRobotsTxt(mockSeoConfig);

      expect(result).toContain('User-agent: *');
      expect(result).toContain('Allow: /');
      expect(result).toContain('Sitemap:');
    });

    test('should include sitemap URL', () => {
      const result = generateRobotsTxt(mockSeoConfig);

      expect(result).toContain('Sitemap: https://www.yanasharif.com/sitemap.xml');
    });

    test('should include site name in header comment', () => {
      const result = generateRobotsTxt(mockSeoConfig);

      expect(result).toContain('# Robots.txt for Shazzreen Elyana - Graphic Designer');
    });

    test('should include generation timestamp', () => {
      const result = generateRobotsTxt(mockSeoConfig);

      expect(result).toContain('# Generated:');
      expect(result).toMatch(/# Generated: \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    test('should write to file system', () => {
      generateRobotsTxt(mockSeoConfig);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/dist/robots.txt',
        expect.stringContaining('User-agent: *'),
        'utf8'
      );
    });
  });
});
