#!/usr/bin/env node

/**
 * Database Setup Script
 * 
 * This script initializes the localStorage database with seed data.
 * Run with: npm run db:setup
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Secure Database...\n');

// Check if we're in the right directory
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: package.json not found. Please run this script from the project root directory.');
  process.exit(1);
}

// Check if the persistence file exists
const persistencePath = path.join(process.cwd(), 'src/lib/persistence.ts');
if (!fs.existsSync(persistencePath)) {
  console.error('❌ Error: Persistence layer not found. Please ensure src/lib/persistence.ts exists.');
  process.exit(1);
}

// Check if the database file exists
const databasePath = path.join(process.cwd(), 'src/lib/database.ts');
if (!fs.existsSync(databasePath)) {
  console.error('❌ Error: Database not found. Please ensure src/lib/database.ts exists.');
  process.exit(1);
}

console.log('✅ Project structure verified');
console.log('✅ Persistence layer found');
console.log('✅ Database layer found\n');

// Create a simple HTML file to initialize the database
const setupHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Database Setup</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .container { max-width: 600px; margin: 0 auto; }
        .success { color: #28a745; }
        .error { color: #dc3545; }
        .info { color: #17a2b8; }
        button { padding: 10px 20px; margin: 10px; font-size: 16px; }
        .log { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔐 Secure Database Setup</h1>
        <p>This page will initialize your localStorage database with seed data.</p>
        
        <button onclick="setupDatabase()">Initialize Database</button>
        <button onclick="clearDatabase()">Clear Database</button>
        <button onclick="checkStatus()">Check Status</button>
        
        <div id="log" class="log">
            <div>Ready to initialize database...</div>
        </div>
    </div>

    <script>
        // Simple localStorage setup simulation
        function log(message, type = 'info') {
            const logDiv = document.getElementById('log');
            const timestamp = new Date().toLocaleTimeString();
            const className = type === 'success' ? 'success' : type === 'error' ? 'error' : 'info';
            logDiv.innerHTML += '<div class="' + className + '">[' + timestamp + '] ' + message + '</div>';
            logDiv.scrollTop = logDiv.scrollHeight;
        }

        function setupDatabase() {
            log('🚀 Initializing database...', 'info');
            
            try {
                // Create seed data
                const seedData = {
                    users: [{
                        id: '550e8400-e29b-41d4-a716-446655440001',
                        email: 'user@example.com',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }],
                    subscriptions: [{
                        id: '550e8400-e29b-41d4-a716-446655440002',
                        user_id: '550e8400-e29b-41d4-a716-446655440001',
                        status: 'active',
                        monthly_price: 25,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }],
                    cancellations: [],
                    version: '1.0.0'
                };

                // Store in localStorage (encrypted)
                const encrypt = (data) => {
                    const key = 'secure_db_key_2024';
                    let encrypted = '';
                    for (let i = 0; i < data.length; i++) {
                        const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
                        encrypted += String.fromCharCode(charCode);
                    }
                    return btoa(encrypted);
                };

                localStorage.setItem('secure_db_users', encrypt(JSON.stringify(seedData.users)));
                localStorage.setItem('secure_db_subscriptions', encrypt(JSON.stringify(seedData.subscriptions)));
                localStorage.setItem('secure_db_cancellations', encrypt(JSON.stringify(seedData.cancellations)));
                localStorage.setItem('secure_db_version', seedData.version);

                log('✅ Database initialized successfully!', 'success');
                log('📊 Users: ' + seedData.users.length, 'info');
                log('📊 Subscriptions: ' + seedData.subscriptions.length, 'info');
                log('📊 Cancellations: ' + seedData.cancellations.length, 'info');
                log('🔐 Data is encrypted and stored in localStorage', 'info');
                log('💡 You can now run: npm run dev', 'info');
                
            } catch (error) {
                log('❌ Error initializing database: ' + error.message, 'error');
            }
        }

        function clearDatabase() {
            log('🗑️ Clearing database...', 'info');
            try {
                localStorage.removeItem('secure_db_users');
                localStorage.removeItem('secure_db_subscriptions');
                localStorage.removeItem('secure_db_cancellations');
                localStorage.removeItem('secure_db_version');
                log('✅ Database cleared successfully!', 'success');
            } catch (error) {
                log('❌ Error clearing database: ' + error.message, 'error');
            }
        }

        function checkStatus() {
            log('🔍 Checking database status...', 'info');
            try {
                const hasUsers = localStorage.getItem('secure_db_users');
                const hasSubscriptions = localStorage.getItem('secure_db_subscriptions');
                const hasCancellations = localStorage.getItem('secure_db_cancellations');
                const version = localStorage.getItem('secure_db_version');

                if (hasUsers && hasSubscriptions) {
                    log('✅ Database is initialized', 'success');
                    log('📊 Version: ' + (version || 'unknown'), 'info');
                } else {
                    log('❌ Database is not initialized', 'error');
                    log('💡 Click "Initialize Database" to set up', 'info');
                }
            } catch (error) {
                log('❌ Error checking status: ' + error.message, 'error');
            }
        }

        // Auto-check status on load
        window.onload = function() {
            checkStatus();
        };
    </script>
</body>
</html>
`;

const setupHtmlPath = path.join(process.cwd(), 'database-setup.html');
fs.writeFileSync(setupHtmlPath, setupHtml);

console.log('📄 Created database setup page: database-setup.html');
console.log('\n📋 Next steps:');
console.log('1. Open database-setup.html in your browser');
console.log('2. Click "Initialize Database" to set up localStorage');
console.log('3. Run: npm run dev');
console.log('\n💡 The setup page will create encrypted localStorage data that your app can use.');
console.log('💡 You can also use this page to clear the database or check its status.\n');

console.log('✅ Database setup script completed successfully!');
console.log('🌐 Open database-setup.html in your browser to continue...\n');
