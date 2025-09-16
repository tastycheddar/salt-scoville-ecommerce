
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { CreateOrderFormData, CreateOrderCustomer } from '@/types/shared';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Plus } from 'lucide-react';

interface CustomerSelectionProps {
  form: UseFormReturn<CreateOrderFormData>;
}

export const CustomerSelection = ({ form }: CustomerSelectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewCustomer, setShowNewCustomer] = useState(false);

  const { data: customers } = useQuery({
    queryKey: ['customers', searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      
      // Search both profiles and wholesale applications
      const [profilesResult, wholesaleResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, email, first_name, last_name, phone, customer_type, address')
          .or(`email.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`)
          .limit(10),
        supabase
          .from('wholesale_applications')
          .select('id, email, contact_person, business_name, phone, business_address')
          .eq('status', 'approved')
          .or(`email.ilike.%${searchTerm}%,contact_person.ilike.%${searchTerm}%,business_name.ilike.%${searchTerm}%`)
          .limit(10)
      ]);

      if (profilesResult.error) throw profilesResult.error;
      if (wholesaleResult.error) throw wholesaleResult.error;

      // Combine results, mapping wholesale customers to profile format
      const profiles = profilesResult.data || [];
      const wholesale = (wholesaleResult.data || []).map(app => ({
        id: app.id,
        email: app.email,
        first_name: app.contact_person,
        last_name: app.business_name,
        phone: app.phone,
        customer_type: 'wholesale',
        business_address: app.business_address,
        is_wholesale_application: true
      }));

      return [...profiles, ...wholesale];
    },
    enabled: searchTerm.length > 1,
  });

  const selectCustomer = (customer: CreateOrderCustomer) => {
    form.setValue('customer', customer);
    
    // Populate shipping address from customer's stored address
    let customerAddress = null;
    if (customer.is_wholesale_application && customer.business_address) {
      // For wholesale customers from wholesale_applications table
      customerAddress = customer.business_address;
    } else if (customer.address) {
      // For regular customers from profiles table
      customerAddress = customer.address;
    }
    
    if (customerAddress) {
      form.setValue('shipping_address', {
        street: customerAddress.street || '',
        city: customerAddress.city || '',
        state: customerAddress.state || '',
        zip: customerAddress.zip || '',
        country: customerAddress.country || 'US',
      });
    }
    
    setSearchTerm('');
    setShowNewCustomer(false);
  };

  const selectedCustomer = form.watch('customer');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search existing customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowNewCustomer(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Customer
        </Button>
      </div>

      {customers && customers.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Search Results:</h3>
          {customers.map((customer) => (
            <Card key={customer.id} className="cursor-pointer hover:bg-gray-50" onClick={() => selectCustomer(customer)}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{customer.first_name} {customer.last_name}</p>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                    {customer.phone && <p className="text-sm text-gray-600">{customer.phone}</p>}
                  </div>
                  <Button variant="outline" size="sm">Select</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {(showNewCustomer || selectedCustomer?.email) && (
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
            </div>

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
                  <FormLabel>Phone (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
