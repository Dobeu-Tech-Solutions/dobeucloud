import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

const SQUARE_API_BASE = process.env.NODE_ENV === 'production'
  ? 'https://connect.squareup.com'
  : 'https://connect.squareupsandbox.com';

export async function POST(request: NextRequest) {
  try {
    const {
      sourceId,
      amount,
      currency = 'USD',
      customerId,
      locationId,
    } = await request.json();

    if (!sourceId || !amount || !locationId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const payment = {
      source_id: sourceId,
      idempotency_key: randomUUID(),
      amount_money: {
        amount: Math.round(amount), // Square expects amount in cents
        currency,
      },
      location_id: locationId,
      ...(customerId && { customer_id: customerId }),
    };

    const response = await fetch(`${SQUARE_API_BASE}/v2/payments`, {
      method: 'POST',
      headers: {
        'Square-Version': '2024-01-18',
        'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payment),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Square payment error:', data.errors);
      return NextResponse.json(
        {
          error: data.errors?.[0]?.detail || 'Failed to process payment',
          errors: data.errors,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({ payment: data.payment }, { status: 201 });
  } catch (error) {
    console.error('Square payment error:', error);
    return NextResponse.json(
      { error: 'Failed to process Square payment' },
      { status: 500 }
    );
  }
}
