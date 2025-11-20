export const APOLLO_APP_ID = process.env.NEXT_PUBLIC_APOLLO_APP_ID || '68faee78c5da6c000d9ae0de';

declare global {
  interface Window {
    trackingFunctions: {
      onLoad: (config: { appId: string }) => void;
      track: (eventName: string, properties?: Record<string, any>) => void;
      identify: (userId: string, traits?: Record<string, any>) => void;
      page: (pageName?: string, properties?: Record<string, any>) => void;
    };
  }
}

export function trackApolloEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.trackingFunctions?.track) {
    window.trackingFunctions.track(eventName, properties);
  }
}

export function identifyApolloUser(userId: string, traits?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.trackingFunctions?.identify) {
    window.trackingFunctions.identify(userId, traits);
  }
}

export function trackApolloPageView(pageName?: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.trackingFunctions?.page) {
    window.trackingFunctions.page(pageName, properties);
  }
}

// Track form submissions
export function trackFormSubmission(formName: string, formData: Record<string, any>) {
  trackApolloEvent('Form Submitted', {
    form_name: formName,
    form_fields: Object.keys(formData),
    timestamp: new Date().toISOString(),
  });
}

// Track CTA clicks
export function trackCTAClick(ctaName: string, location: string) {
  trackApolloEvent('CTA Clicked', {
    cta_name: ctaName,
    location,
    timestamp: new Date().toISOString(),
  });
}

// Track user engagement
export function trackEngagement(action: string, details?: Record<string, any>) {
  trackApolloEvent('User Engagement', {
    action,
    ...details,
    timestamp: new Date().toISOString(),
  });
}
