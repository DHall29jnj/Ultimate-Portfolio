const fs = require('fs');
const path = require('path');

const baseUrl = 'dametrius-hall-portfolio.netlify.app';
const publicDir = './public';
const pagesDir = path.join(publicDir, 'pages');

let urls = [`${baseUrl}/`];

// Add each HTML page from /pages
fs.readdirSync(pagesDir).forEach(file => {
  if (file.endsWith('.html')) {
    urls.push(`${baseUrl}/pages/${file}`);
  }
});

// Build XML content
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>
`;

// Save it
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8');
console.log('✅ sitemap.xml generated!');
