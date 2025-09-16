
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { logger } from '@/utils/logger';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  title?: string;
  description?: string;
}

const ErrorFallback = ({ 
  error, 
  resetError, 
  title = "Something went wrong",
  description = "We're sorry, but something unexpected happened. Please try again or return to the home page."
}: ErrorFallbackProps) => {
  
  useEffect(() => {
    if (error) {
      logger.error('Error boundary caught error', {
        message: error.message,
        stack: error.stack,
        name: error.name
      }, 'ErrorFallback');
    }
  }, [error]);

  const handleRefresh = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  const goHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-red-50">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-xl font-im-fell text-char-black">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 font-montserrat text-sm">
            {description}
          </p>
          
          {error && import.meta.env.DEV && (
            <div className="text-left bg-gray-100 p-3 rounded text-xs font-mono text-gray-700 max-h-32 overflow-auto">
              <strong>Error:</strong> {error.message}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={handleRefresh}
              className="flex-1 font-montserrat"
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button 
              onClick={goHome}
              className="flex-1 bg-char-black hover:bg-flame-red text-white font-montserrat"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorFallback;
