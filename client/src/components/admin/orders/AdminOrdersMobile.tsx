
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { OrderActions } from './OrderActions';

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  profile?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
}

interface AdminOrdersMobileProps {
  orders: Order[];
}

export const AdminOrdersMobile = ({ orders }: AdminOrdersMobileProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {orders?.map((order) => (
        <div key={order.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-mono text-sm text-white/90">#{order.order_number}</p>
              <p className="text-lg font-semibold text-white">${Number(order.total_amount).toFixed(2)}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Badge className={getStatusColor(order.status || 'pending')}>
                {order.status || 'pending'}
              </Badge>
              <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                {order.payment_status || 'pending'}
              </Badge>
            </div>
          </div>
          
          <div className="mb-3">
            <p className="font-medium text-white/90">
              {order.profile?.first_name && order.profile?.last_name 
                ? `${order.profile.first_name} ${order.profile.last_name}`
                : 'Guest'
              }
            </p>
            <p className="text-sm text-white/70">
              {order.profile?.email || 'No email'}
            </p>
            <p className="text-sm text-white/70">
              {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex justify-center">
            <OrderActions
              orderId={order.id}
              currentStatus={order.status || 'pending'}
              currentPaymentStatus={order.payment_status || 'pending'}
              orderNumber={order.order_number}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
