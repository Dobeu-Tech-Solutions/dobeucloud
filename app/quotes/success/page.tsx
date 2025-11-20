'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Navigation } from '@/components/navigation';
import { CheckCircle, FileText, Clock, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuoteSuccessPage() {
  useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3B82F6', '#8B5CF6', '#10B981'],
    });
  }, []);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-gray-900/50 border-gray-800 p-12 text-center">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>

            {/* Success Message */}
            <h1 className="text-4xl font-bold text-white mb-4">
              Quote Request Submitted!
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Thank you for your interest in our services. We've received your quote request and will review it shortly.
            </p>

            {/* What Happens Next */}
            <div className="bg-gray-800/50 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-6">What Happens Next?</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-white mb-1">Review & Analysis</h3>
                    <p className="text-gray-400">
                      Our team will carefully review your project requirements and analyze the scope of work needed.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Clock className="w-6 h-6 text-purple-500" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-white mb-1">Quote Preparation</h3>
                    <p className="text-gray-400">
                      We'll prepare a detailed quote with project breakdown, timeline, and transparent pricing within 24-48 hours.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <Mail className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-white mb-1">Follow-up Discussion</h3>
                    <p className="text-gray-400">
                      We'll reach out to discuss the quote, answer questions, and refine the proposal based on your feedback.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reference Number */}
            <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
              <p className="text-gray-400 mb-2">Your quote reference number is:</p>
              <p className="text-2xl font-mono font-bold text-white">
                QR-{new Date().getFullYear()}-{Math.random().toString(36).substring(2, 8).toUpperCase()}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Please save this number for future reference
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                asChild
              >
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
                asChild
              >
                <Link href="/">Return to Home</Link>
              </Button>
            </div>

            {/* Support Info */}
            <p className="text-sm text-gray-500 mt-8">
              Have questions? Contact us at{' '}
              <a href="mailto:quotes@dobeu.cloud" className="text-blue-500 hover:text-blue-400">
                quotes@dobeu.cloud
              </a>{' '}
              or call{' '}
              <a href="tel:+15551234567" className="text-blue-500 hover:text-blue-400">
                +1 (555) 123-4567
              </a>
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
