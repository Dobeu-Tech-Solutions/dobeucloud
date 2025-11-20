'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackApolloPageView, identifyApolloUser } from '@/lib/apollo';

export function useApolloTracking(user?: { id: string; email: string; name?: string }) {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view when route changes
    trackApolloPageView(pathname, {
      url: window.location.href,
      referrer: document.referrer,
    });
  }, [pathname]);

  useEffect(() => {
    // Identify user when they log in
    if (user) {
      identifyApolloUser(user.id, {
        email: user.email,
        name: user.name,
        created_at: new Date().toISOString(),
      });
    }
  }, [user]);
}
