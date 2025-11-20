'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import * as Sentry from '@sentry/nextjs';

export function PerformanceMonitor() {
  const pathname = usePathname();

  useEffect(() => {
    // Monitor Core Web Vitals
    if (typeof window !== 'undefined' && 'web-vital' in window) {
      const reportWebVital = async (metric: any) => {
        // Report to Sentry
        // Use setMeasurement directly on the current scope
        Sentry.setMeasurement(metric.name, metric.value, metric.rating || '');

        // Report to custom analytics
        try {
          await fetch('/api/analytics/performance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              metric: metric.name,
              value: metric.value,
              rating: metric.rating,
              pathname,
              timestamp: new Date().toISOString(),
            }),
          });
        } catch (error) {
          console.error('Failed to report performance metric:', error);
        }
      };

      // Import web-vitals dynamically
      import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
        onCLS(reportWebVital);
        onINP(reportWebVital);
        onFCP(reportWebVital);
        onLCP(reportWebVital);
        onTTFB(reportWebVital);
      });
    }

    // Track route changes
    // In newer versions of Sentry, transactions are handled automatically
    // We can track custom breadcrumbs instead
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: `Navigated to ${pathname}`,
      level: 'info',
    });
  }, [pathname]);

  // Monitor JavaScript errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      Sentry.captureException(event.error, {
        tags: {
          type: 'unhandled-error',
        },
        extra: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      Sentry.captureException(event.reason, {
        tags: {
          type: 'unhandled-rejection',
        },
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  // Monitor resource loading performance
  useEffect(() => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            if (resourceEntry.duration > 1000) {
              // Report slow resources
              Sentry.captureMessage(`Slow resource: ${resourceEntry.name}`, {
                level: 'warning',
                tags: {
                  type: 'slow-resource',
                },
                extra: {
                  duration: resourceEntry.duration,
                  transferSize: resourceEntry.transferSize,
                  pathname,
                },
              });
            }
          }
        });
      });

      observer.observe({ entryTypes: ['resource'] });

      return () => observer.disconnect();
    }
  }, [pathname]);

  return null;
}
