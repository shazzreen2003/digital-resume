# Resume Website - Shazzreen Elyana

A modern, responsive resume website built with HTML5, Bootstrap 5, and vanilla JavaScript. Designed specifically for graphic designers to showcase their portfolio and land job opportunities.

## Features

- **Fully Responsive** - Works perfectly on desktop, tablet, and mobile devices
- **Modern Design** - Clean, professional aesthetic with customizable color schemes
- **Multi-Page Layout** - Separate pages for Home, About, Portfolio, and Contact
- **Contact Form** - Validated contact form with real-time error checking
- **Industry Standards** - Semantic HTML5, accessible, SEO-friendly code
- **Easy to Customize** - Well-commented code with CSS variables for quick customization
- **Fast Loading** - Optimized with Bootstrap CDN and minimal custom code

## File Structure

```
resume-website/
├── index.html              # Landing/Home page
├── about.html              # Biography, education, experience, skills
├── portfolio.html          # Projects and portfolio showcase
├── contact.html            # Contact form and information
├── css/
│   └── styles.css         # Custom styles and variables
├── js/
│   └── script.js          # Form validation and interactivity
├── images/
│   ├── hero-bg.jpg        # (Add your hero background image)
│   ├── profile.jpg        # (Add your profile photo)
│   └── projects/          # (Add your project images)
└── assets/
    └── resume.pdf         # (Add your resume/CV PDF)
```

## Getting Started

### 1. Download/Clone the Project

Download all files and folders to your computer, maintaining the folder structure.

### 2. Add Your Content

#### Replace Placeholder Images

- Add your profile photo to `images/profile.jpg`
- Add a hero background image to `images/hero-bg.jpg`
- Add project images to `images/projects/`
- Update the image paths in the HTML files

#### Update Text Content

Open each HTML file and replace the placeholder content with your own:

- **index.html**: Update hero text, stats, featured work
- **about.html**: Update biography, education, work experience, skills
- **portfolio.html**: Update project descriptions and images
- **contact.html**: Update contact information (email, phone, location)

#### Add Your Resume

- Save your resume as PDF
- Place it in `assets/resume.pdf`
- The download buttons will automatically link to it

### 3. Customize the Design

#### Change Color Scheme

Open `css/styles.css` and find the `:root` section (lines 11-25). You'll see three color scheme options:

**Option 1: Minimalist (Default - Charcoal + Coral)**
```css
--primary-color: #2d3436;
--secondary-color: #636e72;
--accent-color: #ff7675;
--accent-hover: #ff6b6b;
```

**Option 2: Creative (Deep Purple + Gold)**
```css
--primary-color: #6c5ce7;
--secondary-color: #a29bfe;
--accent-color: #fdcb6e;
--accent-hover: #feca57;
```

**Option 3: Modern (Dark Navy + Teal)**
```css
--primary-color: #0a3d62;
--secondary-color: #3c6382;
--accent-color: #38ada9;
--accent-hover: #079992;
```

To change color scheme, simply comment out the current option and uncomment your preferred option.

#### Change Fonts

The site uses Google Fonts (Inter & Poppins). To change fonts:

