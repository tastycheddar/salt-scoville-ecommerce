import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EmailNotificationHistoryProps {
  orderId: string;
}

interface EmailNotification {
  id: string;
  type: 'order_confirmation' | 'shipping_notification' | 'delivery_confirmation';
  status: 'sent' | 'failed' | 'pending';
  sentAt: string;
  recipient: string;
  subject: string;
  error?: string;
}

export const EmailNotificationHistory: React.FC<EmailNotificationHistoryProps> = ({ orderId }) => {
  const { data: emailHistory, isLoading, refetch } = useQuery({
    queryKey: ['emailHistory', orderId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/orders/${orderId}/email-history`);
      if (!response.ok) {
        throw new Error('Failed to fetch email history');
      }
      return response.json() as EmailNotification[];
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Mail className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEmailTypeLabel = (type: string) => {
    switch (type) {
      case 'order_confirmation':
        return 'Order Confirmation';
      case 'shipping_notification':
        return 'Shipping Notification';
      case 'delivery_confirmation':
        return 'Delivery Confirmation';
      default:
        return type;
    }
  };

  const handleResendEmail = async (emailId: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/resend-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailId }),
      });

      if (response.ok) {
        refetch();
      }
    } catch (error) {
      console.error('Failed to resend email:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Notifications
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="ml-auto"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!emailHistory || emailHistory.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No email notifications found for this order
          </div>
        ) : (
          <div className="space-y-3">
            {emailHistory.map((email) => (
              <div
                key={email.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(email.status)}
                  <div>
                    <div className="font-medium text-sm">
                      {getEmailTypeLabel(email.type)}
                    </div>
                    <div className="text-xs text-gray-500">
                      To: {email.recipient}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(email.sentAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    {email.error && (
                      <div className="text-xs text-red-600 mt-1">
                        Error: {email.error}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(email.status)}>
                    {email.status}
                  </Badge>
                  {email.status === 'failed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResendEmail(email.id)}
                    >
                      Resend
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};