import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import Invoice from '@/lib/models/Invoice';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    await dbConnect();
    const dbUser = await User.findOne({ supabaseId: user.id });
    
    if (!dbUser || dbUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get revenue data for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const revenueData = await Invoice.aggregate([
      {
        $match: {
          status: 'paid',
          paidAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$paidAt' },
            month: { $month: '$paidAt' },
          },
          total: { $sum: '$paidAmount' },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    // Format data for the chart
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels: string[] = [];
    const revenue: number[] = [];

    // Fill in the last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      
      labels.push(months[monthIndex]);
      
      // Find revenue for this month
      const monthData = revenueData.find(
        (d) => d._id.year === year && d._id.month === monthIndex + 1
      );
      
      revenue.push(monthData ? monthData.total : 0);
    }

    return NextResponse.json({
      labels,
      revenue,
    });
  } catch (error) {
    console.error('Revenue stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue stats' },
      { status: 500 }
    );
  }
}
