
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { toast } from 'sonner';
import { AdvancedProductFormData } from '../advancedProductSchema';

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
  canonical_url?: string;
  og_image?: string;
  twitter_card_type?: string;
  structured_data?: any;
  seo_focus_keyword?: string;
  meta_robots?: string;
  schema_org_type?: string;
  meta_keywords?: string[];
}

export const useUpdateProduct = (product: Product, onSuccess: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AdvancedProductFormData) => {
      // Update product using backend API
      const response = await apiRequest(`/api/products/${product.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: data.name,
          sku: data.sku,
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
          // Advanced SEO fields  
          slug: data.slug || data.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          updatedAt: new Date().toISOString()
        })
      });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['productCategories', product.id] });
      toast.success('Product updated successfully with enhanced SEO!');
      onSuccess();
    },
    onError: (error: any) => {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    },
  });
};
