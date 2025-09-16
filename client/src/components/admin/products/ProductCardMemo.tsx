import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye } from 'lucide-react';
import { ImageUtils } from '@/utils/imageUtils';

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity?: number;
  is_active: boolean;
  images?: string[];
}

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onView: (productId: string) => void;
}

const ProductCard = React.memo<ProductCardProps>(({ 
  product, 
  onEdit, 
  onDelete, 
  onView 
}) => {
  const imageUrl = ImageUtils.validateImageUrl(product.images);
  
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-16 h-16 object-cover rounded-lg"
            loading="lazy"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{product.name}</h3>
            <p className="text-sm text-muted-foreground">${product.price}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant={product.is_active ? "default" : "secondary"}>
                {product.is_active ? "Active" : "Inactive"}
              </Badge>
              {product.stock_quantity !== undefined && (
                <Badge variant={product.stock_quantity > 0 ? "outline" : "destructive"}>
                  Stock: {product.stock_quantity}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onView(product.id)}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(product)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(product.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;