# Resume Website - Comprehensive Testing Guide

> **Purpose**: Prevent bugs like the nav active state issue from slipping through.
> Always test BOTH dev (`npm run dev`) AND prod (`npm run build && npm run preview`) environments.

---

## Table of Contents
1. [Page Inventory](#1-page-inventory)
2. [Critical Edge Cases](#2-critical-edge-cases)
3. [Dev vs Prod Testing Matrix](#3-dev-vs-prod-testing-matrix)
4. [Navigation Tests](#4-navigation-tests)
5. [Build System Tests](#5-build-system-tests)
6. [Form Validation Tests](#6-form-validation-tests)
7. [Theme Tests](#7-theme-tests)
8. [Carousel Tests](#8-carousel-tests)
9. [Responsive Tests](#9-responsive-tests)
10. [Asset & Resource Tests](#10-asset--resource-tests)
11. [Link Tests](#11-link-tests)
12. [Browser Compatibility](#12-browser-compatibility)
13. [Quick Regression Checklist](#13-quick-regression-checklist)

---

## 1. Page Inventory

### All Pages (18 total)

| Page | Path | data-page | data-nav |
|------|------|-----------|----------|
| Index (redirect) | `/index.html` | - | - |
| About Me | `/pages/about.html` | `index` | `index` |
| Skills | `/pages/skills.html` | `skills` | `skills` |
| Contact | `/pages/contact.html` | `contact` | `contact` |
| Best Work | `/pages/portfolio/bestwork.html` | `bestwork` | `bestwork` |
| Projects | `/pages/portfolio/projects.html` | `projects` | `projects` |
| Freelance | `/pages/portfolio/bestwork/freelance.html` | `bestwork` | `bestwork` |
| JX Travel | `/pages/portfolio/bestwork/jxtravel.html` | `bestwork` | `bestwork` |
| Pearlie White | `/pages/portfolio/bestwork/pearliewhite.html` | `bestwork` | `bestwork` |
| Rimbrew | `/pages/portfolio/bestwork/rimbrew.html` | `bestwork` | `bestwork` |
| Career Buddy | `/pages/portfolio/bestwork/careerbuddy.html` | `bestwork` | `bestwork` |
| Advertising | `/pages/portfolio/projects/advertising.html` | `projects` | `projects` |
| 3D Design | `/pages/portfolio/projects/3d.html` | `projects` | `projects` |
| Illustration | `/pages/portfolio/projects/illustration.html` | `projects` | `projects` |
| Branding | `/pages/portfolio/projects/branding.html` | `projects` | `projects` |
| Social Media | `/pages/portfolio/projects/socialmedia.html` | `projects` | `projects` |
| Packaging | `/pages/portfolio/projects/packaging.html` | `projects` | `projects` |

---

## 2. Critical Edge Cases

### 2.1 Nav Active State (FIXED - Jan 2026)

**Bug**: Active nav styling worked in dev but not in prod.

**Root Cause**: JavaScript timing difference
```
DEV:  Page loads → JS runs (no nav yet) → components.js loads nav → sets active ✅
PROD: Page loads (nav already there) → JS runs → removes active class ❌
```

**Fix Applied**: `highlightActivePage()` now checks if `.nav-link.active` exists before modifying.

**Test This**:
- [ ] Dev: Nav shows active state on correct page
- [ ] Prod: Nav shows active state on correct page
- [ ] Active state has visible styling (background + border)

### 2.2 CSS @import Not Working in Prod

**Issue**: Using `main.css` with `@import` statements didn't load CSS properly on some deployments.

**Fix**: Build now concatenates all CSS into single `styles.css` file.

**Test This**:
- [ ] Prod: All styles load (not just partial)
- [ ] Check browser DevTools → Network → styles.css returns 200
- [ ] Check DevTools → Elements → styles are applied

### 2.3 Path Resolution for Nested Pages

**Issue**: Different directory depths need different relative paths.

**Paths by depth**:
```
index.html               → ''
pages/about.html         → '../'
pages/portfolio/bestwork.html → '../../'
pages/portfolio/bestwork/freelance.html → '../../../'
```

**Test This**:
- [ ] Logo links work from all page depths
- [ ] CSS loads from all page depths
- [ ] Images load from all page depths
- [ ] Navigation links work from deepest pages

### 2.4 Component Loading Race Condition

**Issue**: In dev mode, components load async. Other scripts may run before components exist.

**Test This**:
- [ ] Dev: No console errors about missing elements
- [ ] Dev: Navigation renders before user interaction
- [ ] Dev: `componentsLoaded` event fires

---

## 3. Dev vs Prod Testing Matrix

### ALWAYS test both environments!

| Feature | Dev Test | Prod Test |
|---------|----------|-----------|
| Nav active state | `npm run dev` → check nav | `npm run build && npm run preview` → check nav |
| CSS loads | Check all styles apply | Check styles.css loads |
| Images load | Check all images | Check all images |
| Links work | Click all nav links | Click all nav links |
| Form works | Submit test form | Submit test form |
| Theme toggle | Toggle and reload | Toggle and reload |
| Mobile menu | Resize to mobile | Resize to mobile |
| Carousels | Check auto-play | Check auto-play |

### How to Run Each Environment

**Development**:
```bash
npm run dev
# Opens http://localhost:3000
# Uses dynamic component loading
```

**Production Preview**:
```bash
npm run build
npm run preview
# Opens http://localhost:3000 from dist/
# Uses static pre-built HTML
```

**Production (Vercel)**:
```
Push to main branch
Wait for deployment
Check https://www.yanasharif.com/
```

---

## 4. Navigation Tests

### 4.1 Active State Tests

For EACH page, verify the correct nav item is highlighted:

- [ ] `/pages/about.html` → "About Me" active
- [ ] `/pages/skills.html` → "Skills" active
- [ ] `/pages/contact.html` → "Contact" active
- [ ] `/pages/portfolio/bestwork.html` → "Best Work" active
- [ ] `/pages/portfolio/projects.html` → "Projects" active
- [ ] All bestwork detail pages → "Best Work" active
- [ ] All projects detail pages → "Projects" active

### 4.2 Active State Styling

- [ ] Active link has accent color text
- [ ] Active link has background tint
- [ ] Active link has bottom border (3px)
- [ ] Active link has font-weight 600

### 4.3 Dropdown Tests (Desktop ≥992px)

- [ ] Hover on "Best Work" shows dropdown
- [ ] Hover on "Projects" shows dropdown
- [ ] Dropdown items are clickable
- [ ] Moving mouse to dropdown doesn't close it
- [ ] Arrow rotates on hover

### 4.4 Mobile Menu Tests (<992px)

- [ ] Hamburger icon visible
- [ ] Clicking hamburger opens menu
- [ ] Menu shows all nav items
- [ ] Dropdown arrows clickable (toggles submenu)
- [ ] Clicking nav link closes menu
- [ ] Active state visible in mobile menu

### 4.5 Breadcrumb Tests

- [ ] Breadcrumbs show on all content pages
- [ ] Breadcrumb links work
- [ ] Current page shown (not linked)

---

## 5. Build System Tests

### 5.1 CSS Concatenation

Run `npm run build` and verify:

- [ ] `dist/assets/css/styles.css` exists
- [ ] `assets/css/styles.css` exists (dev copy)
- [ ] Both files are identical
- [ ] File contains all module content:
  - [ ] CSS variables (`:root { --primary-color...`)
  - [ ] Base styles (`body {`, `h1 {`)
  - [ ] Component styles (`.navbar {`, `.card {`)
  - [ ] Layout styles (`.page-hero {`, `section {`)
  - [ ] Media queries (`@media (max-width:`)

### 5.2 HTML Processing

- [ ] All 17 HTML files generated in dist/
- [ ] Navigation HTML injected (not empty div)
- [ ] Footer HTML injected (not empty div)
- [ ] `{{PATH}}` placeholders replaced
- [ ] `components.js` script tag removed
- [ ] Active class added to correct nav link

### 5.3 Asset Copying

- [ ] `dist/assets/images/` contains all images
- [ ] `dist/assets/js/script.js` exists
- [ ] `dist/assets/js/theme-init.js` exists
- [ ] `dist/assets/js/components.js` does NOT exist
- [ ] `dist/assets/pdf/` contains resume PDF

---

## 6. Form Validation Tests

### 6.1 Field Validation Rules

**Name Field**:
- [ ] Empty → "Please enter your full name"
- [ ] "A" (1 char) → "Name must be at least 2 characters long"
- [ ] "123" → "Please enter a valid name"
- [ ] "John Doe" → Valid (green border)

**Email Field**:
- [ ] Empty → "Please enter your email address"
- [ ] "notanemail" → "Please enter a valid email address"
- [ ] "test@" → "Please enter a valid email address"
- [ ] "test@example.com" → Valid

**Subject Field**:
- [ ] Empty → "Please enter a subject"
- [ ] "Hi" (2 chars) → "Subject must be at least 3 characters long"
- [ ] "Hello" → Valid

**Message Field**:
- [ ] Empty → "Please enter your message"
- [ ] "Hi there" (8 chars) → "Message must be at least 10 characters long"
- [ ] "Hello, I would like to contact you." → Valid

### 6.2 Validation Behavior

- [ ] Blur event triggers validation
- [ ] Focus event clears error styling
- [ ] Invalid fields show red border
- [ ] Valid fields show green border
- [ ] Error messages appear below field

### 6.3 Form Submission

- [ ] Submit with invalid fields → Shows errors, doesn't submit
- [ ] Submit with all valid → Shows success message
- [ ] Success message auto-dismisses (5 seconds)
- [ ] Form resets after success
- [ ] Error message shows if Formspree fails

---

## 7. Theme Tests

### 7.1 Theme Toggle

- [ ] Toggle button visible in navbar
- [ ] Click toggles between light/dark
- [ ] Icon changes (sun ↔ moon)
- [ ] All colors update (background, text, accents)

### 7.2 Theme Persistence

- [ ] Set dark mode → Reload page → Still dark
- [ ] Set light mode → Reload page → Still light
- [ ] Navigate to new page → Theme preserved
- [ ] Clear localStorage → Returns to default

### 7.3 System Preference

- [ ] No stored preference + system dark → Dark mode
- [ ] No stored preference + system light → Light mode
- [ ] Stored preference overrides system

### 7.4 Dark Mode Visual Check

- [ ] Background is dark (#1a1a1a)
- [ ] Text is light (#f5f5f5)
- [ ] Cards have dark surface
- [ ] Links still visible/readable
- [ ] Form inputs readable
- [ ] Hero gradient updates

---

## 8. Carousel Tests

### 8.1 Main Carousels

**Best Work Carousel** (`/pages/portfolio/bestwork.html`):
- [ ] 5 slides present
- [ ] Auto-plays (2 second interval)
- [ ] Indicators visible at bottom
- [ ] Clicking indicator changes slide
- [ ] Prev/Next arrows work
- [ ] "View Artwork" buttons link correctly

**Projects Carousel** (`/pages/portfolio/projects.html`):
- [ ] 6 slides present
- [ ] Auto-plays
- [ ] Indicators work
- [ ] Navigation arrows work

### 8.2 Artwork Detail Carousels

| Page | Carousel ID | Slides |
|------|-------------|--------|
| Freelance | freelanceCarousel | 4 |
| JX Travel | jxtravelCarousel | 4 |
| Pearlie White | pearliewhiteCarousel | 3 |
| Rimbrew | rimbrewCarousel | 3 |
| Career Buddy | careerbuddyCarousel | 6 |
| Advertising | advertisingCarousel | 3 |
| 3D Design | threeDCarousel | 3 |
| Illustration | illustrationCarousel | 2 |
| Branding | brandingCarousel | 1 |
| Social Media | socialmediaCarousel | 2 |
| Packaging | packagingCarousel | 3 |

For each carousel:
- [ ] All images load
- [ ] Correct number of slides
- [ ] Indicators positioned at bottom
- [ ] Auto-play works
- [ ] Manual navigation works

---

## 9. Responsive Tests

### 9.1 Breakpoints to Test

| Breakpoint | Width | Key Changes |
|------------|-------|-------------|
| Desktop | ≥992px | Full nav, hover dropdowns |
| Tablet | 768-991px | Collapsed nav, click dropdowns |
| Mobile | 576-767px | Full-width buttons, smaller text |
| Small Mobile | ≤576px | Optimized spacing, 16px inputs |
| Very Small | ≤375px | Further text reduction |

### 9.2 Responsive Checklist

**Desktop (≥992px)**:
- [ ] Full horizontal navigation
- [ ] Dropdown on hover
- [ ] Side-by-side layouts

**Tablet (768-991px)**:
- [ ] Hamburger menu appears
- [ ] Cards stack or reduce columns
- [ ] Hero height reduced

**Mobile (≤576px)**:
- [ ] Buttons full width
- [ ] Single column layout
- [ ] Touch targets ≥48px
- [ ] No horizontal scroll
- [ ] Form inputs 16px font (prevents iOS zoom)

### 9.3 Touch Targets

- [ ] All buttons ≥48px height
- [ ] Nav links have adequate padding
- [ ] Form inputs have adequate height
- [ ] Carousel controls tappable

---

## 10. Asset & Resource Tests

### 10.1 Images

**Common Images**:
- [ ] Logo (`logo-yana.png`) loads
- [ ] Profile photo loads
- [ ] Resume image loads

**Portfolio Thumbnails** (all 9):
- [ ] dmybny-thumb.jpg
- [ ] jxtravel-thumb.jpg
- [ ] career-buddy-thumb.jpg
- [ ] advertising-thumb.jpg
- [ ] 3d-thumb.png
- [ ] illustration-thumb.png
- [ ] branding-thumb.png
- [ ] socmed-thumb.png
- [ ] packaging-thumb.png

**Carousel Images** (check DevTools for 404s):
- [ ] All freelance images (4)
- [ ] All jxtravel images (4)
- [ ] All pearliewhite images (4)
- [ ] All rimbrew images (4)
- [ ] All careerbuddy images (6+)
- [ ] All project category images

### 10.2 External Resources

- [ ] Bootstrap CSS loads (check Network tab)
- [ ] Bootstrap JS loads
- [ ] Bootstrap Icons load (icons display)
- [ ] Google Fonts load (Inter, Poppins render)

### 10.3 Downloads

- [ ] Creative Resume download works
- [ ] Formal Resume PDF download works

---

## 11. Link Tests

### 11.1 Navigation Links

Test from multiple pages (shallow and deep):

- [ ] Logo → index.html (redirect to about)
- [ ] About Me → /pages/about.html
- [ ] Skills → /pages/skills.html
- [ ] Best Work → /pages/portfolio/bestwork.html
- [ ] Projects → /pages/portfolio/projects.html
- [ ] Contact → /pages/contact.html
- [ ] All dropdown items link correctly

### 11.2 Footer Links

- [ ] All Quick Links work
- [ ] WhatsApp link opens WhatsApp
- [ ] Behance link opens Behance
- [ ] LinkedIn link opens LinkedIn
- [ ] Website Resume link works

### 11.3 Contact Links

- [ ] Email mailto: link works
- [ ] Phone tel: link works

### 11.4 Breadcrumb Links

- [ ] Home links work from all pages
- [ ] Section links work

---

## 12. Browser Compatibility

### 12.1 Desktop Browsers

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Safari (Mac)

### 12.2 Mobile Browsers

- [ ] Chrome (Android)
- [ ] Safari (iOS)
- [ ] Samsung Internet

### 12.3 Known Limitations

- IE11 not supported (CSS custom properties)
- Very old browsers may have issues

---

## 13. Quick Regression Checklist

### After ANY CSS Change

Run these tests:
```
[ ] npm run build (no errors)
[ ] Dev: Styles look correct
[ ] Prod: Styles look correct
[ ] Dark mode still works
[ ] Mobile layout not broken
```

### After ANY JS Change

```
[ ] npm run build (no errors)
[ ] Dev: No console errors
[ ] Prod: No console errors
[ ] Nav active state works (BOTH environments)
[ ] Form validation works
[ ] Theme toggle works
[ ] Mobile menu works
```

### After ANY HTML Change

```
[ ] npm run build (no errors)
[ ] Page renders correctly
[ ] Navigation present
[ ] Footer present
[ ] All links work
[ ] Images load
```

### Before ANY Deployment

```
[ ] npm run build succeeds
[ ] npm run preview - check all pages
[ ] Test on actual Vercel preview URL
[ ] Check in Incognito (no cache)
[ ] Test on mobile device
```

---

## Appendix: Console Commands for Testing

### Check for 404 Errors
Open DevTools → Network tab → Reload page → Filter by status code

### Check CSS Loading
```javascript
// In console
document.styleSheets
// Should show Bootstrap + styles.css
```

### Check Theme Storage
```javascript
localStorage.getItem('theme-preference')
// Returns 'light', 'dark', or null
```

### Check Active Nav
```javascript
document.querySelector('.nav-link.active')
// Should return the active nav element
```

### Force Clear Cache
```javascript
// Hard reload
location.reload(true)
// Or Ctrl+Shift+R / Cmd+Shift+R
```

---

## Version History

| Date | Change | Author |
|------|--------|--------|
| 2026-01-18 | Initial creation after nav active state bug | Claude |

---

**Remember**: When in doubt, test in PROD! Dev may work but prod may not.
