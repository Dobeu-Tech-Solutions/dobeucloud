export interface SquarePayment {
  id: string;
  status: string;
  amount: {
    amount: number;
    currency: string;
  };
  sourceId: string;
  customerId?: string;
  createdAt: string;
}

export interface SquareCustomer {
  id: string;
  givenName: string;
  familyName: string;
  email: string;
  phoneNumber?: string;
  createdAt: string;
}

export async function createSquarePayment(
  sourceId: string,
  amount: number,
  currency = 'USD',
  customerId?: string
) {
  try {
    const response = await fetch('/api/payments/square/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sourceId,
        amount,
        currency,
        customerId,
        locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create Square payment');
    }

    const data = await response.json();
    return data.payment;
  } catch (error) {
    console.error('Square payment error:', error);
    throw error;
  }
}

export async function createSquareCustomer(customerData: {
  givenName: string;
  familyName: string;
  email: string;
  phoneNumber?: string;
}) {
  try {
    const response = await fetch('/api/payments/square/create-customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      throw new Error('Failed to create Square customer');
    }

    const data = await response.json();
    return data.customer;
  } catch (error) {
    console.error('Square customer creation error:', error);
    throw error;
  }
}

export async function getSquarePayment(paymentId: string) {
  try {
    const response = await fetch(`/api/payments/square/payment/${paymentId}`);

    if (!response.ok) {
      throw new Error('Failed to get Square payment');
    }

    const data = await response.json();
    return data.payment;
  } catch (error) {
    console.error('Square get payment error:', error);
    throw error;
  }
}

export async function refundSquarePayment(paymentId: string, amount?: number, reason?: string) {
  try {
    const response = await fetch('/api/payments/square/refund', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentId,
        amount,
        reason,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refund Square payment');
    }

    const data = await response.json();
    return data.refund;
  } catch (error) {
    console.error('Square refund error:', error);
    throw error;
  }
}
