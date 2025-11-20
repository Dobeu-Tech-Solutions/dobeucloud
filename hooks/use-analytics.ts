'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initGoogleAnalytics, trackPageView, trackCustomEvent } from '@/lib/analytics';

export function useAnalytics(userId?: string) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize Google Analytics on mount
    initGoogleAnalytics();
  }, []);

  useEffect(() => {
    // Track page views
    trackPageView(pathname);
    trackCustomEvent('page_view', 'page_view', {
      path: pathname,
      title: document.title,
    }, userId);
  }, [pathname, userId]);

  // Track Web Vitals
  useEffect(() => {
    if ('web-vital' in window) {
      const reportWebVital = ({ name, value }: { name: string; value: number }) => {
        trackCustomEvent('web_vital', 'performance', {
          metric: name,
          value,
          path: pathname,
        });
      };

      // @ts-ignore
      window.addEventListener('web-vital', reportWebVital);
      return () => {
        // @ts-ignore
        window.removeEventListener('web-vital', reportWebVital);
      };
    }
  }, [pathname]);
}
