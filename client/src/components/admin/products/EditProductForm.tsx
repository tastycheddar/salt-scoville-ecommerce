
import React from 'react';
import {
  Form,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { AdvancedProductFormData } from './advancedProductSchema';
import BasicInfoSection from './forms/BasicInfoSection';
import CategoryImageSection from './forms/CategoryImageSection';
import PricingSection from './forms/PricingSection';
import InventorySection from './forms/InventorySection';
import AdvancedSEOSection from './forms/AdvancedSEOSection';
import { useEditProductForm } from './hooks/useEditProductForm';
import { useUpdateProduct } from './hooks/useUpdateProduct';

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
  images?: string[];
  // Advanced SEO fields
  canonical_url?: string;
  og_image?: string;
  twitter_card_type?: string;
  structured_data?: any;
  seo_focus_keyword?: string;
  meta_robots?: string;
  schema_org_type?: string;
  meta_keywords?: string[];
}

interface EditProductFormProps {
  product: Product;
  categories: Array<{ id: string; name: string }>;
  onCancel: () => void;
  onSuccess: () => void;
}

const EditProductForm: React.FC<EditProductFormProps> = ({ 
  product, 
  categories, 
  onCancel, 
  onSuccess 
}) => {
  const { form } = useEditProductForm(product);
  const updateProductMutation = useUpdateProduct(product, onSuccess);

  const onSubmit = (data: AdvancedProductFormData) => {
    updateProductMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicInfoSection control={form.control} />
        <CategoryImageSection control={form.control} categories={categories} />
        <InventorySection control={form.control} />
        <PricingSection control={form.control} />
        <AdvancedSEOSection form={form} />

        <div className="flex justify-end space-x-2 pt-6 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-gray-400 text-gray-700 hover:bg-gray-50 hover:text-gray-800 bg-white"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={updateProductMutation.isPending}
            className="bg-flame-red hover:bg-flame-red/90"
          >
            {updateProductMutation.isPending ? 'Updating...' : 'Update Product'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditProductForm;
