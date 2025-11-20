'use client';

import { SquarePaymentsForm, CreditCard } from 'react-square-web-payments-sdk';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { createSquarePayment } from '@/lib/payments/square';

interface SquarePaymentProps {
  amount: number;
  currency?: string;
  onSuccess?: (payment: any) => void;
  onError?: (error: any) => void;
  description?: string;
  invoiceId?: string;
  customerId?: string;
}

export function SquarePayment({
  amount,
  currency = 'USD',
  onSuccess,
  onError,
  description,
  invoiceId,
  customerId,
}: SquarePaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCardTokenizeResponse = async (token: any, buyer: any) => {
    setIsProcessing(true);
    
    try {
      const payment = await createSquarePayment(
        token.token,
        amount * 100, // Square expects amounts in cents
        currency,
        customerId
      );

      // Save payment details to database
      await fetch('/api/payments/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: 'square',
          transactionId: payment.id,
          amount,
          currency,
          status: payment.status,
          invoiceId,
          description,
          buyerEmail: buyer?.email,
        }),
      });

      toast.success('Payment successful!');
      onSuccess?.(payment);
    } catch (error) {
      console.error('Square payment error:', error);
      toast.error('Payment failed');
      onError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full">
      <SquarePaymentsForm
        applicationId={process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || ''}
        locationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || ''}
        cardTokenizeResponseReceived={handleCardTokenizeResponse}
      >
        <div className="space-y-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <CreditCard
              includeInputLabels
              style={{
                '.input-container': {
                  borderColor: '#374151',
                  borderRadius: '0.5rem',
                },
                '.message-text': {
                  color: '#ef4444',
                },
                'input': {
                  backgroundColor: '#1f2937',
                  color: '#fff',
                  fontSize: '16px',
                },
                'input::placeholder': {
                  color: '#6b7280',
                },
                '.input-container.is-focus': {
                  borderColor: '#3b82f6',
                },
                '.input-container.is-error': {
                  borderColor: '#ef4444',
                },
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              `Pay $${amount.toFixed(2)}`
            )}
          </button>
        </div>
      </SquarePaymentsForm>

      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z" />
        </svg>
        Secure payment powered by Square
      </div>
    </div>
  );
}
