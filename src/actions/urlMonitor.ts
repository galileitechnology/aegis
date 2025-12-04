"use server"

import { Pool } from 'pg';
import { revalidatePath } from 'next/cache';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Server action to check a single URL (can be called from anywhere)
export async function checkUrlStatus(url: string): Promise<{
  status: 'up' | 'down' | 'error';
  response_time_ms?: number;
  status_code?: number;
  error_message?: string;
}> {
  const startTime = Date.now();
  
  try {
    // Try HEAD request first (less data)
    const response = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(10000),
      headers: {
        'User-Agent': 'URL-Monitor/1.0'
      }
    });
    
    const responseTime = Date.now() - startTime;
    
    if (response.ok) {
      return {
        status: 'up',
        response_time_ms: responseTime,
        status_code: response.status
      };
    } else {
      return {
        status: 'down',
        response_time_ms: responseTime,
        status_code: response.status
      };
    }
  } catch (error) {
    return {
      status: 'error',
      response_time_ms: Date.now() - startTime,
      error_message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Server action to perform monitoring cycle
export async function performMonitoringCycle() {
  try {
    console.log('Starting monitoring cycle...');
    
    // Get all active monitors from database
    const result = await pool.query(`
      SELECT * FROM url_monitor 
      WHERE is_monitoring_active = true
    `);
    
    const monitors = result.rows;
    console.log(`Found ${monitors.length} active monitors`);
    
    // Check each URL in parallel
    const checkPromises = monitors.map(async (monitor) => {
      const checkResult = await checkUrlStatus(monitor.url);
      
      // Create new check entry
      const newCheck = {
        timestamp: new Date().toISOString(),
        status: checkResult.status,
        response_time_ms: checkResult.response_time_ms,
        status_code: checkResult.status_code,
        error_message: checkResult.error_message
      };
      
      // Get existing recent checks
      const recentChecks = monitor.recent_checks || [];
      const newRecentChecks = [...recentChecks, newCheck].slice(-50);
      
      // Calculate statistics
      const upCount = newRecentChecks.filter((check: any) => check.status === 'up').length;
      const uptimePercentage = newRecentChecks.length > 0 ? 
        (upCount / newRecentChecks.length) * 100 : 0;
      
      const totalChecks = (monitor.total_checks || 0) + 1;
      const successfulChecks = (monitor.successful_checks || 0) + 
        (checkResult.status === 'up' ? 1 : 0);
      
      // Update the monitor in database
      await pool.query(`
        UPDATE url_monitor 
        SET 
          current_status = $1,
          last_status_code = $2,
          last_response_time_ms = $3,
          last_error_message = $4,
          last_checked_at = CURRENT_TIMESTAMP,
          total_checks = $5,
          successful_checks = $6,
          uptime_percentage = $7,
          recent_checks = $8,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $9
      `, [
        checkResult.status,
        checkResult.status_code,
        checkResult.response_time_ms,
        checkResult.error_message,
        totalChecks,
        successfulChecks,
        uptimePercentage,
        JSON.stringify(newRecentChecks),
        monitor.id
      ]);
      
      return { url: monitor.url, status: checkResult.status };
    });
    
    const results = await Promise.allSettled(checkPromises);
    
    // Log results
    const successful = results.filter(r => r.status === 'fulfilled').length;
    console.log(`Monitoring cycle completed: ${successful}/${monitors.length} checks completed`);
    
    // Revalidate the page to show updated data
    revalidatePath('/');
    
    return { success: true, checked: monitors.length };
  } catch (error) {
    console.error('Error in monitoring cycle:', error);
    return { success: false, error: String(error) };
  }
}

// Server action to start continuous monitoring
export async function startBackgroundMonitoring() {
  try {
    // This function would be called by a scheduler
    await performMonitoringCycle();
    return { success: true };
  } catch (error) {
    console.error('Error starting background monitoring:', error);
    return { success: false, error: String(error) };
  }
}