import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

import { Truck, Package, CheckCircle, Clock } from 'lucide-react';

interface OrderStatusManagerProps {
  order: { 
    id: string; 
    status: string; 
    order_number: string;
    tracking_number?: string;
    carrier?: string;
    total_amount?: number;
    profiles?: { email?: string; first_name?: string; last_name?: string };
  };
  onStatusUpdate: () => void;
}

const OrderStatusManager: React.FC<OrderStatusManagerProps> = ({ order, onStatusUpdate }) => {
  const [status, setStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || '');
  const [carrier, setCarrier] = useState(order.carrier || '');
  const [notes, setNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const statusOptions = [
    { value: 'pending', label: 'Pending', icon: Clock },
    { value: 'processing', label: 'Processing', icon: Package },
    { value: 'shipped', label: 'Shipped', icon: Truck },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle },
  ];

  const carrierOptions = [
    'USPS', 'UPS', 'FedEx', 'DHL', 'Other'
  ];

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      const updateData: { status: string; tracking_number?: string; shipped_at?: string; delivered_at?: string; carrier?: string; notes?: string } = {
        status,
        notes: notes || undefined,
      };

      if (status === 'shipped') {
        updateData.tracking_number = trackingNumber;
        updateData.carrier = carrier;
        updateData.shipped_at = new Date().toISOString();
      }

      if (status === 'delivered') {
        updateData.delivered_at = new Date().toISOString();
      }

      const response = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update order: ${response.statusText}`);
      }

      // Send notification email via API
      await fetch('/api/orders/send-notification', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          type: status === 'shipped' ? 'shipped' : status === 'delivered' ? 'delivered' : 'status_update',
          customerEmail: order.profiles?.email,
          customerName: `${order.profiles?.first_name || ''} ${order.profiles?.last_name || ''}`.trim(),
          orderNumber: order.order_number,
          orderTotal: order.total_amount,
          trackingNumber: trackingNumber || undefined
        })
      });

      toast({
        title: 'Order Updated',
        description: `Order status updated to ${status}`,
      });

      setNotes('');
      onStatusUpdate();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="glass-card border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Update Order Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="status" className="text-white">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="bg-white/10 border-white/30 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {status === 'shipped' && (
          <>
            <div>
              <Label htmlFor="tracking" className="text-white">Tracking Number</Label>
              <Input
                id="tracking"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
              />
            </div>
            <div>
              <Label htmlFor="carrier" className="text-white">Carrier</Label>
              <Select value={carrier} onValueChange={setCarrier}>
                <SelectTrigger className="bg-white/10 border-white/30 text-white">
                  <SelectValue placeholder="Select carrier" />
                </SelectTrigger>
                <SelectContent>
                  {carrierOptions.map((carrierOption) => (
                    <SelectItem key={carrierOption} value={carrierOption}>
                      {carrierOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <div>
          <Label htmlFor="notes" className="text-white">Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about this status update..."
            className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
          />
        </div>

        <Button
          onClick={handleStatusUpdate}
          disabled={isUpdating}
          className="w-full bg-flame-red hover:bg-flame-red/80 text-white"
        >
          {isUpdating ? 'Updating...' : 'Update Status'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default OrderStatusManager;