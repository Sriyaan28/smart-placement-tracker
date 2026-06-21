const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const topLevelDirs = ['api', 'assets', 'components', 'context', 'hooks', 'pages', 'routes', 'utils'];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      // Calculate depth from src.
      // e.g. src/pages/student/ApplicationDetails.jsx has depth 3 (pages, student, file)
      const relativePath = path.relative(srcDir, fullPath);
      const parts = relativePath.split(path.sep);
      
      // If the file is inside src/dir/subdir/file.jsx, then depth is 2 dirs
      if (parts.length === 3) {
        // It's 2 levels deep (e.g. pages/student/...)
        // It needs `../../` to reach top level
        // Currently it might have `../topLevelDir`
        for (const tld of topLevelDirs) {
          const regex1 = new RegExp(`from (['"])\\.\\.\\/${tld}\\/`, 'g');
          content = content.replace(regex1, `from $1../../${tld}/`);
          
          const regex2 = new RegExp(`import (['"])\\.\\.\\/${tld}\\/`, 'g');
          content = content.replace(regex2, `import $1../../${tld}/`);
        }
        
        // Also if it imports from same original dir, e.g. `./CompanyContext`
        // Wait, I already changed `./hooks/use...` to `./hooks/student/...`
        // I should just fix `../` that are still pointing to top level incorrectly.
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

processDirectory(srcDir);
