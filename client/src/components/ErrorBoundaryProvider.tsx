import React from 'react';
import ErrorBoundaryWrapper from '@/components/ui/error-boundary-wrapper';
import { useLocation } from 'react-router-dom';
import { logger } from '@/utils/logger';

interface ErrorBoundaryProviderProps {
  children: React.ReactNode;
}

const ErrorBoundaryProvider: React.FC<ErrorBoundaryProviderProps> = ({ children }) => {
  const location = useLocation();
  
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log error with context
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      url: location.pathname,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };
    
    // Send to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service like Sentry
      // Production error logging removed
    } else {
      logger.error('Development Error:', errorData);
    }
  };

  // Different error boundaries for different parts of the app
  if (location.pathname.startsWith('/admin')) {
    return (
      <ErrorBoundaryWrapper
        onError={handleError}
        title="Admin Dashboard Error"
        description="An error occurred in the admin dashboard. Your data is safe."
        showDetails={process.env.NODE_ENV === 'development'}
      >
        {children}
      </ErrorBoundaryWrapper>
    );
  }

  return (
    <ErrorBoundaryWrapper
      onError={handleError}
      title="Something went wrong"
      description="We're sorry, but something unexpected happened. Please try refreshing the page."
      showDetails={process.env.NODE_ENV === 'development'}
    >
      {children}
    </ErrorBoundaryWrapper>
  );
};

export default ErrorBoundaryProvider;