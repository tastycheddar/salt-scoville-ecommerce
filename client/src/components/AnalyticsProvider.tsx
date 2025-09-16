import React, { useEffect } from 'react';
import { useGoogleAnalytics } from '@/hooks/useGoogleAnalytics';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const analytics = useGoogleAnalytics();

  useEffect(() => {
    // Track initial page load
    analytics.trackCustomEvent('app_initialized', {
      timestamp: Date.now(),
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`
    });
  }, [analytics]);

  return <>{children}</>;
};

export default AnalyticsProvider;