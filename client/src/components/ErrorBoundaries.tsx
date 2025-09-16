import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  title?: string;
  description?: string;
}

export const ProductErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => (
  <Card className="border-destructive">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-destructive">
        <AlertTriangle className="h-5 w-5" />
        Product Error
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <p className="text-muted-foreground">
        Unable to load product information. This might be a temporary issue.
      </p>
      <Button onClick={resetErrorBoundary} variant="outline" size="sm">
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </Button>
    </CardContent>
  </Card>
);

export const AdminErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => (
  <div className="min-h-[200px] flex items-center justify-center">
    <Card className="border-destructive max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Admin Panel Error
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Something went wrong in the admin panel. Your data is safe.
        </p>
        <div className="flex gap-2">
          <Button onClick={resetErrorBoundary} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
          <Button onClick={() => window.location.reload()} variant="destructive" size="sm">
            Reload Page
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

export const ComponentErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => (
  <div className="border border-destructive/20 rounded-lg p-4 bg-destructive/5">
    <div className="flex items-center gap-2 text-destructive mb-2">
      <AlertTriangle className="h-4 w-4" />
      <span className="text-sm font-medium">Component Error</span>
    </div>
    <p className="text-xs text-muted-foreground mb-2">
      A component failed to render properly.
    </p>
    <Button onClick={resetErrorBoundary} variant="outline" size="sm">
      <RefreshCw className="h-3 w-3 mr-1" />
      Retry
    </Button>
  </div>
);

export const CheckoutErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => (
  <div className="max-w-2xl mx-auto">
    <div className="bg-white/10 backdrop-blur-xl border border-red-500/20 rounded-2xl shadow-xl p-6">
      <div className="text-center">
        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Checkout Error</h2>
        <p className="text-white/70 mb-6">
          Something went wrong loading the checkout page. This could be a temporary issue.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={resetErrorBoundary} 
            variant="outline" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Reload Page
          </Button>
          <Button 
            onClick={() => window.location.href = '/'} 
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  </div>
);

// Higher-order component for wrapping components with error boundaries
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  FallbackComponent = ComponentErrorFallback,
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary
      FallbackComponent={FallbackComponent}
      onError={onError}
      onReset={() => window.location.reload()}
    >
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Specific error boundaries for different sections
export const ProductErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary FallbackComponent={ProductErrorFallback}>
    {children}
  </ErrorBoundary>
);

export const AdminErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary FallbackComponent={AdminErrorFallback}>
    {children}
  </ErrorBoundary>
);

export const FormErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary FallbackComponent={CheckoutErrorFallback}>
    {children}
  </ErrorBoundary>
);