'use client';

import { useEffect } from 'react';
import Intercom from '@intercom/messenger-js-sdk';
import { usePathname } from 'next/navigation';

export function IntercomProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize Intercom
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_INTERCOM_APP_ID) {
      Intercom({
        app_id: process.env.NEXT_PUBLIC_INTERCOM_APP_ID,
      });

      // Update Intercom when route changes
      if ((window as any).Intercom) {
        (window as any).Intercom('update');
      }
    }
  }, [pathname]);

  // Update Intercom with user data when authenticated
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Intercom) {
      // This will be updated when we implement authentication
      // TODO: Get user from auth context and update Intercom
      
      // Example code for when user is available:
      // if (user) {
      //   (window as any).Intercom('update', {
      //     user_id: user.id,
      //     name: user.name,
      //     email: user.email,
      //     created_at: Math.floor(new Date(user.createdAt).getTime() / 1000),
      //   });
      // }
    }
  }, []);

  return <>{children}</>;
}
