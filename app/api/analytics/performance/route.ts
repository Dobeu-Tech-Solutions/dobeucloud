import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Analytics from '@/lib/models/Analytics';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate the performance data
    if (!data.metric || data.value === undefined) {
      return NextResponse.json(
        { error: 'Invalid performance data' },
        { status: 400 }
      );
    }

    // Get session ID from cookies or generate one
    const sessionId = request.cookies.get('session_id')?.value || 
                     request.headers.get('x-session-id') || 
                     'anonymous';

    // Store performance metric in database
    await dbConnect();
    
    await Analytics.create({
      event: `performance:${data.metric}`,
      category: 'performance',
      sessionId,
      data: {
        metric: data.metric,
        value: data.value,
        rating: data.rating,
        pathname: data.pathname,
      },
      metadata: {
        userAgent: request.headers.get('user-agent') || undefined,
        referrer: request.headers.get('referer') || undefined,
      },
    });

    // Log poor performance metrics
    if (data.rating === 'poor') {
      console.warn(`Poor performance detected - ${data.metric}: ${data.value}ms on ${data.pathname}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Performance tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track performance metric' },
      { status: 500 }
    );
  }
}
