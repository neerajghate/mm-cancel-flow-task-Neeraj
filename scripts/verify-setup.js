
console.log('🔍 Verifying local database setup...');

// Check if required files exist
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'src/lib/localDb.ts',
  'src/services/databaseService.ts',
  'src/hooks/useCancelFlow.ts'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} (missing)`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('\n🎉 All required files are present!');
  console.log('\n📋 Next steps:');
  console.log('   1. npm run dev (to start the application)');
  console.log('   2. Open browser and test the cancellation flow');
  console.log('   3. Check browser console for database operations');
  console.log('   4. Data persists in localStorage between sessions');
} else {
  console.log('\n❌ Some required files are missing. Please check the setup.');
  process.exit(1);
}
