import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: NextRequest) {
  try {
    const result = await pool.query(`
      SELECT * FROM url_monitor 
      ORDER BY created_at DESC
    `);
    
    // Parse the recent_checks JSONB field
    const monitors = result.rows.map(row => ({
      ...row,
      recent_checks: row.recent_checks || [],
      // Convert string numbers to actual numbers
      uptime_percentage: parseFloat(row.uptime_percentage) || 0,
      total_checks: parseInt(row.total_checks) || 0,
      successful_checks: parseInt(row.successful_checks) || 0,
      last_response_time_ms: row.last_response_time_ms ? parseInt(row.last_response_time_ms) : undefined,
      last_status_code: row.last_status_code ? parseInt(row.last_status_code) : undefined,
      check_interval_seconds: parseInt(row.check_interval_seconds) || 60,
      last_checked_at: row.last_checked_at ? new Date(row.last_checked_at) : null,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    }));
    
    return NextResponse.json(monitors);
  } catch (error) {
    console.error('Error fetching URL monitors:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, name, check_interval_seconds } = body;
    
    const result = await pool.query(`
      INSERT INTO url_monitor (
        url, name, check_interval_seconds, 
        current_status, is_monitoring_active,
        total_checks, successful_checks, uptime_percentage,
        recent_checks
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      url, 
      name || null, 
      check_interval_seconds || 60,
      'checking',
      true,
      0,
      0,
      0,
      JSON.stringify([]) // Ensure this is a JSON string
    ]);
    
    const monitor = {
      ...result.rows[0],
      recent_checks: result.rows[0].recent_checks || [],
      uptime_percentage: parseFloat(result.rows[0].uptime_percentage) || 0,
      total_checks: parseInt(result.rows[0].total_checks) || 0,
      successful_checks: parseInt(result.rows[0].successful_checks) || 0,
      last_response_time_ms: result.rows[0].last_response_time_ms ? parseInt(result.rows[0].last_response_time_ms) : undefined,
      last_status_code: result.rows[0].last_status_code ? parseInt(result.rows[0].last_status_code) : undefined,
      check_interval_seconds: parseInt(result.rows[0].check_interval_seconds) || 60,
      last_checked_at: result.rows[0].last_checked_at ? new Date(result.rows[0].last_checked_at) : null,
      created_at: new Date(result.rows[0].created_at),
      updated_at: new Date(result.rows[0].updated_at),
    };
    
    return NextResponse.json(monitor, { status: 201 });
  } catch (error) {
    console.error('Error creating URL monitor:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const updates = await request.json();
    
    console.log('PUT request received:', { id, updates });
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    // Handle JSON fields properly - convert arrays/objects to JSON strings
    const processedUpdates = { ...updates };
    
    // Convert recent_checks array to JSON string if it exists
    if (processedUpdates.recent_checks && Array.isArray(processedUpdates.recent_checks)) {
      processedUpdates.recent_checks = JSON.stringify(processedUpdates.recent_checks);
    }
    
    // Build dynamic update query
    const setClause = Object.keys(processedUpdates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const values = [id, ...Object.values(processedUpdates)];
    
    console.log('Processed SQL query values:', values);
    
    const result = await pool.query(`
      UPDATE url_monitor 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, values);
    
    if (result.rows.length === 0) {
      console.log('URL monitor not found with id:', id);
      return NextResponse.json({ error: 'URL monitor not found' }, { status: 404 });
    }
    
    const monitor = {
      ...result.rows[0],
      recent_checks: result.rows[0].recent_checks || [],
      uptime_percentage: parseFloat(result.rows[0].uptime_percentage) || 0,
      total_checks: parseInt(result.rows[0].total_checks) || 0,
      successful_checks: parseInt(result.rows[0].successful_checks) || 0,
      last_response_time_ms: result.rows[0].last_response_time_ms ? parseInt(result.rows[0].last_response_time_ms) : undefined,
      last_status_code: result.rows[0].last_status_code ? parseInt(result.rows[0].last_status_code) : undefined,
      check_interval_seconds: parseInt(result.rows[0].check_interval_seconds) || 60,
      last_checked_at: result.rows[0].last_checked_at ? new Date(result.rows[0].last_checked_at) : null,
      created_at: new Date(result.rows[0].created_at),
      updated_at: new Date(result.rows[0].updated_at),
    };
    
    console.log('Update successful:', monitor.id);
    return NextResponse.json(monitor);
  } catch (error) {
    console.error('Error updating URL monitor:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const result = await pool.query('DELETE FROM url_monitor WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'URL monitor not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'URL monitor deleted successfully' });
  } catch (error) {
    console.error('Error deleting URL monitor:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}