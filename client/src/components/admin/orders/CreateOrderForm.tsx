
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { logger } from '@/utils/logger';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerSelection } from './CustomerSelection';
import { ProductSelection } from './ProductSelection';
import { OrderDetails } from './OrderDetails';
import { OrderSummary } from './OrderSummary';
import { useToast } from '@/hooks/use-toast';

const orderSchema = z.object({
  customer: z.object({
    id: z.string().optional(),
    email: z.string().email(),
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    phone: z.string().optional(),
    is_wholesale_application: z.boolean().optional(),
  }),
  items: z.array(z.object({
    product_id: z.string(),
    quantity: z.number().min(1),
    unit_price: z.number().min(0),
  })).min(1, 'At least one product is required'),
  shipping_address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zip: z.string().min(1),
    country: z.string().default('US'),
  }),
  billing_address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zip: z.string().min(1),
    country: z.string().default('US'),
  }),
  payment_method: z.string().min(1),
  shipping_amount: z.number().min(0).default(0),
  tax_amount: z.number().min(0).default(0),
  notes: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface CreateOrderFormProps {
  onOrderCreated: () => void;
}

export const CreateOrderForm = ({ onOrderCreated }: CreateOrderFormProps) => {
  const [currentTab, setCurrentTab] = useState('customer');
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customer: {
        email: '',
        first_name: '',
        last_name: '',
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
      payment_method: 'manual',
      shipping_amount: 0,
      tax_amount: 0,
      notes: '',
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: OrderFormData) => {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}`;
      
      // Calculate totals
      const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
      const total = subtotal + data.shipping_amount + data.tax_amount;

      // Handle customer - check if it's an existing profile or create new imported customer
      let customerId = data.customer.id;
      let isImportedCustomer = false;
      
      if (!customerId) {
        // Check if this is an existing user profile first
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', data.customer.email)
          .maybeSingle();

        if (existingProfile) {
          customerId = existingProfile.id;
          isImportedCustomer = false;
        } else {
          // Create as imported customer (not a system user)
          const { data: newImportedCustomer, error: customerError } = await supabase
            .from('imported_customers')
            .insert({
              email: data.customer.email,
              first_name: data.customer.first_name,
              last_name: data.customer.last_name,
              phone: data.customer.phone,
            })
            .select('id')
            .maybeSingle();

          if (customerError) throw customerError;
          if (!newImportedCustomer) throw new Error('Failed to create customer profile');
          customerId = newImportedCustomer.id;
          isImportedCustomer = true;
        }
      } else {
        // If customer has an ID, check if it's from wholesale applications
        if (data.customer.is_wholesale_application) {
          // Create an imported customer record for this wholesale customer
          const { data: newImportedCustomer, error: customerError } = await supabase
            .from('imported_customers')
            .insert({
              email: data.customer.email,
              first_name: data.customer.first_name,
              last_name: data.customer.last_name,
              phone: data.customer.phone,
            })
            .select('id')
            .maybeSingle();

          if (customerError) throw customerError;
          if (!newImportedCustomer) throw new Error('Failed to create imported customer');
          customerId = newImportedCustomer.id;
          isImportedCustomer = true;
        } else {
          // This is a regular user profile
          isImportedCustomer = false;
        }
      }

      // Create order with appropriate customer reference
      const orderData = {
        order_number: orderNumber,
        subtotal,
        total_amount: total,
        shipping_amount: data.shipping_amount,
        tax_amount: data.tax_amount,
        shipping_address: data.shipping_address,
        billing_address: sameAsBilling ? data.shipping_address : data.billing_address,
        payment_method: data.payment_method,
        payment_status: 'pending',
        status: 'pending',
        notes: data.notes,
        ...(isImportedCustomer 
          ? { imported_customer_id: customerId, user_id: null } 
          : { user_id: customerId, imported_customer_id: null }
        )
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select('id')
        .maybeSingle();

      if (orderError) throw orderError;
      if (!order) throw new Error('Failed to create order');

      // Create order items
      const orderItems = data.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Order created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      onOrderCreated();
    },
    onError: (error) => {
      logger.error('Error creating order:', error);
      toast({
        title: 'Error',
        description: 'Failed to create order. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: OrderFormData) => {
    // If same as billing is checked, copy shipping address to billing address
    if (sameAsBilling) {
      data.billing_address = { ...data.shipping_address };
    }
    createOrderMutation.mutate(data);
  };

  // Update billing address whenever shipping address or sameAsBilling changes
  useEffect(() => {
    if (sameAsBilling) {
      const shippingAddress = form.getValues('shipping_address');
      form.setValue('billing_address', { ...shippingAddress });
    }
  }, [sameAsBilling, form.watch('shipping_address')]);

  const canContinue = (tab: string) => {
    switch (tab) {
      case 'customer':
        return form.watch('customer.email') && form.watch('customer.first_name') && form.watch('customer.last_name');
      case 'products':
        return form.watch('items').length > 0;
      case 'details':
        return form.watch('shipping_address.street') && form.watch('payment_method');
      default:
        return true;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="products" disabled={!canContinue('customer')}>Products</TabsTrigger>
            <TabsTrigger value="details" disabled={!canContinue('products')}>Details</TabsTrigger>
            <TabsTrigger value="summary" disabled={!canContinue('details')}>Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="customer">
            <CustomerSelection form={form} />
          </TabsContent>

          <TabsContent value="products">
            <ProductSelection form={form} />
          </TabsContent>

          <TabsContent value="details">
            <OrderDetails form={form} sameAsBilling={sameAsBilling} setSameAsBilling={setSameAsBilling} />
          </TabsContent>

          <TabsContent value="summary">
            <OrderSummary form={form} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const tabs = ['customer', 'products', 'details', 'summary'];
              const currentIndex = tabs.indexOf(currentTab);
              if (currentIndex > 0) {
                setCurrentTab(tabs[currentIndex - 1]);
              }
            }}
            disabled={currentTab === 'customer'}
          >
            Previous
          </Button>

          {currentTab === 'summary' ? (
            <Button
              type="button"
              onClick={() => {
                form.handleSubmit(onSubmit)();
              }}
              disabled={createOrderMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {createOrderMutation.isPending ? 'Creating...' : 'Create Order'}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => {
                const tabs = ['customer', 'products', 'details', 'summary'];
                const currentIndex = tabs.indexOf(currentTab);
                if (currentIndex < tabs.length - 1 && canContinue(currentTab)) {
                  setCurrentTab(tabs[currentIndex + 1]);
                }
              }}
              disabled={!canContinue(currentTab)}
            >
              Next
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default CreateOrderForm;
