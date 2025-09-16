import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, 
  User, 
  MapPin, 
  CreditCard, 
  Edit3, 
  Save, 
  X,
  Calendar,
  DollarSign
} from 'lucide-react';

const editOrderSchema = z.object({
  status: z.string(),
  payment_status: z.string(),
  tracking_number: z.string().optional(),
  notes: z.string().optional(),
});

type EditOrderFormData = z.infer<typeof editOrderSchema>;

interface OrderViewEditDialogProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderViewEditDialog = ({ orderId, isOpen, onClose }: OrderViewEditDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch order details
  const { data: orderData, isLoading, error } = useQuery({
    queryKey: ['orderDetails', orderId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/orders/${orderId}/details`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch order details: ${response.statusText}`);
      }

      return response.json();
    },
    enabled: isOpen && !!orderId,
  });

  const form = useForm<EditOrderFormData>({
    resolver: zodResolver(editOrderSchema),
    values: orderData ? {
      status: orderData.status || 'pending',
      payment_status: orderData.payment_status || 'pending',
      tracking_number: orderData.tracking_number || '',
      notes: orderData.notes || '',
    } : undefined,
  });

  // Update order mutation
  const updateOrderMutation = useMutation({
    mutationFn: async (data: EditOrderFormData) => {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orderDetails', orderId] });
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Order updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update order',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: EditOrderFormData) => {
    updateOrderMutation.mutate(data);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num || 0);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return new Date().toLocaleDateString();
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return new Date().toLocaleDateString();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Loading Order Details...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !orderData) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Error Loading Order</DialogTitle>
          </DialogHeader>
          <div className="text-center p-8">
            <p className="text-red-600">Failed to load order details. Please try again.</p>
            <Button onClick={onClose} className="mt-4">Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-semibold">
            Order {orderData.order_number || orderData.orderNumber || `#${orderId.slice(0, 8)}`}
          </DialogTitle>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)} 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => setIsEditing(false)} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button 
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={updateOrderMutation.isPending}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {updateOrderMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <h3 className="text-lg font-medium">Order Items</h3>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>
                {orderData.items?.map((item: any, index: number) => (
                  <div key={index} className="px-4 py-3 grid grid-cols-12 gap-4 border-t">
                    <div className="col-span-6">
                      <div className="font-medium">{item.product_snapshot?.name || item.name || 'Unknown Product'}</div>
                      {item.product_snapshot?.description && (
                        <div className="text-sm text-gray-600">{item.product_snapshot.description}</div>
                      )}
                    </div>
                    <div className="col-span-2 text-center">{item.quantity}</div>
                    <div className="col-span-2 text-right">{formatCurrency(item.unit_price)}</div>
                    <div className="col-span-2 text-right font-medium">{formatCurrency(item.total_price)}</div>
                  </div>
                )) || (
                  <div className="p-4 text-center text-gray-500">No items found</div>
                )}
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <h3 className="text-lg font-medium">Customer Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm">
                    {orderData.first_name && orderData.last_name 
                      ? `${orderData.first_name} ${orderData.last_name}`
                      : orderData.profile?.first_name && orderData.profile?.last_name
                      ? `${orderData.profile.first_name} ${orderData.profile.last_name}`
                      : 'Guest Customer'
                    }
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{orderData.email || orderData.profile?.email || 'No email provided'}</p>
                </div>
              </div>
            </div>

            {/* Addresses */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <h3 className="text-lg font-medium">Addresses</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orderData.shipping_address ? (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Shipping Address</Label>
                    <div className="text-sm space-y-1">
                      <p>{orderData.shipping_address.street}</p>
                      <p>
                        {orderData.shipping_address.city}, {orderData.shipping_address.state} {orderData.shipping_address.zip}
                      </p>
                      <p>{orderData.shipping_address.country || 'US'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Shipping Address</Label>
                    <p className="text-sm text-gray-500">No shipping address provided</p>
                  </div>
                )}
                {orderData.billing_address ? (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Billing Address</Label>
                    <div className="text-sm space-y-1">
                      <p>{orderData.billing_address.street}</p>
                      <p>
                        {orderData.billing_address.city}, {orderData.billing_address.state} {orderData.billing_address.zip}
                      </p>
                      <p>{orderData.billing_address.country || 'US'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Billing Address</Label>
                    <p className="text-sm text-gray-500">No billing address provided</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Details Sidebar */}
          <div className="space-y-6">
            {/* Status and Payment */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Order Status</h3>
              {!isEditing ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <Badge className={getStatusColor(orderData.status || 'pending')}>
                      {orderData.status || 'pending'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Payment</span>
                    <Badge variant={orderData.payment_status === 'completed' ? 'default' : 'secondary'}>
                      {orderData.payment_status || orderData.paymentStatus || 'pending'}
                    </Badge>
                  </div>
                  {orderData.tracking_number && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Tracking</span>
                      <span className="text-sm font-mono">{orderData.tracking_number}</span>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Order Status</Label>
                    <Select 
                      value={form.watch('status')} 
                      onValueChange={(value) => form.setValue('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment_status">Payment Status</Label>
                    <Select 
                      value={form.watch('payment_status')} 
                      onValueChange={(value) => form.setValue('payment_status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tracking_number">Tracking Number</Label>
                    <Input
                      id="tracking_number"
                      {...form.register('tracking_number')}
                      placeholder="Enter tracking number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      {...form.register('notes')}
                      placeholder="Order notes"
                    />
                  </div>
                </form>
              )}
            </div>

            <Separator />

            {/* Order Totals */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                <h3 className="text-lg font-medium">Order Summary</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(orderData.subtotal || orderData.total_amount)}</span>
                </div>
                {orderData.shipping_amount && parseFloat(orderData.shipping_amount) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{formatCurrency(orderData.shipping_amount)}</span>
                  </div>
                )}
                {orderData.tax_amount && parseFloat(orderData.tax_amount) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>{formatCurrency(orderData.tax_amount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(orderData.total_amount || orderData.totalAmount)}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Order Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <h3 className="text-lg font-medium">Order Information</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Order Date:</span>
                  <br />
                  {formatDate(orderData.created_at)}
                </div>
                {orderData.paypal_order_id && (
                  <div>
                    <span className="font-medium">PayPal ID:</span>
                    <br />
                    <span className="font-mono text-xs">{orderData.paypal_order_id}</span>
                  </div>
                )}
                {orderData.payment_provider && (
                  <div>
                    <span className="font-medium">Payment Method:</span>
                    <br />
                    {orderData.payment_provider}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};