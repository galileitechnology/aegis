import { NextRequest, NextResponse } from 'next/server';
import { performMonitoringCycle } from '@/actions/urlMonitor';

export async function GET(request: NextRequest) {
  try {
    // Check for secret token to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const result = await performMonitoringCycle();
    
    return NextResponse.json({
      message: 'Monitoring cycle completed',
      ...result
    });
  } catch (error) {
    console.error('Error in cron endpoint:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}