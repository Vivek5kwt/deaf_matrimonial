const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');

function findDynamicViewColorIssues(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Look for these specific problematic patterns:
  const patterns = [
    // Pattern 1: Conditional styles with color
    /<View[^>]*style=\{.*\?.*\{.*color:[^}]*\}.*:.*\{[^}]*\}/,
    
    // Pattern 2: Spread props that might contain color
    /<View[^>]*\{\.\.\.[^>]*color[^>]*>/,
    
    // Pattern 3: Style arrays with color
    /<View[^>]*style=\{\[[^]]*\{[^}]*color:[^}]*\}[^]]*\]/,
    
    // Pattern 4: Dynamic style assignment
    /<View[^>]*style=\{.*\bcolor\b[^}]*\}/
  ];
  
  patterns.forEach((pattern, i) => {
    if (pattern.test(content)) {
      console.log(`🚨 Pattern ${i+1} detected in ${filePath}`);
      
      // Show the matching lines
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (pattern.test(line)) {
          console.log(`   → Line ${index + 1}: ${line.trim()}`);
        }
      });
      console.log('');
    }
  });
}

function scanForDynamicPatterns(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanForDynamicPatterns(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.tsx')) {
      findDynamicViewColorIssues(fullPath);
    }
  });
}

console.log('🔍 Scanning for dynamic View color patterns...\n');
scanForDynamicPatterns(SRC_DIR);
console.log('✅ Dynamic pattern scan complete!');