import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface GoogleAuthButtonProps {
  onAuthSuccess?: () => void;
  disabled?: boolean;
}

export default function GoogleAuthButton({ onAuthSuccess, disabled }: GoogleAuthButtonProps) {
  const { toast } = useToast();

  const authenticateGoogle = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('/api/google/auth/google');
      return response;
    },
    onSuccess: (response) => {
      if (response.authUrl) {
        // Open Google OAuth in popup
        const popup = window.open(
          response.authUrl, 
          'google-auth', 
          'width=500,height=600,scrollbars=yes,resizable=yes'
        );

        // Poll for popup closure
        const pollTimer = setInterval(() => {
          try {
            if (popup?.closed) {
              clearInterval(pollTimer);
              // Check if authentication was successful
              setTimeout(() => {
                onAuthSuccess?.();
                toast({
                  title: "Connected to Google",
                  description: "Successfully connected to Google Search Console and Analytics."
                });
              }, 1000);
            }
          } catch (error) {
            // Cross-origin error is expected, ignore
          }
        }, 1000);
      }
    },
    onError: (error) => {
      console.error('Google authentication error:', error);
      toast({
        title: "Authentication Failed",
        description: "Failed to connect to Google services. Please check your credentials.",
        variant: "destructive"
      });
    }
  });

  return (
    <Button 
      onClick={() => authenticateGoogle.mutate()}
      disabled={disabled || authenticateGoogle.isPending}
      className="gap-2"
      variant="outline"
    >
      {authenticateGoogle.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <ExternalLink className="h-4 w-4" />
      )}
      {authenticateGoogle.isPending ? 'Connecting...' : 'Connect Google Services'}
    </Button>
  );
}