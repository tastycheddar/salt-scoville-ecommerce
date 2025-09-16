
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';
import { CheckCircle, XCircle, Mail, Loader2 } from 'lucide-react';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'resend'>('loading');
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const token = searchParams.get('token');
  const type = searchParams.get('type');

  useEffect(() => {
    if (token && type === 'email') {
      verifyEmail();
    } else {
      setStatus('resend');
    }
  }, [token, type]);

  const verifyEmail = async () => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (!response.ok) {
        logger.error('Email verification failed', { error: result.error, token }, 'EmailVerification');
        setStatus('error');
        toast({
          title: 'Verification Failed',
          description: result.error || 'Email verification failed',
          variant: 'destructive'
        });
      } else {
        logger.info('Email verified successfully', {}, 'EmailVerification');
        setStatus('success');
        toast({
          title: 'Email Verified',
          description: 'Your email has been successfully verified!'
        });
        setTimeout(() => navigate('/'), 3000);
      }
    } catch (error) {
      logger.error('Email verification error', { error }, 'EmailVerification');
      setStatus('error');
    }
  };

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        logger.error('Resend verification failed', { error: result.error }, 'EmailVerification');
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        logger.info('Verification email resent', { email: user.email }, 'EmailVerification');
        toast({
          title: 'Email Sent',
          description: 'Verification email has been sent to your inbox.'
        });
      }
    } catch (error) {
      logger.error('Resend verification error', { error }, 'EmailVerification');
      toast({
        title: 'Error',
        description: 'Failed to resend verification email.',
        variant: 'destructive'
      });
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <Loader2 className="h-12 w-12 text-orange-500 mx-auto mb-4 animate-spin" />
            <CardTitle>Verifying Email</CardTitle>
            <CardDescription>Please wait while we verify your email address...</CardDescription>
          </>
        );

      case 'success':
        return (
          <>
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <CardTitle>Email Verified!</CardTitle>
            <CardDescription>
              Your email has been successfully verified. You'll be redirected to the homepage shortly.
            </CardDescription>
          </>
        );

      case 'error':
        return (
          <>
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Verification Failed</CardTitle>
            <CardDescription>
              The verification link is invalid or has expired. Please try again.
            </CardDescription>
          </>
        );

      case 'resend':
        return (
          <>
            <Mail className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <CardTitle>Verify Your Email</CardTitle>
            <CardDescription>
              Please check your email and click the verification link to activate your account.
            </CardDescription>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {renderContent()}
        </CardHeader>
        <CardContent className="space-y-4">
          {(status === 'error' || status === 'resend') && (
            <Button
              onClick={handleResendVerification}
              disabled={isResending}
              className="w-full"
            >
              {isResending ? 'Sending...' : 'Resend Verification Email'}
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="w-full"
          >
            Go to Homepage
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
