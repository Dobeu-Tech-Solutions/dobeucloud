import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { requireAuth } from '@/lib/auth';
import Invoice from '@/lib/models/Invoice';
import Analytics from '@/lib/models/Analytics';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const {
      provider,
      transactionId,
      amount,
      currency,
      status,
      invoiceId,
      description,
      payerEmail,
      buyerEmail,
    } = body;

    await dbConnect();

    // If this payment is for an invoice, update the invoice
    if (invoiceId) {
      const invoice = await Invoice.findById(invoiceId);
      
      if (!invoice) {
        return NextResponse.json(
          { error: 'Invoice not found' },
          { status: 404 }
        );
      }

      if (invoice.client.toString() !== user.id) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }

      // Add payment to invoice
      invoice.payments.push({
        date: new Date(),
        amount,
        method: provider as any,
        transactionId,
        notes: description,
      });

      invoice.paidAmount = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
      
      await invoice.save();
    }

    // Log analytics event
    await Analytics.create({
      event: 'payment_completed',
      category: 'conversion',
      userId: user.id,
      sessionId: request.headers.get('x-session-id') || 'unknown',
      data: {
        provider,
        transactionId,
        amount,
        currency,
        status,
        invoiceId,
        description,
      },
      metadata: {
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      },
    });

    return NextResponse.json(
      {
        success: true,
        transactionId,
        invoiceId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Payment recording error:', error);
    return NextResponse.json(
      { error: 'Failed to record payment' },
      { status: 500 }
    );
  }
}
