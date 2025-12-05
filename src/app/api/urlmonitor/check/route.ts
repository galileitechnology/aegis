// Update your src/app/api/urlmonitor/check/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { checkUrlStatus } from '@/actions/urlMonitor';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ 
        status: 'error',
        error_message: 'URL is required' 
      }, { status: 400 });
    }
    
    // Use the server action to check the URL
    const result = await checkUrlStatus(url);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error in check endpoint:', error);
    return NextResponse.json({ 
      status: 'error',
      error_message: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}