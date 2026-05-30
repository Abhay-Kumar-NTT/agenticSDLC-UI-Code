/**
 * PostgreSQL Database Connection Test
 *
 * Simple script to test database connectivity
 * Run: node test-db-connection.js
 */

import pkg from 'pg';
const { Client } = pkg;

// Database configuration
const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'agenticsdlc_dev',
  user: 'postgres',
  password: 'postgres', // CHANGE THIS to your postgres password
};

console.log('╔════════════════════════════════════════╗');
console.log('║   PostgreSQL Connection Test          ║');
console.log('╚════════════════════════════════════════╝');
console.log('');
console.log('Testing connection with:');
console.log(`  Host:     ${dbConfig.host}`);
console.log(`  Port:     ${dbConfig.port}`);
console.log(`  Database: ${dbConfig.database}`);
console.log(`  User:     ${dbConfig.user}`);
console.log('');

// Create client
const client = new Client(dbConfig);

async function testConnection() {
  try {
    console.log('⏳ Connecting to database...');

    // Connect
    await client.connect();
    console.log('✅ Connection established successfully!');
    console.log('');

    // Test query 1: Get current timestamp
    console.log('📊 Running test queries...');
    const timeResult = await client.query('SELECT NOW() as current_time');
    console.log(`✓ Current database time: ${timeResult.rows[0].current_time}`);

    // Test query 2: Get PostgreSQL version
    const versionResult = await client.query('SELECT version()');
    const version = versionResult.rows[0].version;
    console.log(`✓ PostgreSQL version: ${version.split(',')[0]}`);

    // Test query 3: Check if tables exist
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('');
    console.log('📋 Tables in database:');
    if (tablesResult.rows.length === 0) {
      console.log('  ⚠️  No tables found. Run schema.sql to create tables.');
    } else {
      tablesResult.rows.forEach(row => {
        console.log(`  ✓ ${row.table_name}`);
      });
    }

    // Test query 4: Count records in workflows table (if exists)
    try {
      const countResult = await client.query('SELECT COUNT(*) as count FROM workflows');
      console.log('');
      console.log(`📊 Workflow count: ${countResult.rows[0].count} workflows in database`);
    } catch (err) {
      console.log('');
      console.log('ℹ️  Workflows table not found or not yet created');
    }

    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('✅ DATABASE CONNECTION TEST PASSED!');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('Next steps:');
    console.log('1. If tables are missing, run: psql -U postgres -d agenticsdlc_dev -f db/schema.sql');
    console.log('2. Update backend/.env with your database credentials');
    console.log('3. Start the backend server: npm run dev');
    console.log('');

  } catch (error) {
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('❌ DATABASE CONNECTION TEST FAILED!');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('Error details:');
    console.log(`  Code:    ${error.code || 'N/A'}`);
    console.log(`  Message: ${error.message}`);
    console.log('');
    console.log('Common solutions:');
    console.log('');

    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Connection refused - PostgreSQL server not running');
      console.log('   Solutions:');
      console.log('   • Start PostgreSQL service:');
      console.log('     Windows: net start postgresql-x64-<version>');
      console.log('     Linux:   sudo systemctl start postgresql');
      console.log('     Mac:     brew services start postgresql');
      console.log('');
    } else if (error.code === '28P01') {
      console.log('❌ Authentication failed - Wrong password');
      console.log('   Solutions:');
      console.log('   • Update the password in this script');
      console.log('   • Reset postgres password:');
      console.log('     psql -U postgres');
      console.log('     ALTER USER postgres PASSWORD \'new_password\';');
      console.log('');
    } else if (error.code === '3D000') {
      console.log('❌ Database does not exist');
      console.log('   Solutions:');
      console.log('   • Create the database:');
      console.log('     psql -U postgres');
      console.log('     CREATE DATABASE agenticsdlc_dev;');
      console.log('     \\q');
      console.log('');
    } else if (error.code === 'ENOTFOUND') {
      console.log('❌ Host not found');
      console.log('   Solutions:');
      console.log('   • Check if host is correct (should be "localhost")');
      console.log('   • Verify PostgreSQL is installed');
      console.log('');
    } else {
      console.log('❌ Unexpected error occurred');
      console.log('   • Check PostgreSQL installation');
      console.log('   • Verify port 5432 is not blocked by firewall');
      console.log('   • Check PostgreSQL logs for more details');
      console.log('');
    }

    console.log('Need help? Check:');
    console.log('• PostgreSQL logs (location varies by OS)');
    console.log('• Port 5432 is available: netstat -an | findstr 5432');
    console.log('• PostgreSQL service status');
    console.log('');

  } finally {
    // Close connection
    await client.end();
    console.log('🔌 Connection closed');
    console.log('');
  }
}

// Run the test
testConnection();
