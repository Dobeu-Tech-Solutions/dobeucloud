import Analytics from '@/lib/models/Analytics';

// Google Analytics configuration
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Initialize Google Analytics
export function initGoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) {
    console.warn('Google Analytics Measurement ID not provided');
    return;
  }

  // Add gtag script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // Initialize gtag
  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}', {
      page_path: window.location.pathname,
    });
  `;
  document.head.appendChild(script2);
}

// Google Analytics tracking functions
export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
}

export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// Custom MongoDB Analytics
export async function trackCustomEvent(
  event: string,
  category: 'page_view' | 'user_action' | 'conversion' | 'error' | 'performance',
  data: Record<string, any> = {},
  userId?: string
) {
  try {
    // Get session ID from localStorage or create new one
    let sessionId = '';
    if (typeof window !== 'undefined') {
      sessionId = localStorage.getItem('analytics_session_id') || '';
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        localStorage.setItem('analytics_session_id', sessionId);
      }
    }

    // Collect metadata
    const metadata: any = {
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      browser: getBrowserInfo(),
      os: getOSInfo(),
      device: getDeviceType(),
    };

    // Get UTM parameters
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      metadata.utm_source = params.get('utm_source');
      metadata.utm_medium = params.get('utm_medium');
      metadata.utm_campaign = params.get('utm_campaign');
    }

    // Send to API
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event,
        category,
        data,
        userId,
        sessionId,
        metadata,
      }),
    });
  } catch (error) {
    console.error('Failed to track custom event:', error);
  }
}

// Utility functions
function getBrowserInfo(): string {
  const ua = navigator.userAgent;
  if (ua.indexOf('Chrome') > -1) return 'Chrome';
  if (ua.indexOf('Firefox') > -1) return 'Firefox';
  if (ua.indexOf('Safari') > -1) return 'Safari';
  if (ua.indexOf('Edge') > -1) return 'Edge';
  return 'Other';
}

function getOSInfo(): string {
  const ua = navigator.userAgent;
  if (ua.indexOf('Windows') > -1) return 'Windows';
  if (ua.indexOf('Mac') > -1) return 'macOS';
  if (ua.indexOf('Linux') > -1) return 'Linux';
  if (ua.indexOf('Android') > -1) return 'Android';
  if (ua.indexOf('iOS') > -1) return 'iOS';
  return 'Other';
}

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) return 'mobile';
  return 'desktop';
}

// Track specific events
export function trackFormSubmission(formName: string, formData: Record<string, any>) {
  trackEvent('form_submit', 'engagement', formName);
  trackCustomEvent('form_submission', 'conversion', {
    form_name: formName,
    fields: Object.keys(formData),
  });
}

export function trackButtonClick(buttonName: string, location: string) {
  trackEvent('button_click', 'engagement', `${buttonName}_${location}`);
  trackCustomEvent('button_click', 'user_action', {
    button_name: buttonName,
    location,
  });
}

export function trackError(error: string, context: string) {
  trackEvent('error', 'errors', `${error}_${context}`);
  trackCustomEvent('error_occurred', 'error', {
    error_message: error,
    context,
    url: window.location.href,
  });
}

export function trackPerformance(metric: string, value: number) {
  trackEvent('performance', 'web_vitals', metric, Math.round(value));
  trackCustomEvent('performance_metric', 'performance', {
    metric,
    value,
    url: window.location.href,
  });
}
