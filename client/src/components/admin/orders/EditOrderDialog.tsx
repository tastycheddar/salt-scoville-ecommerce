import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus } from 'lucide-react';

const editOrderSchema = z.object({
  customer: z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().optional(),
  }),
  items: z.array(z.object({
    id: z.string().optional(),
    product_id: z.string(),
    product_name: z.string(),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    unit_price: z.number().min(0, 'Price must be positive'),
    total_price: z.number(),
  })).min(1, 'At least one item is required'),
  shipping_address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zip: z.string().min(1, 'ZIP code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  billing_address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zip: z.string().min(1, 'ZIP code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  shipping_amount: z.number().min(0),
  tax_amount: z.number().min(0),
  notes: z.string().optional(),
  status: z.string(),
  payment_status: z.string(),
  payment_method: z.string(),
});

type EditOrderFormData = z.infer<typeof editOrderSchema>;

interface EditOrderDialogProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const EditOrderDialog = ({ orderId, isOpen, onClose }: EditOrderDialogProps) => {
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch order details
  const { data: orderData, isLoading } = useQuery({
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

  // Fetch products for dropdown
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('/api/products?status=active', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.map((product: any) => ({
        id: product.id,
        name: product.name,
        price: product.price
      }));
    },
    enabled: isOpen,
  });

