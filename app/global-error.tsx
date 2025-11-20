'use client';

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100 dark:bg-gray-900">
          <div className="max-w-md w-full text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Critical Error
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              A critical error has occurred. Please refresh the page or contact support if the problem persists.
            </p>
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
