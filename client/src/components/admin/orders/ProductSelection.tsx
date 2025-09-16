
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useProducts } from '@/hooks/useProducts';
import { CreateOrderFormData, CreateOrderItem, Product } from '@/types/shared';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface ProductSelectionProps {
  form: UseFormReturn<CreateOrderFormData>;
}

export const ProductSelection = ({ form }: ProductSelectionProps) => {
  const { data: products, isLoading } = useProducts();
  const selectedItems = form.watch('items') || [];

  const addProduct = (product: { id: string; name: string; price: number; sku: string; wholesale_price?: number }) => {
    const existingIndex = selectedItems.findIndex((item: CreateOrderItem) => item.product_id === product.id);
    const customer = form.watch('customer');
    
    // Use wholesale price if customer is wholesale and product has wholesale pricing
    const isWholesaleCustomer = customer?.customer_type === 'wholesale' || customer?.is_wholesale_application;
    const unitPrice = isWholesaleCustomer && product.wholesale_price 
      ? Number(product.wholesale_price) 
      : Number(product.price);
    
    if (existingIndex >= 0) {
      const newItems = [...selectedItems];
      newItems[existingIndex].quantity = (newItems[existingIndex].quantity || 0) + 1;
      form.setValue('items', newItems);
    } else {
      form.setValue('items', [
        ...selectedItems,
        {
          product_id: product.id,
          quantity: 1,
          unit_price: unitPrice,
          product_name: product.name,
        }
      ]);
    }
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(index);
      return;
    }

    const newItems = [...selectedItems];
    if (newItems[index]) {
      newItems[index].quantity = quantity;
      form.setValue('items', newItems);
    }
  };

  const updatePrice = (index: number, price: number) => {
    const newItems = [...selectedItems];
    if (newItems[index]) {
      newItems[index].unit_price = price;
      form.setValue('items', newItems);
    }
  };

  const removeItem = (index: number) => {
    const newItems = selectedItems.filter((_: CreateOrderItem, i: number) => i !== index);
    form.setValue('items', newItems);
  };

  const subtotal = selectedItems.reduce((sum: number, item: CreateOrderItem) => 
    sum + ((item.quantity || 0) * (item.unit_price || 0)), 0
  );

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Available Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products?.map((product) => (
            <Card key={product.id} className="cursor-pointer hover:bg-gray-50">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{product.short_description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">${Number(product.price).toFixed(2)}</Badge>
                      {product.heat_level && (
                        <Badge variant="secondary">Heat: {product.heat_level}/10</Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={() => addProduct(product)}
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedItems.map((item: CreateOrderItem, index: number) => (
                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product_name}</h4>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(index, (item.quantity || 0) - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                     <Input
                       type="number"
                       value={item.quantity || 0}
                       onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 0)}
                       className="w-20 text-center"
                       min="1"
                     />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(index, (item.quantity || 0) + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span>$</span>
                     <Input
                       type="number"
                       value={item.unit_price || 0}
                       onChange={(e) => updatePrice(index, parseFloat(e.target.value) || 0)}
                       className="w-24"
                       step="0.01"
                       min="0"
                     />
                  </div>

                   <div className="w-24 text-right font-medium">
                     ${((item.quantity || 0) * (item.unit_price || 0)).toFixed(2)}
                   </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <FormField
        control={form.control}
        name="items"
        render={() => (
          <FormItem>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