  const form = useForm<EditOrderFormData>({
    resolver: zodResolver(editOrderSchema),
    defaultValues: {
      customer: {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
      },
      items: [],
      shipping_address: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'US',
      },
      billing_address: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'US',
      },
      shipping_amount: 0,
      tax_amount: 0,
      notes: '',
      status: 'pending',
      payment_status: 'pending',
      payment_method: '',
    },
  });

  // Populate form when data loads
  useEffect(() => {
    if (orderData) {
      const { order, customer, items } = orderData;
      
      form.reset({
        customer: {
          first_name: customer?.first_name || '',
          last_name: customer?.last_name || '',
          email: customer?.email || '',
          phone: customer?.phone || '',
        },
        items: items.length > 0 ? items.map(item => ({
          id: item.id,
          product_id: item.product_id,
          product_name: item.products?.name || 'Unknown Product',
          quantity: item.quantity,
          unit_price: Number(item.unit_price),
          total_price: Number(item.total_price),
        })) : [{
          product_id: '',
          product_name: '',
          quantity: 1,
          unit_price: 0,
          total_price: 0,
        }],
        shipping_address: (order.shipping_address as any) || {
          street: '',
          city: '',
          state: '',
          zip: '',
          country: 'US',
        },
        billing_address: (order.billing_address as any) || {
          street: '',
          city: '',
          state: '',
          zip: '',
          country: 'US',
        },
        shipping_amount: Number(order.shipping_amount || 0),
        tax_amount: Number(order.tax_amount || 0),
        notes: order.notes || '',
        status: order.status || 'pending',
        payment_status: order.payment_status || 'pending',
        payment_method: order.payment_method || '',
      });

      // Check if addresses are the same
      const shipping = order.shipping_address as any;
      const billing = order.billing_address as any;
      if (shipping && billing) {
        const addressesMatch = 
          shipping.street === billing.street &&
          shipping.city === billing.city &&
          shipping.state === billing.state &&
          shipping.zip === billing.zip &&
          shipping.country === billing.country;
        setSameAsBilling(addressesMatch);
      }
    }
  }, [orderData, form]);

  const updateOrderMutation = useMutation({
    mutationFn: async (data: EditOrderFormData) => {
      // Calculate new totals
      const subtotal = data.items.reduce((sum, item) => sum + item.total_price, 0);
      const total = subtotal + data.shipping_amount + data.tax_amount;

      const updateData = {
        customer: data.customer,
        items: data.items,
        subtotal,
        totalAmount: total,
        shippingAmount: data.shipping_amount,
        taxAmount: data.tax_amount,
        shippingAddress: data.shipping_address,
        billingAddress: sameAsBilling ? data.shipping_address : data.billing_address,
        notes: data.notes,
        status: data.status,
        paymentStatus: data.payment_status,
        paymentMethod: data.payment_method,
      };

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update order');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Order updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      queryClient.invalidateQueries({ queryKey: ['orderDetails', orderId] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update order',
        variant: 'destructive',
      });
    },
  });

  const addItem = () => {
    const currentItems = form.getValues('items');
    form.setValue('items', [
      ...currentItems,
      {
        product_id: '',
        product_name: '',
        quantity: 1,
        unit_price: 0,
        total_price: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues('items');
    form.setValue('items', currentItems.filter((_, i) => i !== index));
  };

  const updateItemPrice = (index: number, productId: string) => {
    const product = products?.find(p => p.id === productId);
    if (product) {
      const currentItems = form.getValues('items');
      const quantity = currentItems[index].quantity;
      const newPrice = Number(product.price);
      const total = quantity * newPrice;
      
      form.setValue(`items.${index}.product_name`, product.name);
      form.setValue(`items.${index}.unit_price`, newPrice);
      form.setValue(`items.${index}.total_price`, total);
    }
  };

  const updateItemTotal = (index: number) => {
    const currentItems = form.getValues('items');
    const item = currentItems[index];
    const total = item.quantity * item.unit_price;
    form.setValue(`items.${index}.total_price`, total);
  };

  const onSubmit = (data: EditOrderFormData) => {
    if (sameAsBilling) {
      data.billing_address = { ...data.shipping_address };
    }
    updateOrderMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border border-white/20">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Edit Order #{orderData?.order.order_number}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Update order details, customer information, and items.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="customer" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="customer">Customer</TabsTrigger>
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              {/* Customer Tab */}
              <TabsContent value="customer" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customer.first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customer.last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customer.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customer.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Items Tab */}
              <TabsContent value="items" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Order Items</h3>
                  <Button type="button" onClick={addItem} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {form.watch('items').map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-12 gap-4 items-end">
                        <div className="col-span-4">
                          <FormField
                            control={form.control}
                            name={`items.${index}.product_id`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Product</FormLabel>
                                <Select
                                  value={field.value}
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    updateItemPrice(index, value);
                                  }}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select product" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {products?.map((product) => (
                                      <SelectItem key={product.id} value={product.id}>
                                        {product.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="col-span-2">
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(Number(e.target.value));
                                      updateItemTotal(index);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="col-span-2">
                          <FormField
                            control={form.control}
                            name={`items.${index}.unit_price`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Unit Price</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(Number(e.target.value));
                                      updateItemTotal(index);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="col-span-2">
                          <FormField
                            control={form.control}
                            name={`items.${index}.total_price`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Total</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    {...field}
                                    readOnly
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="col-span-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(index)}
                            className="w-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Addresses Tab */}
              <TabsContent value="addresses" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Shipping Address */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Shipping Address</h3>
                    <FormField
                      control={form.control}
                      name="shipping_address.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="shipping_address.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shipping_address.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="shipping_address.zip"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shipping_address.country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium">Billing Address</h3>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={sameAsBilling}
                          onChange={(e) => setSameAsBilling(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Same as shipping</span>
                      </label>
                    </div>
                    
                    {!sameAsBilling && (
                      <>
                        <FormField
                          control={form.control}
                          name="billing_address.street"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Street Address</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="billing_address.city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="billing_address.state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="billing_address.zip"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ZIP Code</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="billing_address.country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Status</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="payment_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Status</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="refunded">Refunded</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="payment_method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="credit_card">Credit Card</SelectItem>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                            <SelectItem value="manual">Manual/Cash</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="shipping_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shipping</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="tax_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Order notes..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updateOrderMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {updateOrderMutation.isPending ? 'Updating...' : 'Update Order'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};