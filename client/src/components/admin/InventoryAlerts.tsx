
import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Package } from 'lucide-react';
import { logger } from '@/utils/logger';

interface LowStockProduct {
  id: string;
  name: string;
  stock_quantity: number;
  low_stock_threshold: number;
  sku: string;
}

const InventoryAlerts: React.FC = () => {
  const { data: lowStockProducts = [], isLoading } = useQuery({
    queryKey: ['low-stock-products'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, stock_quantity, low_stock_threshold, sku')
          .eq('is_active', true)
          .not('stock_quantity', 'is', null)
          .not('low_stock_threshold', 'is', null)
          .order('stock_quantity', { ascending: true });

        if (error) {
          logger.error('Failed to fetch products for stock check', { error }, 'InventoryAlerts');
          throw error;
        }

        // Filter products where stock is at or below threshold (client-side)
        const lowStockItems = data?.filter(product => 
          product.stock_quantity <= product.low_stock_threshold
        ) || [];

        logger.info('Low stock products fetched', { count: lowStockItems.length }, 'InventoryAlerts');
        return lowStockItems as LowStockProduct[];
      } catch (error) {
        logger.error('Error in low stock query', { error }, 'InventoryAlerts');
        throw error;
      }
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  const getStockSeverity = (stock: number, threshold: number) => {
    if (stock === 0) return { variant: 'destructive' as const, label: 'Out of Stock' };
    if (stock <= threshold / 2) return { variant: 'destructive' as const, label: 'Critical' };
    return { variant: 'secondary' as const, label: 'Low Stock' };
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Inventory Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Loading inventory alerts...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Inventory Alerts
          </div>
          <Badge variant={lowStockProducts.length > 0 ? 'destructive' : 'default'}>
            {lowStockProducts.length} items
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {lowStockProducts.length === 0 ? (
          <div className="text-center py-4">
            <Package className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-gray-600">All products are well stocked!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lowStockProducts.map((product) => {
              const severity = getStockSeverity(product.stock_quantity, product.low_stock_threshold);
              return (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {product.stock_quantity} / {product.low_stock_threshold}
                    </span>
                    <Badge variant={severity.variant}>
                      {severity.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryAlerts;
