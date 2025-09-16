
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Package, TrendingDown, TrendingUp } from 'lucide-react';
import { logger } from '@/utils/logger';

interface Product {
  id: string;
  name: string;
  sku: string;
  stock_quantity: number;
  low_stock_threshold: number;
  price: number;
  is_active: boolean;
}

const InventoryManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState<number>(0);
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'subtract'>('add');

  const { data: products, isLoading } = useQuery({
    queryKey: ['inventory-products'],
    queryFn: async () => {
      logger.info('Fetching inventory products', {}, 'InventoryManager');
      
      const response = await fetch('/api/products', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        logger.error('Failed to fetch inventory products', { status: response.status }, 'InventoryManager');
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform to match expected interface
      return data.map((product: any) => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        stock_quantity: product.quantity || 0,
        low_stock_threshold: 10, // Default threshold
        price: parseFloat(product.price?.toString() || '0'),
        is_active: product.status === 'active'
      })) as Product[];
    },
  });

  const updateStockMutation = useMutation({
    mutationFn: async ({ productId, newStock }: { productId: string; newStock: number }) => {
      logger.info('Updating product stock', { productId, newStock }, 'InventoryManager');
      
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          quantity: newStock,
          updatedAt: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        logger.error('Failed to update product stock', { status: response.status, productId, newStock }, 'InventoryManager');
        throw new Error(`Failed to update stock: ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-products'] });
      toast({
        title: "Stock Updated",
        description: "Product stock has been successfully updated.",
      });
      setSelectedProduct(null);
      setAdjustmentAmount(0);
    },
    onError: (error) => {
      logger.error('Stock update mutation failed', { error }, 'InventoryManager');
      toast({
        title: "Error",
        description: "Failed to update stock. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleStockAdjustment = () => {
    if (!selectedProduct || !products) return;

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const newStock = adjustmentType === 'add' 
      ? product.stock_quantity + adjustmentAmount
      : product.stock_quantity - adjustmentAmount;

    if (newStock < 0) {
      toast({
        title: "Invalid Adjustment",
        description: "Stock quantity cannot be negative.",
        variant: "destructive",
      });
      return;
    }

    updateStockMutation.mutate({ productId: selectedProduct, newStock });
  };

  const getLowStockProducts = () => {
    if (!products) return [];
    return products.filter(p => p.stock_quantity <= p.low_stock_threshold);
  };

  const getOutOfStockProducts = () => {
    if (!products) return [];
    return products.filter(p => p.stock_quantity === 0);
  };

  const getStockStatus = (product: Product) => {
    if (product.stock_quantity === 0) return 'out-of-stock';
    if (product.stock_quantity <= product.low_stock_threshold) return 'low-stock';
    return 'in-stock';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'out-of-stock':
        return <Badge variant="destructive">Out of Stock</Badge>;
      case 'low-stock':
        return <Badge variant="secondary">Low Stock</Badge>;
      default:
        return <Badge variant="default">In Stock</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </CardContent>
      </Card>
    );
  }

  const lowStockProducts = getLowStockProducts();
  const outOfStockProducts = getOutOfStockProducts();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
        <p className="text-gray-600">Monitor and manage product stock levels</p>
      </div>

      {/* Inventory Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockProducts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockProducts.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock ({lowStockProducts.length})</TabsTrigger>
          <TabsTrigger value="out-of-stock">Out of Stock ({outOfStockProducts.length})</TabsTrigger>
          <TabsTrigger value="adjust">Stock Adjustment</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products?.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{product.stock_quantity} units</p>
                        <p className="text-sm text-gray-600">Threshold: {product.low_stock_threshold}</p>
                      </div>
                      {getStatusBadge(getStockStatus(product))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="low-stock">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg border-yellow-200 bg-yellow-50">
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium text-yellow-700">{product.stock_quantity} units</p>
                        <p className="text-sm text-gray-600">Threshold: {product.low_stock_threshold}</p>
                      </div>
                      <Badge variant="secondary">Low Stock</Badge>
                    </div>
                  </div>
                ))}
                {lowStockProducts.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No low stock products</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="out-of-stock">
          <Card>
            <CardHeader>
              <CardTitle>Out of Stock Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {outOfStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg border-red-200 bg-red-50">
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium text-red-700">0 units</p>
                        <p className="text-sm text-gray-600">Needs Restocking</p>
                      </div>
                      <Badge variant="destructive">Out of Stock</Badge>
                    </div>
                  </div>
                ))}
                {outOfStockProducts.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No out of stock products</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adjust">
          <Card>
            <CardHeader>
              <CardTitle>Stock Adjustment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Product</label>
                <select
                  value={selectedProduct || ''}
                  onChange={(e) => setSelectedProduct(e.target.value || null)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Choose a product...</option>
                  {products?.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} (Current: {product.stock_quantity})
                    </option>
                  ))}
                </select>
              </div>

              {selectedProduct && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Adjustment Type</label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="add"
                          checked={adjustmentType === 'add'}
                          onChange={(e) => setAdjustmentType(e.target.value as 'add')}
                          className="mr-2"
                        />
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        Add Stock
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="subtract"
                          checked={adjustmentType === 'subtract'}
                          onChange={(e) => setAdjustmentType(e.target.value as 'subtract')}
                          className="mr-2"
                        />
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        Remove Stock
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Adjustment Amount</label>
                    <Input
                      type="number"
                      min="1"
                      value={adjustmentAmount}
                      onChange={(e) => setAdjustmentAmount(parseInt(e.target.value) || 0)}
                      placeholder="Enter amount"
                    />
                  </div>

                  <Button
                    onClick={handleStockAdjustment}
                    disabled={!selectedProduct || adjustmentAmount <= 0 || updateStockMutation.isPending}
                    className="w-full"
                  >
                    {updateStockMutation.isPending ? 'Updating...' : 'Apply Stock Adjustment'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryManager;
