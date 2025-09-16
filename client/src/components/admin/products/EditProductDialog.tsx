
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import EditProductForm from './EditProductForm';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  short_description?: string;
  description?: string;
  category_id?: string;
  stock_quantity?: number;
  low_stock_threshold?: number;
  weight?: number;
  heat_level?: number;
  wholesale_price?: number;
  cost_price?: number;
  seo_title?: string;
  seo_description?: string;
  is_active?: boolean;
}

interface EditProductDialogProps {
  product: Product;
  categories: Array<{ id: string; name: string }>;
  onSuccess?: () => void;
}

const EditProductDialog: React.FC<EditProductDialogProps> = ({ 
  product, 
  categories, 
  onSuccess 
}) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product: {product.name}</DialogTitle>
        </DialogHeader>
        <EditProductForm 
          product={product}
          categories={categories} 
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
