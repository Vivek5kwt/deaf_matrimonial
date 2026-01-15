#!/usr/bin/env node
/**
 * Metro bundler starter - Direct Metro call, bypasses React Native CLI
 * This avoids the Node.js 20 compatibility issue entirely
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const args = process.argv.slice(2);
const resetCache = args.includes('--reset-cache');

// Find Metro in node_modules
const metroPaths = [
  path.join(projectRoot, 'node_modules', 'metro', 'src', 'cli.js'),
  path.join(projectRoot, 'node_modules', '@react-native-community', 'cli-plugin-metro', 'node_modules', 'metro', 'src', 'cli.js'),
  path.join(projectRoot, 'node_modules', '@react-native', 'community-cli-plugin', 'node_modules', 'metro', 'src', 'cli.js'),
  path.join(projectRoot, 'node_modules', 'react-native', 'node_modules', 'metro', 'src', 'cli.js'),
];

let metroPath = null;
for (const mp of metroPaths) {
  if (fs.existsSync(mp)) {
    metroPath = mp;
    break;
  }
}

if (!metroPath) {
  console.error('Metro bundler not found in node_modules.');
  console.error('Please run: npm install --legacy-peer-deps');
  console.error('\nAlternatively, try using the React Native CLI directly:');
  console.error('  npx react-native start');
  process.exit(1);
}

// Metro config path
const metroConfigPath = path.join(projectRoot, 'metro.config.js');

// Build Metro command
// Metro CLI uses 'serve' command, not 'start'
const metroArgs = [
  metroPath,
  'serve',
  '--project-roots',
  projectRoot
];

if (fs.existsSync(metroConfigPath)) {
  metroArgs.push('--config', metroConfigPath);
}

if (resetCache) {
  metroArgs.push('--reset-cache');
}

console.log('Starting Metro bundler...');
console.log('Using Metro at:', metroPath);

const metroProcess = spawn('node', metroArgs, {
  stdio: 'inherit',
  shell: true,
  cwd: projectRoot,
  env: { ...process.env }
});

metroProcess.on('error', (err) => {
  console.error('Failed to start Metro:', err.message);
  console.error('\nTroubleshooting:');
  console.error('1. Make sure node_modules is installed: npm install --legacy-peer-deps');
  console.error('2. Try: npm run start:ps1 (PowerShell script)');
  process.exit(1);
});

metroProcess.on('exit', (code) => {
  process.exit(code || 0);
});
