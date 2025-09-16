import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, CheckCircle, XCircle, Star, AlertTriangle } from 'lucide-react';
import EditProductDialog from './EditProductDialog';
import DeleteProductDialog from './DeleteProductDialog';
import ProductSEOStatus from './ProductSEOStatus';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  category_id?: string;
  stock_quantity: number;
  low_stock_threshold: number;
  is_active: boolean;
  is_featured: boolean;
  images?: string[];
  canonical_url?: string;
  structured_data?: any;
  seo_title?: string;
  seo_description?: string;
  seo_focus_keyword?: string;
  product_categories?: Array<{
    categories?: { id: string; name: string };
  }>;
}

interface AdminProductCardMobileProps {
  product: Product;
  categories: Array<{ id: string; name: string }>;
  getCategoryName: () => string | undefined;
}

const AdminProductCardMobile: React.FC<AdminProductCardMobileProps> = ({ 
  product, 
  categories, 
  getCategoryName 
}) => {
  return (
    <Card className="bg-card/95 backdrop-blur-sm border-border shadow-lg">
      <CardContent className="p-4">
        {/* Product Header */}
        <div className="flex items-start space-x-3 mb-3">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="h-12 w-12 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
              <Package className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate">{product.name}</h3>
            <p className="text-sm text-muted-foreground font-mono">{product.sku}</p>
            {product.is_featured && (
              <Badge variant="secondary" className="text-xs mt-1">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Price</p>
            <p className="text-lg font-semibold text-foreground">${product.price}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Stock</p>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-foreground">{product.stock_quantity}</span>
              {product.stock_quantity <= product.low_stock_threshold && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Low Stock
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Category and Status Row */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Category</p>
            <p className="text-sm text-foreground">{getCategoryName() || 'Uncategorized'}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Status</p>
            <Badge variant={product.is_active ? "default" : "secondary"}>
              {product.is_active ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 mr-1" />
                  Inactive
                </>
              )}
            </Badge>
          </div>
        </div>

        {/* SEO Status */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">SEO Status</p>
          <ProductSEOStatus product={product} />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 pt-3 border-t border-border">
          <EditProductDialog
            product={product}
            categories={categories}
            onSuccess={() => window.location.reload()}
          />
          <DeleteProductDialog
            productId={product.id}
            productName={product.name}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminProductCardMobile;