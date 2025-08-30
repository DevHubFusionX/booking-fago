// Validation script for booking system
const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Booking System Files...\n');

// Required files for booking process
const requiredFiles = [
  // Backend files
  'backend/server.js',
  'backend/database.js',
  
  // Frontend pages
  'frontend/pages/index.html',
  'frontend/pages/hotels.html',
  'frontend/pages/hotel-details.html',
  'frontend/pages/booking.html',
  'frontend/pages/dashboard.html',
  'frontend/pages/auth.html',
  
  // Components
  'frontend/components/header.js',
  'frontend/components/hotel-card.js',
  
  // JavaScript files
  'frontend/public/js/lazy-loading.js',
  'frontend/public/js/auth-navbar.js',
  
  // CSS files
  'frontend/public/css/style.css',
  'frontend/public/css/hotel-details.css',
  'frontend/public/css/room-selection.css',
  'frontend/public/css/booking.css',
  'frontend/public/css/dashboard.css',
  'frontend/public/css/skeleton.css',
  'frontend/public/css/auth-navbar.css',
  
  // Configuration
  'package.json',
  '.env'
];

let missingFiles = [];
let existingFiles = [];

console.log('📁 Checking required files...');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    existingFiles.push(file);
    console.log(`✅ ${file}`);
  } else {
    missingFiles.push(file);
    console.log(`❌ ${file} - MISSING`);
  }
});

console.log(`\n📊 Summary:`);
console.log(`✅ Found: ${existingFiles.length} files`);
console.log(`❌ Missing: ${missingFiles.length} files`);

if (missingFiles.length > 0) {
  console.log(`\n🚨 Missing files that may cause issues:`);
  missingFiles.forEach(file => console.log(`   - ${file}`));
}

// Check package.json dependencies
console.log(`\n📦 Checking dependencies...`);
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['express', 'mongodb', 'bcryptjs', 'express-session', 'cors', 'dotenv'];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`❌ ${dep}: MISSING`);
    }
  });
} catch (error) {
  console.log(`❌ Error reading package.json: ${error.message}`);
}

// Check .env file
console.log(`\n🔐 Checking environment variables...`);
try {
  const envContent = fs.readFileSync('.env', 'utf8');
  const requiredEnvVars = ['PAYSTACK_SECRET_KEY', 'PAYSTACK_PUBLIC_KEY', 'PORT'];
  
  requiredEnvVars.forEach(envVar => {
    if (envContent.includes(envVar)) {
      console.log(`✅ ${envVar}: Present`);
    } else {
      console.log(`❌ ${envVar}: MISSING`);
    }
  });
} catch (error) {
  console.log(`❌ Error reading .env file: ${error.message}`);
}

console.log(`\n🎯 Booking Flow Validation Complete!`);

if (missingFiles.length === 0) {
  console.log(`\n🎉 All required files are present!`);
  console.log(`\n🚀 To test the booking system:`);
  console.log(`   1. Run: npm install`);
  console.log(`   2. Run: npm run dev`);
  console.log(`   3. Visit: http://localhost:3000`);
  console.log(`   4. Test the complete booking flow`);
} else {
  console.log(`\n⚠️  Some files are missing. The booking system may not work properly.`);
}

console.log(`\n📋 Booking Flow Steps to Test:`);
console.log(`   1. 🏠 Homepage → Search hotels`);
console.log(`   2. 🏨 Hotels page → Browse available hotels`);
console.log(`   3. 🔍 Hotel details → Select room and dates`);
console.log(`   4. 📝 Booking page → Enter guest details`);
console.log(`   5. 💳 Payment → Complete payment via Paystack`);
console.log(`   6. ✅ Confirmation → View booking confirmation`);
console.log(`   7. 📊 Dashboard → View booking history`);