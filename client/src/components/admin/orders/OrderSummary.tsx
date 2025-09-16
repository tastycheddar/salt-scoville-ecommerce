
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CreateOrderFormData, CreateOrderItem } from '@/types/shared';

interface OrderSummaryProps {
  form: UseFormReturn<CreateOrderFormData>;
}

export const OrderSummary = ({ form }: OrderSummaryProps) => {
  const formData = form.watch();
  const { customer, items, shipping_address, billing_address, payment_method, shipping_amount, tax_amount, notes } = formData;

  const subtotal = items?.reduce((sum: number, item: CreateOrderItem) => sum + (item.quantity * item.unit_price), 0) || 0;
  const total = subtotal + (shipping_amount || 0) + (tax_amount || 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Name:</strong> {customer?.first_name} {customer?.last_name}</p>
            <p><strong>Email:</strong> {customer?.email}</p>
            {customer?.phone && <p><strong>Phone:</strong> {customer?.phone}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {items?.map((item: CreateOrderItem) => (
              <div key={`order-item-${item.product_id || item.product_name}`} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity} × ${item.unit_price.toFixed(2)}</p>
                </div>
                <p className="font-medium">${(item.quantity * item.unit_price).toFixed(2)}</p>
              </div>
            ))}
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {shipping_amount > 0 && (
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>${shipping_amount.toFixed(2)}</span>
                </div>
              )}
              {tax_amount > 0 && (
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${tax_amount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shipping Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <p>{shipping_address?.street}</p>
            <p>{shipping_address?.city}, {shipping_address?.state} {shipping_address?.zip}</p>
            <p>{shipping_address?.country}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment & Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Payment Method:</strong> {payment_method}</p>
            {notes && (
              <div>
                <strong>Notes:</strong>
                <p className="text-sm text-gray-600 mt-1">{notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
