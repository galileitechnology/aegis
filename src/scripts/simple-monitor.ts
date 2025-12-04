// src/scripts/simple-monitor.ts
import axios from 'axios';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = path.join(__dirname, '../.env');
dotenv.config({ path: envPath });

// Use the same base URL as your Next.js app
const BASE_URL = process.env.BASE_URL || 'http://localhost:9999';
const MAX_RETRIES = 10;
const RETRY_DELAY = 2000; // 2 seconds

console.log('🚀 URL Monitor starting...');
console.log('Base URL:', BASE_URL);

// Helper function to wait
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Wait for server to be ready
async function waitForServer() {
  console.log('⏳ Waiting for Next.js server to be ready...');
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axios.get(`${BASE_URL}/api/urlmonitor`, {
        timeout: 5000,
      });
      console.log(`✅ Server is ready! (attempt ${attempt}/${MAX_RETRIES})`);
      return true;
    } catch (error: any) {
      if (attempt < MAX_RETRIES) {
        console.log(`   Server not ready, waiting ${RETRY_DELAY / 1000}s... (attempt ${attempt}/${MAX_RETRIES})`);
        await sleep(RETRY_DELAY);
      } else {
        console.error(`❌ Server never became ready after ${MAX_RETRIES} attempts`);
        console.error('Last error:', error.message);
        return false;
      }
    }
  }
  return false;
}

async function checkAll() {
  console.log(`\n[${new Date().toISOString()}] 🔍 Checking URLs...`);
  
  try {
    // Get all monitors from API
    const response = await axios.get(`${BASE_URL}/api/urlmonitor`, {
      timeout: 15000,
    });
    const monitors = response.data;
    
    const activeMonitors = monitors.filter((m: any) => m.is_monitoring_active);
    
    console.log(`📊 Found ${activeMonitors.length} active monitor(s) out of ${monitors.length} total`);
    
    for (const monitor of activeMonitors) {
      await checkOne(monitor);
      await sleep(2000); // Wait 2 seconds between checks
    }
    
    console.log(`✅ Check completed at ${new Date().toISOString()}`);
  } catch (error: any) {
    console.error('❌ Error in checkAll:', error.message);
  }
}

async function checkOne(monitor: any) {
  console.log(`\n  Checking: ${monitor.url} (ID: ${monitor.id})`);
  
  try {
    // Mark as checking first
    await axios.put(`${BASE_URL}/api/urlmonitor?id=${monitor.id}`, {
      current_status: 'checking',
      updated_at: new Date().toISOString(),
    });
    
    // Call the check API endpoint (server-side)
    const checkResponse = await axios.post(`${BASE_URL}/api/urlmonitor/check`, {
      url: monitor.url,
    }, {
      timeout: 10000,
    });
    
    const checkResult = checkResponse.data;
    
    // Get existing recent checks
    const recentChecks = monitor.recent_checks || [];
    
    // Create new check entry
    const newCheck = {
      timestamp: new Date().toISOString(),
      status: checkResult.status,
      response_time_ms: checkResult.response_time_ms,
      status_code: checkResult.status_code,
      error_message: checkResult.error_message,
    };
    
    const updatedRecentChecks = [...recentChecks, newCheck].slice(-50);
    
    // Calculate uptime
    const upCount = updatedRecentChecks.filter((check: any) => check.status === 'up').length;
    const uptimePercentage = updatedRecentChecks.length > 0 ? 
      (upCount / updatedRecentChecks.length) * 100 : 0;
    
    const totalChecks = (monitor.total_checks || 0) + 1;
    const successfulChecks = (monitor.successful_checks || 0) + 
      (checkResult.status === 'up' ? 1 : 0);
    
    // Update the monitor
    const updateData = {
      current_status: checkResult.status,
      last_status_code: checkResult.status_code,
      last_response_time_ms: checkResult.response_time_ms,
      last_error_message: checkResult.error_message,
      last_checked_at: new Date().toISOString(),
      total_checks: totalChecks,
      successful_checks: successfulChecks,
      uptime_percentage: uptimePercentage,
      recent_checks: updatedRecentChecks,
    };
    
    await axios.put(`${BASE_URL}/api/urlmonitor?id=${monitor.id}`, updateData, {
      timeout: 10000,
    });
    
    console.log(`    ${checkResult.status === 'up' ? '✅' : checkResult.status === 'down' ? '⚠️' : '❌'} Status: ${checkResult.status}${checkResult.status_code ? ` (${checkResult.status_code})` : ''}${checkResult.response_time_ms ? ` ${checkResult.response_time_ms}ms` : ''}`);
    
  } catch (error: any) {
    console.error(`    ❌ Check failed: ${error.message}`);
    
    // Handle error
    const recentChecks = monitor.recent_checks || [];
    const totalChecks = (monitor.total_checks || 0) + 1;
    
    const errorCheck = {
      timestamp: new Date().toISOString(),
      status: 'error',
      error_message: error.message?.substring(0, 255),
    };
    
    const updatedRecentChecks = [...recentChecks, errorCheck].slice(-50);
    
    const errorData = {
      current_status: 'error',
      last_error_message: error.message?.substring(0, 255),
      last_checked_at: new Date().toISOString(),
      total_checks: totalChecks,
      recent_checks: updatedRecentChecks,
    };
    
    try {
      await axios.put(`${BASE_URL}/api/urlmonitor?id=${monitor.id}`, errorData, {
        timeout: 5000,
      });
    } catch (apiError:any) {
      console.error('    Failed to save error to database:', apiError.message);
    }
  }
}

// Main execution
async function main() {
  // Wait for server to be ready
  if (!await waitForServer()) {
    console.log('\n❌ Exiting monitor...');
    process.exit(1);
  }
  
  console.log('\n✅ Server connection established!');
  
  // Run initial check
  await checkAll();
  
  // Schedule periodic checks (every 5 minutes)
  const CHECK_INTERVAL = 300000; // 5 minutes
  setInterval(checkAll, CHECK_INTERVAL);
  
  console.log(`\n⏰ Monitor started successfully!`);
  console.log(`   Will check URLs every ${CHECK_INTERVAL / 60000} minutes`);
  console.log(`   Next check at: ${new Date(Date.now() + CHECK_INTERVAL).toLocaleTimeString()}`);
  console.log('\nPress Ctrl+C to stop\n');
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down...');
  process.exit(0);
});

// Handle unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error('⚠️ Unhandled rejection:', error);
});

// Start the monitor
main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});