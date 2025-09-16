
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

interface AdminOrdersTableProps {
  orders: Order[];
}

export const AdminOrdersTable = ({ orders }: AdminOrdersTableProps) => {
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
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left p-2 text-white/90">Order #</th>
            <th className="text-left p-2 text-white/90">Customer</th>
            <th className="text-left p-2 text-white/90">Total</th>
            <th className="text-left p-2 text-white/90">Status</th>
            <th className="text-left p-2 text-white/90">Payment</th>
            <th className="text-left p-2 text-white/90">Date</th>
            <th className="text-left p-2 text-white/90">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
              <td className="p-2 font-mono text-sm text-white/90">
                {order.order_number || order.orderNumber || `#${order.id?.slice(0, 8) || 'N/A'}`}
              </td>
              <td className="p-2">
                <div>
                  <div className="font-medium text-white/90">
                    {order.profile?.first_name && order.profile?.last_name 
                      ? `${order.profile.first_name} ${order.profile.last_name}`
                      : 'Guest'
                    }
                  </div>
                  <div className="text-sm text-white/70">
                    {order.profile?.email || 'No email'}
                  </div>
                </div>
              </td>
              <td className="p-2 font-semibold text-white">
                ${typeof order.total_amount === 'number' 
                  ? order.total_amount.toFixed(2) 
                  : parseFloat(order.total_amount || '0').toFixed(2)}
              </td>
              <td className="p-2">
                <Badge className={getStatusColor(order.status || 'pending')}>
                  {order.status || 'pending'}
                </Badge>
              </td>
              <td className="p-2">
                <Badge variant={order.payment_status === 'completed' ? 'default' : 'secondary'}>
                  {order.payment_status || 'pending'}
                </Badge>
              </td>
              <td className="p-2 text-white/90">
                {order.created_at 
                  ? new Date(order.created_at).toLocaleDateString()
                  : new Date().toLocaleDateString()}
              </td>
              <td className="p-2">
                <OrderActions
                  orderId={order.id}
                  currentStatus={order.status || 'pending'}
                  currentPaymentStatus={order.payment_status || 'pending'}
                  orderNumber={order.order_number || order.orderNumber || `#${order.id?.slice(0, 8) || 'N/A'}`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
