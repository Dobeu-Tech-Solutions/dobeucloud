'use client';

import { useAnalytics } from '@/hooks/use-analytics';
import { useApolloTracking } from '@/hooks/use-apollo-tracking';
import { ReactNode, useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase-client';

interface AnalyticsProviderProps {
  children: ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
        });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  useAnalytics(user?.id);
  useApolloTracking(user);

  return <>{children}</>;
}
