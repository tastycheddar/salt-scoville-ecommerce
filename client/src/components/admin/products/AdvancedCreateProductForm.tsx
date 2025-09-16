
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';
import {
  Form,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { advancedProductSchema, AdvancedProductFormData } from './advancedProductSchema';
import BasicInfoSection from './forms/BasicInfoSection';
import CategoryImageSection from './forms/CategoryImageSection';
import PricingSection from './forms/PricingSection';
import InventorySection from './forms/InventorySection';
import AdvancedSEOSection from './forms/AdvancedSEOSection';

interface AdvancedCreateProductFormProps {
  categories: Array<{ id: string; name: string }>;
  onSuccess: () => void;
  onCancel: () => void;
}

const AdvancedCreateProductForm: React.FC<AdvancedCreateProductFormProps> = ({ 
  categories, 
  onSuccess, 
  onCancel 
}) => {
  const queryClient = useQueryClient();

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

  const createProductMutation = useMutation({
    mutationFn: async (data: AdvancedProductFormData) => {

      // Generate basic structured data if not provided
      if (!data.structured_data || Object.keys(data.structured_data).length === 0) {
        data.structured_data = {
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": data.name,
          "description": data.description,
          "offers": {
            "@type": "Offer",
            "price": data.price,
            "priceCurrency": "USD"
          }
        };
      }

      // Create the product via Express API
      const productPayload = {
        name: data.name,
        sku: data.sku,
        slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        price: data.price,
        shortDescription: data.short_description,
        description: data.description,
        quantity: data.stock_quantity,
        weight: data.weight,
        heatLevel: data.heat_level,
        compareAtPrice: data.wholesale_price,
        cost: data.cost_price,
        seoTitle: data.seo_title,
        seoDescription: data.seo_description,
        images: data.images,
        status: 'active',
        // Additional SEO fields for future expansion
        tags: data.meta_keywords || []
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productPayload),
      });

      if (!response.ok) {
        throw new Error(`Failed to create product: ${response.statusText}`);
      }

      const productData = await response.json();
      if (!productData) throw new Error('Failed to create product');

      // Handle category relationships via Express API
      if (data.category_ids && data.category_ids.length > 0) {
        const categoryResponse = await fetch(`/api/products/${productData.id}/categories`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ categoryIds: data.category_ids }),
        });

        if (!categoryResponse.ok) {
          throw new Error(`Failed to assign categories: ${categoryResponse.statusText}`);
        }
      }

      return productData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      toast.success('Product created successfully with enhanced SEO!');
      onSuccess();
    },
    onError: (error: any) => {
      logger.error('Error creating product:', error);
      toast.error('Failed to create product');
    },
  });

  const onSubmit = (data: AdvancedProductFormData) => {
    createProductMutation.mutate(data);
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

export default AdvancedCreateProductForm;
