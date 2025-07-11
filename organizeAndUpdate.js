const fs = require('fs');
const path = require('path');

// Setup folders
const root = 'public';
const imagesDir = path.join(root, 'assets', 'images');
const pdfDir = path.join(root, 'assets', 'pdf');
const cssDir = path.join(root, 'css');
const pagesDir = path.join(root, 'pages');

// Ensure directories exist
[imagesDir, pdfDir, cssDir, pagesDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Files to keep in root
const keepInRoot = ['index.html', 'sitemap.xml'];
const isGoogleVerify = filename => filename.startsWith('google') && filename.endsWith('.html');

// File movers
function moveFile(filename, destDir) {
  const srcPath = path.join(root, filename);
  const destPath = path.join(destDir, filename);
  fs.renameSync(srcPath, destPath);
  console.log(`🔀 Moved: ${filename} → ${destDir}`);
}

// Scan public/
fs.readdirSync(root).forEach(filename => {
  const ext = path.extname(filename).toLowerCase();
  const filePath = path.join(root, filename);

  if (fs.statSync(filePath).isFile()) {
    if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
      moveFile(filename, imagesDir);
    } else if (ext === '.pdf') {
      moveFile(filename, pdfDir);
    } else if (ext === '.css') {
      moveFile(filename, cssDir);
    } else if (ext === '.html' && !keepInRoot.includes(filename) && !isGoogleVerify(filename)) {
      moveFile(filename, pagesDir);
    }
  }
});

// Function to update HTML paths
function updatePaths(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Update image src paths
  content = content.replace(/src="([^"]+\.(png|jpg|jpeg|gif))"/gi, 'src="assets/images/$1"');

  // Update CSS href paths
  content = content.replace(/href="([^"]+\.css)"/gi, 'href="css/$1"');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Updated paths in: ${filePath}`);
}

// Update HTML files
updatePaths(path.join(root, 'index.html'));
fs.readdirSync(pagesDir).forEach(filename => {
  if (filename.endsWith('.html')) {
    updatePaths(path.join(pagesDir, filename));
  }
});
