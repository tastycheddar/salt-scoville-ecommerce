
import { AdvancedProductFormData } from '../advancedProductSchema';
import { SEOSchemaGenerator } from '@/utils/seoSchema';

export const generateProductSchema = (data: AdvancedProductFormData) => {
  return SEOSchemaGenerator.generateProductSchema({
    name: data.name,
    description: data.description,
    sku: data.sku,
    price: data.price,
    image: data.images,
    currency: 'USD',
    availability: 'https://schema.org/InStock',
    brand: 'Salt & Scoville'
  });
};

export const validateSEO = (data: AdvancedProductFormData) => {
  const issues = [];
  const recommendations = [];

  if (!data.seo_title || data.seo_title.length < 30) {
    issues.push('SEO title is too short');
  }
  if (!data.seo_description || data.seo_description.length < 120) {
    issues.push('Meta description is too short');
  }
  if (!data.seo_focus_keyword) {
    recommendations.push('Add a focus keyword for better SEO');
  }

  return { issues, recommendations };
};
