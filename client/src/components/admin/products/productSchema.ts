
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
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
  short_description: z.string().optional(),
  description: z.string().optional(),
  category_ids: z.array(z.string()).optional().default([]),
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
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  images: z.array(z.string()).optional().default([]),
});

export type ProductFormData = z.infer<typeof productSchema>;
