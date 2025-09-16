
import { z } from 'zod';

export const enhancedProductSchema = z.object({
  // Basic Information
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  short_description: z.string().optional(),
  description: z.string().optional(),
  category_id: z.string().optional(),
  
  // Pricing & Inventory
  price: z.union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val);
        if (isNaN(parsed)) throw new Error('Invalid price format');
        return parsed;
      }
      return val;
    })
    .pipe(z.number().min(0, 'Price must be positive')),
  wholesale_price: z.union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === 'string') {
        if (val === '') return undefined;
        const parsed = parseFloat(val);
        if (isNaN(parsed)) throw new Error('Invalid wholesale price format');
        return parsed;
      }
      return val;
    })
    .pipe(z.number().min(0).optional()),
  cost_price: z.union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === 'string') {
        if (val === '') return undefined;
        const parsed = parseFloat(val);
        if (isNaN(parsed)) throw new Error('Invalid cost price format');
        return parsed;
      }
      return val;
    })
    .pipe(z.number().min(0).optional()),
  stock_quantity: z.union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === 'string') {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed)) throw new Error('Invalid stock quantity format');
        return parsed;
      }
      return val;
    })
    .pipe(z.number().min(0, 'Stock quantity must be positive')),
  low_stock_threshold: z.union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === 'string') {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed)) throw new Error('Invalid low stock threshold format');
        return parsed;
      }
      return val;
    })
    .pipe(z.number().min(0, 'Low stock threshold must be positive')),
  minimum_order_quantity: z.union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === 'string') {
        if (val === '') return undefined;
        const parsed = parseInt(val, 10);
        if (isNaN(parsed)) throw new Error('Invalid minimum order quantity format');
        return parsed;
      }
      return val;
    })
    .pipe(z.number().min(1, 'Minimum order quantity must be at least 1').optional()),
  
  // Product Details
  weight: z.union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === 'string') {
        if (val === '') return undefined;
        const parsed = parseFloat(val);
        if (isNaN(parsed)) throw new Error('Invalid weight format');
        return parsed;
      }
      return val;
    })
    .pipe(z.number().optional()),
  heat_level: z.union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === 'string') {
        if (val === '') return undefined;
        const parsed = parseInt(val, 10);
        if (isNaN(parsed)) throw new Error('Invalid heat level format');
        return parsed;
      }
      return val;
    })
    .pipe(z.number().min(1).max(5).optional()),
  ingredients: z.array(z.string()).optional(),
  allergens: z.array(z.string()).optional(),
  nutritional_info: z.record(z.any()).optional(),
  dimensions: z.record(z.any()).optional(),
  
  // Images
  images: z.array(z.string()).optional(),
  
  // SEO & Schema
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  meta_keywords: z.array(z.string()).optional(),
  slug: z.string().optional(),
  schema_markup: z.record(z.any()).optional(),
  
  // Advanced Settings
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  wholesale_available: z.boolean().default(true),
});

export type EnhancedProductFormData = z.infer<typeof enhancedProductSchema>;
