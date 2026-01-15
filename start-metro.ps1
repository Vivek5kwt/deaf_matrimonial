# Metro bundler starter - PowerShell script for Windows/Node.js 20
# Workaround for React Native CLI Node.js 20 compatibility issue
# This script patches the React Native CLI before it runs

param(
    [switch]$ResetCache
)

# Set environment variables
$env:NODE_OPTIONS = "--no-warnings --no-deprecation"

# Create a temporary patched CLI wrapper
$patchScript = @"
const util = require('util');
const originalInspect = util.inspect;
util.inspect = function(obj, options) {
  if (Array.isArray(options)) {
    return originalInspect(obj, { colors: true });
  }
  return originalInspect(obj, options);
};
if (util.styleText) {
  const originalStyleText = util.styleText;
  util.styleText = function(format, text) {
    if (Array.isArray(format)) {
      format = format[0] || 'reset';
    }
    try {
      return originalStyleText(format, text);
    } catch (err) {
      return text;
    }
  };
}
require('react-native/cli.js');
"@

$patchScript | Out-File -FilePath "temp-cli-patch.js" -Encoding UTF8

Write-Host "Starting Metro bundler..." -ForegroundColor Green

if ($ResetCache) {
    node temp-cli-patch.js start --reset-cache
} else {
    node temp-cli-patch.js start
}

$exitCode = $LASTEXITCODE
Remove-Item "temp-cli-patch.js" -ErrorAction SilentlyContinue
exit $exitCode
