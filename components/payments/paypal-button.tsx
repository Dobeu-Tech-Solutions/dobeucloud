'use client';

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { createPayPalOrder, capturePayPalOrder } from '@/lib/payments/paypal';

interface PayPalButtonProps {
  amount: number;
  currency?: string;
  onSuccess?: (details: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
  description?: string;
  invoiceId?: string;
}

export function PayPalButton({
  amount,
  currency = 'USD',
  onSuccess,
  onError,
  onCancel,
  description,
  invoiceId,
}: PayPalButtonProps) {
  const [{ isPending }] = usePayPalScriptReducer();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCreateOrder = async () => {
    try {
      const orderId = await createPayPalOrder(amount, currency);
      return orderId;
    } catch (error) {
      toast.error('Failed to create payment order');
      throw error;
    }
  };

  const handleApprove = async (data: any) => {
    setIsProcessing(true);
    try {
      const details = await capturePayPalOrder(data.orderID);
      
      // Save payment details to database
      await fetch('/api/payments/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: 'paypal',
          transactionId: details.id,
          amount,
          currency,
          status: details.status,
          invoiceId,
          description,
          payerEmail: details.payer.email_address,
        }),
      });

      toast.success('Payment successful!');
      onSuccess?.(details);
    } catch (error) {
      toast.error('Failed to process payment');
      onError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isPending) {
    return (
      <div className="w-full h-12 bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
        <span className="text-gray-400">Loading PayPal...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <PayPalButtons
        createOrder={handleCreateOrder}
        onApprove={handleApprove}
        onError={(err) => {
          console.error('PayPal error:', err);
          toast.error('Payment failed');
          onError?.(err);
        }}
        onCancel={() => {
          toast('Payment cancelled', { icon: 'ℹ️' });
          onCancel?.();
        }}
        disabled={isProcessing}
        style={{
          layout: 'horizontal',
          color: 'blue',
          shape: 'rect',
          label: 'pay',
          height: 48,
        }}
      />
      {isProcessing && (
        <div className="mt-2 text-center text-sm text-gray-400">
          Processing payment...
        </div>
      )}
    </div>
  );
}
