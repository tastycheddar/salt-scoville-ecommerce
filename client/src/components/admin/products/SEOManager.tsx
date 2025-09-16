
import React, { useEffect, useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { EnhancedProductFormData } from './enhancedProductSchema';

interface SEOManagerProps {
  form: UseFormReturn<EnhancedProductFormData>;
}

const SEOManager: React.FC<SEOManagerProps> = ({ form }) => {
  const [newKeyword, setNewKeyword] = useState('');
  const productName = form.watch('name');
  const seoTitle = form.watch('seo_title');
  const seoDescription = form.watch('seo_description');
  const metaKeywords = form.watch('meta_keywords') || [];

  // Auto-generate slug from product name
  useEffect(() => {
    if (productName && !form.getValues('slug')) {
      const slug = productName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      form.setValue('slug', slug);
    }
  }, [productName, form]);

  // Auto-generate SEO title if empty
  const generateSEOTitle = () => {
    if (productName) {
      const autoTitle = `${productName} - Premium Hot Sauce | Salt & Scoville`;
      form.setValue('seo_title', autoTitle);
    }
  };

  // Auto-generate SEO description
  const generateSEODescription = () => {
    const shortDesc = form.getValues('short_description');
    if (productName && shortDesc) {
      const autoDesc = `${shortDesc} Experience the perfect heat with ${productName}. Premium quality hot sauce with authentic flavors. Order now for fast shipping.`;
      form.setValue('seo_description', autoDesc);
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !metaKeywords.includes(newKeyword.trim())) {
      const updatedKeywords = [...metaKeywords, newKeyword.trim()];
      form.setValue('meta_keywords', updatedKeywords);
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    const updatedKeywords = metaKeywords.filter((_, i) => i !== index);
    form.setValue('meta_keywords', updatedKeywords);
  };

  const calculateSEOScore = () => {
    let score = 0;
    if (seoTitle && seoTitle.length >= 30 && seoTitle.length <= 60) score += 25;
    if (seoDescription && seoDescription.length >= 120 && seoDescription.length <= 160) score += 25;
    if (metaKeywords.length >= 3) score += 25;
    if (form.getValues('slug')) score += 25;
    return score;
  };

  const seoScore = calculateSEOScore();

  return (
    <div className="space-y-6">
      {/* SEO Score */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">SEO Score</h4>
          <div className={`text-lg font-bold ${seoScore >= 75 ? 'text-green-600' : seoScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
            {seoScore}/100
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all ${seoScore >= 75 ? 'bg-green-500' : seoScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${seoScore}%` }}
          ></div>
        </div>
      </div>

      {/* URL Slug */}
      <FormField
        control={form.control}
        name="slug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL Slug</FormLabel>
            <FormControl>
              <Input placeholder="product-url-slug" {...field} />
            </FormControl>
            {field.value && (
              <p className="text-sm text-gray-500">
                URL: /products/{field.value}
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      {/* SEO Title */}
      <FormField
        control={form.control}
        name="seo_title"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>SEO Title</FormLabel>
              <Button type="button" variant="outline" size="sm" onClick={generateSEOTitle}>
                Auto-Generate
              </Button>
            </div>
            <FormControl>
              <Input placeholder="SEO optimized title" {...field} />
            </FormControl>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Recommended: 30-60 characters</span>
              <span className={field.value?.length > 60 ? 'text-red-500' : field.value?.length < 30 ? 'text-yellow-500' : 'text-green-500'}>
                {field.value?.length || 0}/60
              </span>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* SEO Description */}
      <FormField
        control={form.control}
        name="seo_description"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>SEO Description</FormLabel>
              <Button type="button" variant="outline" size="sm" onClick={generateSEODescription}>
                Auto-Generate
              </Button>
            </div>
            <FormControl>
              <Textarea placeholder="SEO meta description" {...field} />
            </FormControl>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Recommended: 120-160 characters</span>
              <span className={field.value?.length > 160 ? 'text-red-500' : field.value?.length < 120 ? 'text-yellow-500' : 'text-green-500'}>
                {field.value?.length || 0}/160
              </span>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Meta Keywords */}
      <div>
        <FormLabel>Meta Keywords</FormLabel>
        <div className="mt-2">
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Add keyword"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
            />
            <Button type="button" variant="outline" onClick={addKeyword}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {metaKeywords.map((keyword, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {keyword}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-500"
                  onClick={() => removeKeyword(index)}
                />
              </Badge>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Recommended: 3-8 relevant keywords
          </p>
        </div>
      </div>
    </div>
  );
};

export default SEOManager;
