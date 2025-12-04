import { NextRequest, NextResponse } from 'next/server';
import { checkUrlStatus } from '@/actions/urlMonitor';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }
    
    const result = await checkUrlStatus(url);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error checking URL:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}