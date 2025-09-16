
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, Package } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { EnhancedProductFormData } from './enhancedProductSchema';

interface InventoryManagerProps {
  form: UseFormReturn<EnhancedProductFormData>;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({ form }) => {
  const stockQuantity = form.watch('stock_quantity') || 0;
  const lowStockThreshold = form.watch('low_stock_threshold') || 10;
  const price = form.watch('price') || 0;
  const costPrice = form.watch('cost_price') || 0;
  const wholesalePrice = form.watch('wholesale_price') || 0;

  // Calculate profit margins
  const retailMargin = costPrice > 0 ? ((price - costPrice) / price) * 100 : 0;
  const wholesaleMargin = costPrice > 0 && wholesalePrice > 0 ? ((wholesalePrice - costPrice) / wholesalePrice) * 100 : 0;

  const getStockStatus = () => {
    if (stockQuantity === 0) return { status: 'Out of Stock', color: 'destructive', icon: Package };
    if (stockQuantity <= lowStockThreshold) return { status: 'Low Stock', color: 'warning', icon: AlertTriangle };
    return { status: 'In Stock', color: 'default', icon: TrendingUp };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="space-y-6">
      {/* Stock Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <stockStatus.icon className="h-5 w-5" />
            Inventory Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stockQuantity}</div>
              <div className="text-sm text-gray-600">Current Stock</div>
              <Badge variant={stockStatus.color as any} className="mt-1">
                {stockStatus.status}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{retailMargin.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Retail Margin</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{wholesaleMargin.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Wholesale Margin</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Retail Price *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="wholesale_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wholesale Price</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cost_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cost Price</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Stock Management */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="stock_quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Stock *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  placeholder="0"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="low_stock_threshold"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Low Stock Alert</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  placeholder="10"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="minimum_order_quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Order Qty</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1" 
                  placeholder="1"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Wholesale Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Wholesale Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="wholesale_available"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Available for Wholesale
                  </FormLabel>
                  <div className="text-sm text-gray-600">
                    Allow this product to be purchased by wholesale customers
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManager;
