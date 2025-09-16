
import React, { useState } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import EditProductDialog from './EditProductDialog';
import DeleteProductDialog from './DeleteProductDialog';
import AdminProductCardMobile from './AdminProductCardMobile';

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

interface AdminProductsTableProps {
  products: Product[];
  categories: Array<{ id: string; name: string }>;
}

import ProductSEOStatus from './ProductSEOStatus';

const AdminProductsTable: React.FC<AdminProductsTableProps> = ({ products, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const getCategoryName = (product: Product): string | undefined => {
    if (product.product_categories && product.product_categories.length > 0) {
      return product.product_categories[0].categories?.name;
    }
    return undefined;
  };

  // Mobile Card View
  if (isMobile) {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <AdminProductCardMobile
                  key={`product-${product.id}`}
            product={product}
            categories={categories}
            getCategoryName={() => getCategoryName(product)}
          />
        ))}
      </div>
    );
  }

  // Desktop Table View
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>SEO Status</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                      <Package className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{product.name}</div>
                    {product.is_featured && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm">{product.sku}</TableCell>
              <TableCell>
                {getCategoryName(product) || 'Uncategorized'}
              </TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <span>{product.stock_quantity}</span>
                  {product.stock_quantity <= product.low_stock_threshold && (
                    <Badge variant="destructive" className="text-xs">
                      Low Stock
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <ProductSEOStatus product={product} />
              </TableCell>
              <TableCell>
                <Badge variant={product.is_active ? "default" : "secondary"}>
                  {product.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminProductsTable;
