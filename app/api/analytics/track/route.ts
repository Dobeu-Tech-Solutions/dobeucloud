import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Analytics from '@/lib/models/Analytics';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      event,
      category,
      data = {},
      userId,
      sessionId,
      metadata = {},
    } = body;

    if (!event || !category || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Add IP address from headers
    metadata.ip = request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  undefined;

    // Create analytics entry
    await Analytics.create({
      event,
      category,
      userId,
      sessionId,
      data,
      metadata,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const event = searchParams.get('event');
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '100');

    await dbConnect();

    // Build query
    const query: any = {};
    if (event) query.event = event;
    if (category) query.category = category;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const analytics = await Analytics
      .find(query)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ analytics }, { status: 200 });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
