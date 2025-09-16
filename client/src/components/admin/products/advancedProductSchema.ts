
import { z } from 'zod';

export const advancedProductSchema = z.object({
  // Basic Information
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  short_description: z.string().optional(),
  description: z.string().optional(),
  category_ids: z.array(z.string()).optional(),
  
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
  
  // Advanced SEO Fields
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  meta_keywords: z.array(z.string()).optional(),
  slug: z.string().optional(),
  canonical_url: z.string().url().optional().or(z.literal('')),
  og_image: z.string().optional(),
  twitter_card_type: z.enum(['summary', 'summary_large_image', 'app', 'player']).default('summary_large_image'),
  seo_focus_keyword: z.string().optional(),
  meta_robots: z.string().default('index,follow'),
  schema_org_type: z.string().default('Product'),
  
  // Schema & Structured Data
  structured_data: z.record(z.any()).optional(),
  schema_markup: z.record(z.any()).optional(),
  
  // Advanced Settings
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  wholesale_available: z.boolean().default(true),
});

export type AdvancedProductFormData = z.infer<typeof advancedProductSchema>;

// SEO validation utilities
export const seoValidation = {
  titleLength: (title: string) => ({
    isValid: title.length >= 30 && title.length <= 60,
    score: title.length >= 30 && title.length <= 60 ? 25 : 0,
    message: title.length < 30 ? 'Title too short (min 30 chars)' : title.length > 60 ? 'Title too long (max 60 chars)' : 'Good length'
  }),
  
  descriptionLength: (description: string) => ({
    isValid: description.length >= 120 && description.length <= 160,
    score: description.length >= 120 && description.length <= 160 ? 25 : 0,
    message: description.length < 120 ? 'Description too short (min 120 chars)' : description.length > 160 ? 'Description too long (max 160 chars)' : 'Good length'
  }),
  
  focusKeyword: (title: string, description: string, keyword: string) => {
    if (!keyword) return { isValid: false, score: 0, message: 'No focus keyword set' };
    
    const titleHasKeyword = title.toLowerCase().includes(keyword.toLowerCase());
    const descriptionHasKeyword = description.toLowerCase().includes(keyword.toLowerCase());
    
    const score = (titleHasKeyword ? 15 : 0) + (descriptionHasKeyword ? 10 : 0);
    
    return {
      isValid: titleHasKeyword && descriptionHasKeyword,
      score,
      message: titleHasKeyword && descriptionHasKeyword ? 'Focus keyword optimized' : 'Focus keyword missing from title or description'
    };
  },
  
  calculateSEOScore: (data: Partial<AdvancedProductFormData>) => {
    let totalScore = 0;
    const maxScore = 100;
    
    // Title optimization (25 points)
    if (data.seo_title) {
      totalScore += seoValidation.titleLength(data.seo_title).score;
    }
    
    // Description optimization (25 points)
    if (data.seo_description) {
      totalScore += seoValidation.descriptionLength(data.seo_description).score;
    }
    
    // Focus keyword optimization (25 points)
    if (data.seo_focus_keyword && data.seo_title && data.seo_description) {
      totalScore += seoValidation.focusKeyword(data.seo_title, data.seo_description, data.seo_focus_keyword).score;
    }
    
    // Schema markup (15 points)
    if (data.structured_data && Object.keys(data.structured_data).length > 0) {
      totalScore += 15;
    }
    
    // Images and media (10 points)
    if (data.og_image || (data.images && data.images.length > 0)) {
      totalScore += 10;
    }
    
    return Math.min(totalScore, maxScore);
  }
};