1. Go to [Google Fonts](https://fonts.google.com/)
2. Select your preferred fonts
3. Copy the `<link>` tag
4. Replace the font link in the `<head>` section of each HTML file
5. Update the font variables in `css/styles.css`:

```css
--font-primary: 'YourFont', sans-serif;
--font-heading: 'YourHeadingFont', sans-serif;
```

### 4. Update Social Media Links

In the footer of each HTML file, update these placeholder links:

```html
<a href="https://wa.me/YOUR_PHONE_NUMBER">WhatsApp</a>
<a href="https://www.behance.net/YOUR_USERNAME">Behance</a>
<a href="https://dribbble.com/YOUR_USERNAME">Dribbble</a>
<a href="https://www.linkedin.com/in/YOUR_USERNAME">LinkedIn</a>
```

Replace with your actual social media profiles.

## Testing Your Website

### Local Testing

1. Simply double-click any `.html` file to open it in your web browser
2. Navigate between pages using the navigation menu
3. Test the contact form - fill it out and click Submit
4. Resize your browser window to test responsiveness
5. Test on mobile devices or use browser DevTools (F12) to simulate mobile

### Mobile Responsiveness Testing

The website is fully optimized for mobile devices! Test it on:

**Using Browser DevTools (Chrome/Edge):**
1. Press **F12** to open Developer Tools
2. Click the **Toggle Device Toolbar** icon (or press Ctrl+Shift+M)
3. Select different devices: iPhone, iPad, Samsung Galaxy, etc.
4. Test in both portrait and landscape orientations

**Responsive Breakpoints:**
- **Desktop**: 1200px+ (full layout)
- **Laptop**: 992px - 1199px (adjusted layout)
- **Tablet**: 768px - 991px (stacked columns)
- **Mobile**: 576px - 767px (mobile-optimized)
- **Small Mobile**: 375px - 575px (compact view)
- **Very Small**: < 375px (minimal layout)

**Mobile Features:**
- ✅ Touch-friendly buttons (48px minimum height)
- ✅ Full-width buttons on mobile for easy tapping
- ✅ Responsive navigation with hamburger menu
- ✅ Optimized font sizes (prevents iOS zoom)
- ✅ Form inputs sized for mobile (16px font)
- ✅ Landscape mode optimization
- ✅ iPhone notch/safe area support
- ✅ Fast image loading (lazy loading)
- ✅ Smooth touch scrolling

**What to Test on Mobile:**
1. Navigation menu (hamburger icon)
2. All buttons are easy to tap
3. Forms are easy to fill out
4. Images load properly
5. Text is readable without zooming
6. Cards and layout look good
7. Footer links are accessible

### Browser Compatibility

The website works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari (iOS and macOS)
- Opera
- Samsung Internet (Android)

**Mobile Browser Support:**
- iOS Safari 12+
- Chrome Mobile
- Firefox Mobile
- Samsung Internet

## Connecting the Contact Form

Currently, the contact form validates input but doesn't send emails. To make it functional, choose one of these options:

### Option 1: Formspree (Recommended - Free & Easy)

1. Go to [formspree.io](https://formspree.io/)
2. Sign up for a free account
3. Create a new form
4. Copy your form endpoint URL
5. In `js/script.js`, find the `handleFormSubmission` function (around line 199)
6. Uncomment and update the fetch code:

```javascript
fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
```

### Option 2: EmailJS

1. Go to [emailjs.com](https://www.emailjs.com/)
2. Sign up and configure your email service
3. Add the EmailJS SDK to your HTML
4. Follow their documentation to connect the form

### Option 3: Netlify Forms (if hosting on Netlify)

Add `netlify` attribute to your form tag:

```html
<form id="contactForm" netlify>
```

## Deployment (Publishing Your Website)

### Option 1: GitHub Pages (Free & Recommended)

1. Create a GitHub account at [github.com](https://github.com/)
2. Create a new repository named `your-username.github.io`
3. Upload all your website files
4. Go to Settings > Pages
5. Select the main branch as source
6. Your site will be live at `https://your-username.github.io`

### Option 2: Netlify (Free)

1. Go to [netlify.com](https://www.netlify.com/)
2. Sign up for a free account
3. Drag and drop your website folder
4. Your site will be live instantly with a free subdomain
5. You can connect a custom domain later

### Option 3: Vercel (Free)

1. Go to [vercel.com](https://vercel.com/)
2. Sign up with GitHub
3. Import your repository
4. Deploy with one click

### Custom Domain (Optional)

After deploying, you can purchase a custom domain from:
- Namecheap
- GoDaddy
- Google Domains

Then connect it to your hosting platform (all provide free SSL certificates).

## Customization Tips

### Adding More Projects to Portfolio

In `portfolio.html`, copy this card structure and modify:

```html
<div class="col-lg-4 col-md-6">
  <div class="card">
    <img src="images/projects/your-project.jpg" class="card-img-top" alt="Project Name">
    <div class="card-body">
      <h5 class="card-title">Your Project Name</h5>
      <p class="card-text">Project description goes here.</p>
      <div class="mb-2">
        <span class="badge badge-primary">Category</span>
        <span class="badge bg-secondary">Type</span>
      </div>
    </div>
  </div>
</div>
```

### Changing Stats Numbers

In `index.html`, update the stats section:

```html
<span class="stat-number">50+</span>
<span class="stat-label">Projects Completed</span>
```

### Modifying Skills

In `about.html`, find the skills section and update:

```html
<div class="skill-item">
  <div class="skill-name">
    <span>Skill Name</span>
    <span>90%</span>
  </div>
  <div class="progress">
    <div class="progress-bar" style="width: 90%"></div>
  </div>
</div>
```

## Troubleshooting

### Images Not Showing

- Check that image files are in the correct folder
- Verify file names match exactly (case-sensitive)
- Make sure image paths in HTML are correct
- Use relative paths (e.g., `images/photo.jpg` not `C:/Users/...`)

### Form Not Validating

- Check that `js/script.js` is loaded correctly
- Open browser console (F12) to check for JavaScript errors
- Ensure all form fields have the correct `id` attributes

### Styling Issues

- Clear your browser cache (Ctrl+F5 or Cmd+Shift+R)
- Check that `css/styles.css` is linked in all HTML files
- Verify Bootstrap CDN links are working

### Mobile Menu Not Working

- Ensure Bootstrap JavaScript is loaded
- Check that the navbar has the correct Bootstrap classes
- Clear cache and reload

## Browser Developer Tools

To inspect and debug your website:

1. Press **F12** (or Cmd+Option+I on Mac)
2. Use the **Elements** tab to inspect HTML/CSS
3. Use the **Console** tab to check for JavaScript errors
4. Use the **Device Toolbar** (Ctrl+Shift+M) to test mobile views

## Best Practices for Job Seeking

1. **Keep Content Updated** - Regularly update your portfolio with new projects
2. **Professional Photos** - Use high-quality images of yourself and your work
3. **Clear Contact Info** - Make it easy for employers to reach you
4. **Fast Loading** - Optimize images (use tools like TinyPNG)
5. **Proofread** - Check for spelling and grammar errors
6. **SEO** - Update meta descriptions with relevant keywords
7. **Analytics** - Add Google Analytics to track visitors
8. **Custom Domain** - Consider getting a professional domain (yourname.com)

## Resources

### Learning Resources

- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/)
- [W3Schools HTML/CSS](https://www.w3schools.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

### Free Tools

- [TinyPNG](https://tinypng.com/) - Compress images
- [Google Fonts](https://fonts.google.com/) - Free fonts
- [Unsplash](https://unsplash.com/) - Free stock photos
- [Bootstrap Icons](https://icons.getbootstrap.com/) - Free icons

### Testing Tools

- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [W3C Validator](https://validator.w3.org/) - Validate HTML
- [PageSpeed Insights](https://pagespeed.web.dev/) - Test performance

## Support

If you need help or have questions:

1. Check the troubleshooting section above
2. Review the comments in the code files
3. Search for solutions on [Stack Overflow](https://stackoverflow.com/)
4. Consult Bootstrap 5 documentation

## License

This project is free to use for personal and commercial purposes. Feel free to customize it to make it your own!

## Credits

- **Bootstrap 5** - Frontend framework
- **Bootstrap Icons** - Icon library
- **Google Fonts** - Typography (Inter & Poppins)

---

**Good luck with your job search!**

Remember: Your portfolio is often the first impression employers have of you. Keep it updated, professional, and showcase your best work!
