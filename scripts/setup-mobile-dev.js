#!/usr/bin/env node

/**
 * Development setup script for mobile AR access
 * Automatically detects network IP and updates .env.local
 */

const os = require('os');
const fs = require('fs');
const path = require('path');

function getNetworkIP() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      // Skip over non-IPv4 and internal (localhost) addresses
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  
  return null;
}

function updateEnvLocal(ip) {
  const envLocalPath = path.join(process.cwd(), '.env.local');
  const baseUrl = `http://${ip}:3000`;
  
  let content = '';
  
  if (fs.existsSync(envLocalPath)) {
    content = fs.readFileSync(envLocalPath, 'utf8');
  }
  
  // Check if NEXT_PUBLIC_BASE_URL is already set (commented or uncommented)
  if (content.includes('NEXT_PUBLIC_BASE_URL=')) {
    // Update existing line (handle both commented and uncommented)
    content = content.replace(
      /#?\s*NEXT_PUBLIC_BASE_URL=.*/,
      `NEXT_PUBLIC_BASE_URL=${baseUrl}`
    );
  } else {
    // Add new line
    content += `\n# Auto-detected IP for mobile development\nNEXT_PUBLIC_BASE_URL=${baseUrl}\n`;
  }
  
  fs.writeFileSync(envLocalPath, content);
  return baseUrl;
}

function main() {
  console.log('🔍 Detecting network IP for mobile development...\n');
  
  const ip = getNetworkIP();
  
  if (!ip) {
    console.log('❌ Could not detect network IP address.');
    console.log('Please manually set NEXT_PUBLIC_BASE_URL in .env.local');
    console.log('Example: NEXT_PUBLIC_BASE_URL=http://192.168.1.100:3000');
    return;
  }
  
  const baseUrl = updateEnvLocal(ip);
  
  console.log('✅ Network IP detected and configured!');
  console.log(`📱 Your mobile-accessible URL: ${baseUrl}`);
  console.log(`🔧 Updated .env.local with: NEXT_PUBLIC_BASE_URL=${baseUrl}`);
  console.log('\n📋 Next steps:');
  console.log('1. Make sure your phone is on the same WiFi network');
  console.log('2. Start the development server: npm run dev');
  console.log('3. Visit the AR page on desktop to see the QR code');
  console.log('4. Scan the QR code with your mobile device');
  console.log('\n⚠️  Note: Restart your development server for changes to take effect');
}

if (require.main === module) {
  main();
}

module.exports = { getNetworkIP, updateEnvLocal };
