import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }
    
    const startTime = Date.now();
    
    try {
      // Try multiple methods
      let response;
      
      // Method 1: Try HEAD request
      try {
        response = await axios.head(url, {
          timeout: 10000,
          validateStatus: () => true,
          headers: {
            'User-Agent': 'URL-Monitor-Server/1.0',
          },
        });
      } catch (headError) {
        // Method 2: Try GET request
        response = await axios.get(url, {
          timeout: 10000,
          validateStatus: () => true,
          headers: {
            'User-Agent': 'URL-Monitor-Server/1.0',
          },
        });
      }
      
      const responseTime = Date.now() - startTime;
      
      return NextResponse.json({
        status: response.status < 400 ? 'up' : 'down',
        status_code: response.status,
        response_time_ms: responseTime,
      });
      
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      return NextResponse.json({
        status: 'error',
        response_time_ms: responseTime,
        error_message: error.message || 'Connection failed',
      });
    }
    
  } catch (error) {
    console.error('Error in check endpoint:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}