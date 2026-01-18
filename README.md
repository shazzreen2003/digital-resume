# Resume Website - Shazzreen Elyana

A modern, responsive portfolio website built with HTML5, Bootstrap 5, and vanilla JavaScript. Features a component-based architecture with a build system for static site generation.

## Features

- **Component-Based Architecture** - Reusable navigation and footer components
- **Build System** - Node.js build script for static site generation
- **Hover Dropdown Navigation** - Smooth dropdown menus for portfolio sections
- **Fully Responsive** - Works perfectly on desktop, tablet, and mobile devices
- **Modern Design** - Clean, professional aesthetic with customizable color schemes
- **Breadcrumb Navigation** - Easy navigation with breadcrumbs on all pages
- **Contact Form** - Validated contact form integrated with Formspree
- **Dual Resume Downloads** - Creative (image) and Formal (PDF) resume options

## File Structure

```
resume-website/
├── index.html                      # Redirects to pages/about.html
├── build.js                        # Build script for static site generation
├── package.json                    # Project configuration
│
├── assets/
│   ├── components/
│   │   ├── navigation.html         # Shared navigation component
│   │   └── footer.html             # Shared footer component
│   ├── css/
│   │   └── styles.css              # Custom styles and variables
│   ├── js/
│   │   ├── components.js           # Component loader (dev mode)
│   │   └── script.js               # Form validation and interactivity
│   ├── images/                     # All images organized by category
│   │   ├── common/                 # Logo, profile, resume images
│   │   ├── thumbnails/             # Portfolio thumbnails
│   │   ├── branding/               # Branding project images
│   │   ├── digital/                # Digital design images
│   │   ├── freelance/              # Freelance work images
│   │   ├── print/                  # Print design images
│   │   └── uiux/                   # UI/UX project images
│   └── pdf/
│       └── Resume_Shazzreen.pdf    # Formal resume PDF
│
├── pages/
│   ├── about.html                  # About/landing page
│   ├── skills.html                 # Skills and expertise
│   ├── contact.html                # Contact form
│   └── portfolio/
│       ├── bestwork.html           # Best Work carousel page
│       ├── projects.html           # Projects carousel page
│       ├── bestwork/               # Individual best work pages
│       │   ├── freelance.html
│       │   ├── jxtravel.html
│       │   ├── pearliewhite.html
│       │   ├── rimbrew.html
│       │   └── careerbuddy.html
│       └── projects/               # Individual project pages
│           ├── advertising.html
│           ├── 3d.html
│           ├── illustration.html
│           ├── branding.html
│           ├── socialmedia.html
│           └── packaging.html
│
└── dist/                           # Built static files (generated)
```

## Getting Started

### Prerequisites

- Node.js (for build system)
- A local development server (e.g., VS Code Live Server, or `npx serve`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shazzreen2003/digital-resume.git
   cd resume-website
   ```

2. Install dependencies (optional, for development):
   ```bash
   npm install
   ```

### Development

For development, you can run a local server and work with the source files directly:

```bash
# Using VS Code Live Server extension
# Or using npx serve:
npx serve .
```

The component loader (`components.js`) will dynamically load navigation and footer in development mode.

### Building for Production

Run the build script to generate static HTML files with injected components:

```bash
npm run build
```

This will:
- Process all HTML files
- Inject navigation and footer components
- Set active navigation states automatically
- Output to the `dist/` folder

### Preview Production Build

```bash
npx serve dist
```

## Navigation Structure

The site features hover dropdown navigation for portfolio sections:

- **About Me** - Landing page with bio and resume downloads
- **Skills** - Technical skills and expertise
- **Best Work** (dropdown)
  - View All
  - Freelance
  - JX Travel & Tours
  - Pearlie White
  - Rimbrew Coffee Shop
  - Career Buddy
- **Projects** (dropdown)
  - View All
  - Advertising
  - 3D Design
  - Illustration
  - Branding
  - Social Media Design
  - Packaging
- **Contact** - Contact form

## Customization

### Changing Colors

Edit the CSS variables in `assets/css/styles.css`:

```css
:root {
  --primary-color: #751113;
  --secondary-color: #000000;
  --accent-color: #751113;
  --accent-hover: #000000;
}
```

### Adding New Portfolio Items

1. Create the HTML file in the appropriate folder (`bestwork/` or `projects/`)
2. Add the page to `build.js` in the `htmlFiles` array
3. Add a link in `navigation.html` dropdown menu
4. Add a carousel slide in `bestwork.html` or `projects.html`
5. Run `npm run build`

### Updating Components

Edit the shared components in `assets/components/`:
- `navigation.html` - Site navigation with dropdowns
- `footer.html` - Site footer with social links

Use `{{PATH}}` placeholder for relative paths that adjust based on page depth.

## Build System

The `build.js` script handles:

- **Component Injection** - Replaces `<div id="site-navigation">` and `<div id="site-footer">` with actual components
- **Path Resolution** - Adjusts `{{PATH}}` placeholders based on file depth
- **Active Nav State** - Sets active class on navigation based on `data-page` attribute
- **Script Cleanup** - Removes `components.js` reference (not needed in production)
- **Asset Copying** - Copies CSS, JS, images, and PDF files to dist

## Deployment

### GitHub Pages

1. Push to GitHub
2. Go to Settings > Pages
3. Set source to `main` branch, `/dist` folder
4. Site will be live at `https://username.github.io/repo-name`

### Netlify / Vercel

1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari (iOS and macOS)
- Opera
- Samsung Internet

## Mobile Optimization

- Touch-friendly buttons (48px minimum)
- Responsive navigation with hamburger menu
- Optimized font sizes
- iPhone notch/safe area support
- Lazy loading images

## Credits

- **Bootstrap 5** - Frontend framework
- **Bootstrap Icons** - Icon library
- **Google Fonts** - Typography (Inter & Poppins)
- **Formspree** - Contact form handling

## License

This project is free to use for personal and commercial purposes.

---

**Portfolio of Shazzreen Elyana** - Graphic Designer
