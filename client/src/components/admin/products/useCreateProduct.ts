
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AdvancedProductFormData } from './advancedProductSchema';
import { logger } from '@/utils/logger';

export const useCreateProduct = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AdvancedProductFormData) => {
      // Generate slug from name
      const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Create the product via API
      const productData = {
        name: data.name,
        sku: data.sku,
        slug,
        price: data.price,
        shortDescription: data.short_description,
        description: data.description,
        stockQuantity: data.stock_quantity,
        lowStockThreshold: data.low_stock_threshold,
        weight: data.weight,
        heatLevel: data.heat_level,
        wholesalePrice: data.wholesale_price,
        costPrice: data.cost_price,
        seoTitle: data.seo_title,
        seoDescription: data.seo_description,
        images: data.images,
        categoryIds: data.category_ids || [],
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error('Failed to create product');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      toast.success('Product created successfully!');
      onSuccess?.();
    },
    onError: (error: any) => {
      logger.error('Error creating product:', error);
      toast.error('Failed to create product');
    },
  });
};
