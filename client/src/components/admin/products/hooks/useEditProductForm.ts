
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { advancedProductSchema, AdvancedProductFormData } from '../advancedProductSchema';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  slug?: string;
  // Support both API response (camelCase) and legacy (snake_case) field names
  shortDescription?: string;
  short_description?: string;
  description?: string;
  category_id?: string;
  quantity?: number;
  stock_quantity?: number;
  low_stock_threshold?: number;
  weight?: number;
  heatLevel?: number;
  heat_level?: number;
  compareAtPrice?: number;
  wholesale_price?: number;
  cost?: number;
  cost_price?: number;
  seoTitle?: string;
  seo_title?: string;
  seoDescription?: string;
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

export const useEditProductForm = (product: Product) => {
  // Fetch current product categories
  const { data: productCategories } = useQuery({
    queryKey: ['productCategories', product.id],
    queryFn: async () => {
      const data = await apiRequest(`/api/products/${product.id}/categories`);
      return data.map((pc: any) => pc.categoryId || pc.category_id);
    },
  });

  const form = useForm<AdvancedProductFormData>({
    resolver: zodResolver(advancedProductSchema),
    defaultValues: {
      // Basic Information - Map API response fields to form fields
      name: product.name || '',
      sku: product.sku || '',
      short_description: product.shortDescription || product.short_description || '',
      description: product.description || '',
      category_ids: [],
      
      // Pricing & Inventory - Map API response fields to form fields
      price: Number(product.price) || 0,
      wholesale_price: Number(product.compareAtPrice) || Number(product.wholesale_price) || 0,
      cost_price: Number(product.cost) || Number(product.cost_price) || 0,
      stock_quantity: product.quantity || product.stock_quantity || 0,
      low_stock_threshold: product.low_stock_threshold || 10,
      minimum_order_quantity: 1,
      
      // Product Details - Map API response fields to form fields
      weight: Number(product.weight) || 0,
      heat_level: product.heatLevel || product.heat_level || 1,
      ingredients: [],
      allergens: [],
      nutritional_info: {},
      dimensions: {},
      
      // Images
      images: Array.isArray(product.images) ? product.images : [],
      
      // Advanced SEO Fields - Map API response fields to form fields
      seo_title: product.seoTitle || product.seo_title || '',
      seo_description: product.seoDescription || product.seo_description || '',
      meta_keywords: Array.isArray(product.meta_keywords) ? product.meta_keywords : [],
      slug: product.slug || '',
      canonical_url: product.canonical_url || '',
      og_image: product.og_image || '',
      twitter_card_type: (product.twitter_card_type as any) || 'summary_large_image',
      seo_focus_keyword: product.seo_focus_keyword || '',
      meta_robots: product.meta_robots || 'index,follow',
      schema_org_type: product.schema_org_type || 'Product',
      
      // Schema & Structured Data
      structured_data: product.structured_data || {},
      schema_markup: {},
      
      // Advanced Settings
      is_active: product.is_active !== undefined ? product.is_active : true,
      is_featured: false,
      wholesale_available: true,
    },
  });

  // Update category_ids when productCategories loads
  useEffect(() => {
    if (productCategories) {
      form.setValue('category_ids', productCategories);
    }
  }, [productCategories, form]);

  return { form, productCategories };
};
