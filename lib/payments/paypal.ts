import { PayPalScriptOptions } from '@paypal/react-paypal-js';

export const paypalOptions: PayPalScriptOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test',
  currency: 'USD',
  intent: 'capture',
  dataClientToken: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_TOKEN,
};

export interface PayPalOrder {
  id: string;
  status: string;
  payer: {
    email_address: string;
    name: {
      given_name: string;
      surname: string;
    };
  };
  purchase_units: Array<{
    amount: {
      value: string;
      currency_code: string;
    };
  }>;
}

export async function createPayPalOrder(amount: number, currency = 'USD') {
  try {
    const response = await fetch('/api/payments/paypal/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create PayPal order');
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('PayPal order creation error:', error);
    throw error;
  }
}

export async function capturePayPalOrder(orderId: string) {
  try {
    const response = await fetch('/api/payments/paypal/capture-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to capture PayPal payment');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('PayPal capture error:', error);
    throw error;
  }
}

export async function refundPayPalPayment(captureId: string, amount?: number) {
  try {
    const response = await fetch('/api/payments/paypal/refund', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        captureId,
        amount,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refund PayPal payment');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('PayPal refund error:', error);
    throw error;
  }
}
