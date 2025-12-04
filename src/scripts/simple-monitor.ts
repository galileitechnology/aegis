// src/scripts/simple-monitor.ts
import { Pool } from 'pg';
import axios from 'axios';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Script directory:', __dirname);

// Load environment variables from the correct location
// Since this file is in src/scripts, and .env is in src/
const envPath = path.join(__dirname, '../.env'); // Go up one level from scripts to src
console.log('Looking for .env at:', envPath);

dotenv.config({ path: envPath });

// Debug: Show what DATABASE_URL was loaded
console.log('DATABASE_URL loaded:', 
  process.env.DATABASE_URL ? 
    process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':****@') : 
    'NOT FOUND'
);

// Also try .env.local if it exists
const envLocalPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envLocalPath)) {
  console.log('Found .env.local, loading it too...');
  dotenv.config({ path: envLocalPath });
  console.log('DATABASE_URL after .env.local:', 
    process.env.DATABASE_URL ? 
      process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':****@') : 
      'STILL NOT FOUND'
  );
}

// Check if DATABASE_URL is now available
if (!process.env.DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL is still not set!');
  console.error('Current directory:', __dirname);
  console.error('Available .env files in src/:');
  
  try {
    const files = fs.readdirSync(path.join(__dirname, '..'));
    const envFiles = files.filter(f => f.startsWith('.env'));
    console.error('Found:', envFiles);
  } catch (err: any) {
    console.error('Could not read directory:', err.message);
  }
  
  console.error('\nPlease ensure DATABASE_URL is set in src/.env');
  process.exit(1);
}

console.log('✅ Database connection string found');

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

async function checkAll() {
  console.log(`[${new Date().toISOString()}] Checking URLs...`);
  
  const { rows } = await pool.query(
    "SELECT * FROM url_monitor WHERE is_monitoring_active = true"
  );
  
  for (const monitor of rows) {
    await checkOne(monitor);
    await sleep(1000); // Wait 1 second between checks
  }
  
  console.log('Done!');
}

async function checkOne(monitor: any) {
  try {
    const start = Date.now();
    const response = await axios.head(monitor.url, { timeout: 10000 });
    const time = Date.now() - start;
    
    const isUp = response.status < 400;
    
    await pool.query(
      `UPDATE url_monitor SET 
        current_status = $1,
        last_status_code = $2,
        last_response_time_ms = $3,
        last_checked_at = NOW()
       WHERE id = $4`,
      [isUp ? 'up' : 'down', response.status, time, monitor.id]
    );
    
    console.log(`✓ ${monitor.url}: ${response.status} (${time}ms)`);
  } catch (error) {
    await pool.query(
      `UPDATE url_monitor SET 
        current_status = 'error',
        last_checked_at = NOW()
       WHERE id = $1`,
      [monitor.id]
    );
    
    console.log(`✗ ${monitor.url}: ERROR`);
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('\nShutting down...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\nShutting down...');
  await pool.end();
  process.exit(0);
});

// Run checks
checkAll();
setInterval(checkAll, 5 * 60 * 1000);

console.log('🚀 URL Monitor started. Checking every 5 minutes.');
console.log('Press Ctrl+C to stop.\n');