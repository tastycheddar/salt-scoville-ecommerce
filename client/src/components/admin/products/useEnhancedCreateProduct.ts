
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/hooks/use-toast';
import { EnhancedProductFormData } from './enhancedProductSchema';

export const useEnhancedCreateProduct = (onSuccess?: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EnhancedProductFormData) => {
      // Generate slug from name if not provided
      const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      // Generate basic schema markup
      const schemaMarkup = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": data.name,
        "description": data.description || data.short_description,
        "sku": data.sku,
        "offers": {
          "@type": "Offer",
          "price": data.price,
          "priceCurrency": "USD",
          "availability": data.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
        },
        "brand": {
          "@type": "Brand",
          "name": "Salt & Scoville"
        }
      };

      if (data.images && data.images.length > 0) {
        schemaMarkup["image"] = data.images;
      }

      const productData = {
        name: data.name,
        sku: data.sku,
        price: data.price,
        short_description: data.short_description || '',
        description: data.description || '',
        category_id: data.category_id || null,
        stock_quantity: data.stock_quantity,
        low_stock_threshold: data.low_stock_threshold,
        minimum_order_quantity: data.minimum_order_quantity || 1,
        weight: data.weight || null,
        heat_level: data.heat_level || null,
        wholesale_price: data.wholesale_price || null,
        cost_price: data.cost_price || null,
        wholesale_available: data.wholesale_available,
        seo_title: data.seo_title || null,
        seo_description: data.seo_description || null,
        meta_keywords: data.meta_keywords || [],
        slug,
        is_active: data.is_active,
        is_featured: data.is_featured,
        images: data.images || [],
        ingredients: data.ingredients || [],
        allergens: data.allergens || [],
        schema_markup: schemaMarkup,
        nutritional_info: data.nutritional_info || {},
        dimensions: data.dimensions || {},
      };

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      const product = await response.json();
      return product;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Product created successfully with all enhanced features',
      });
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create product',
        variant: 'destructive',
      });
    },
  });
};
