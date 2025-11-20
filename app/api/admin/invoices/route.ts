import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import Invoice from '@/lib/models/Invoice';

export async function POST(request: NextRequest) {
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

    const data = await request.json();
    
    // Create the invoice
    const invoice = new Invoice({
      client: data.client,
      issueDate: new Date(data.issueDate),
      dueDate: new Date(data.dueDate),
      status: data.status || 'draft',
      items: data.items,
      subtotal: data.subtotal,
      tax: data.tax,
      taxRate: data.taxRate,
      total: data.total,
      currency: 'USD',
      notes: data.notes,
      terms: data.terms,
      balance: data.total,
      paidAmount: 0,
    });

    await invoice.save();

    // If sending immediately, update sentAt
    if (data.status === 'sent') {
      invoice.sentAt = new Date();
      await invoice.save();
      
      // TODO: Send email to client
    }

    return NextResponse.json({
      message: 'Invoice created successfully',
      invoice,
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}

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

    const invoices = await Invoice.find()
      .populate('client', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Fetch invoices error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}
