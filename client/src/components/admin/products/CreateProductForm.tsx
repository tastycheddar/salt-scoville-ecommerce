
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { advancedProductSchema, AdvancedProductFormData } from './advancedProductSchema';
import { useCreateProduct } from './useCreateProduct';
import BasicInfoSection from './forms/BasicInfoSection';
import CategoryImageSection from './forms/CategoryImageSection';
import PricingSection from './forms/PricingSection';
import InventorySection from './forms/InventorySection';
import SEOSection from './forms/SEOSection';

interface CreateProductFormProps {
  categories: Array<{ id: string; name: string }>;
  onCancel: () => void;
  onSuccess: () => void;
}

const CreateProductForm: React.FC<CreateProductFormProps> = ({ categories, onCancel, onSuccess }) => {
  const form = useForm<AdvancedProductFormData>({
    resolver: zodResolver(advancedProductSchema),
    defaultValues: {
      name: '',
      sku: '',
      price: 0,
      short_description: '',
      description: '',
      category_ids: [],
      stock_quantity: 0,
      low_stock_threshold: 10,
      weight: 0,
      heat_level: 1,
      wholesale_price: 0,
      cost_price: 0,
      seo_title: '',
      seo_description: '',
      images: [],
      meta_keywords: [],
      twitter_card_type: 'summary_large_image',
      meta_robots: 'index,follow',
      schema_org_type: 'Product',
      structured_data: {},
    },
  });

  const createProductMutation = useCreateProduct(() => {
    onSuccess();
    form.reset();
  });

  const onSubmit = (data: AdvancedProductFormData) => {
    createProductMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <BasicInfoSection control={form.control} />
        <CategoryImageSection control={form.control} categories={categories} />
        <PricingSection control={form.control} />
        <InventorySection control={form.control} />
        <SEOSection control={form.control} />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={createProductMutation.isPending}
            className="bg-flame-red hover:bg-flame-red/90"
          >
            {createProductMutation.isPending ? 'Creating...' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateProductForm;
