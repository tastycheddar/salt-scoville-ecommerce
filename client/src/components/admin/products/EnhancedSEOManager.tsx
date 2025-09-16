
import React, { useEffect, useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Eye, Code, AlertCircle, CheckCircle } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { AdvancedProductFormData, seoValidation } from './advancedProductSchema';

interface EnhancedSEOManagerProps {
  form: UseFormReturn<AdvancedProductFormData>;
}

const EnhancedSEOManager: React.FC<EnhancedSEOManagerProps> = ({ form }) => {
  const [newKeyword, setNewKeyword] = useState('');
  const [previewMode, setPreviewMode] = useState<'google' | 'facebook' | 'twitter'>('google');
  const [schemaErrors, setSchemaErrors] = useState<string[]>([]);

  const watchedValues = form.watch([
    'name', 'seo_title', 'seo_description', 'seo_focus_keyword', 
    'meta_keywords', 'structured_data', 'og_image', 'images'
  ]);

  const [name, seoTitle, seoDescription, focusKeyword, metaKeywords, structuredData, ogImage, images] = watchedValues;

  // Auto-generate slug from product name
  useEffect(() => {
    if (name && !form.getValues('slug')) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      form.setValue('slug', slug);
    }
  }, [name, form]);

  // Calculate SEO Score
  const seoScore = seoValidation.calculateSEOScore(form.getValues());

  // Auto-generate SEO title
  const generateSEOTitle = () => {
    if (name) {
      const autoTitle = `${name} - Premium Hot Sauce | Salt & Scoville`;
      form.setValue('seo_title', autoTitle);
    }
  };

  // Auto-generate SEO description
  const generateSEODescription = () => {
    const shortDesc = form.getValues('short_description');
    if (name && shortDesc) {
      const autoDesc = `${shortDesc} Experience the perfect heat with ${name}. Premium quality hot sauce with authentic flavors. Order now for fast shipping.`;
      form.setValue('seo_description', autoDesc);
    }
  };

  // Auto-generate canonical URL
  const generateCanonicalURL = () => {
    const slug = form.getValues('slug');
    if (slug) {
      form.setValue('canonical_url', `https://saltandscoville.com/products/${slug}`);
    }
  };

  // Generate structured data
  const generateStructuredData = () => {
    const formData = form.getValues();
    const structuredData: any = {
      "@context": "https://schema.org",
      "@type": formData.schema_org_type || "Product",
      "name": formData.name,
      "description": formData.seo_description || formData.short_description,
      "sku": formData.sku,
      "brand": {
        "@type": "Brand",
        "name": "Salt & Scoville"
      },
      "offers": {
        "@type": "Offer",
        "price": formData.price?.toString(),
        "priceCurrency": "USD",
        "availability": formData.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
      }
    };

    if (formData.images && formData.images.length > 0) {
      structuredData["image"] = formData.images[0];
    }

    if (formData.weight) {
      structuredData["weight"] = {
        "@type": "QuantitativeValue",
        "value": formData.weight,
        "unitCode": "OZT"
      };
    }

    form.setValue('structured_data', structuredData);
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !(metaKeywords || []).includes(newKeyword.trim())) {
      const updatedKeywords = [...(metaKeywords || []), newKeyword.trim()];
      form.setValue('meta_keywords', updatedKeywords);
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    const updatedKeywords = (metaKeywords || []).filter((_, i) => i !== index);
    form.setValue('meta_keywords', updatedKeywords);
  };

  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const validateSchema = () => {
    try {
      if (structuredData) {
        JSON.stringify(structuredData);
        setSchemaErrors([]);
        return true;
      }
    } catch (error) {
      setSchemaErrors(['Invalid JSON structure']);
      return false;
    }
    return true;
  };

  return (
    <div className="space-y-6">
      {/* SEO Score Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>SEO Performance</span>
            <div className={`px-3 py-1 rounded-full text-sm font-bold ${getSEOScoreColor(seoScore)}`}>
              {seoScore}/100
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className={`h-3 rounded-full transition-all ${
                seoScore >= 80 ? 'bg-green-500' : seoScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${seoScore}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              {seoTitle && seoValidation.titleLength(seoTitle).isValid ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <span>Title Length</span>
            </div>
            <div className="flex items-center space-x-2">
              {seoDescription && seoValidation.descriptionLength(seoDescription).isValid ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <span>Description</span>
            </div>
            <div className="flex items-center space-x-2">
              {focusKeyword && seoTitle && seoDescription && 
               seoValidation.focusKeyword(seoTitle, seoDescription, focusKeyword).isValid ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <span>Focus Keyword</span>
            </div>
            <div className="flex items-center space-x-2">
              {structuredData && Object.keys(structuredData).length > 0 ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <span>Schema</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic SEO</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
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

          {/* Focus Keyword */}
          <FormField
            control={form.control}
            name="seo_focus_keyword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Focus Keyword</FormLabel>
                <FormControl>
                  <Input placeholder="main keyword for this product" {...field} />
                </FormControl>
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
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={generateSEOTitle}
                    className="border-orange-500 text-orange-600 hover:bg-orange-50 hover:text-orange-700 bg-white"
                  >
                    Auto-Generate
                  </Button>
                </div>
                <FormControl>
                  <Input placeholder="SEO optimized title" {...field} />
                </FormControl>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Recommended: 30-60 characters</span>
                  <span className={(field.value?.length || 0) > 60 ? 'text-red-500' : (field.value?.length || 0) < 30 ? 'text-yellow-500' : 'text-green-500'}>
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
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={generateSEODescription}
                    className="border-orange-500 text-orange-600 hover:bg-orange-50 hover:text-orange-700 bg-white"
                  >
                    Auto-Generate
                  </Button>
                </div>
                <FormControl>
                  <Textarea placeholder="SEO meta description" {...field} />
                </FormControl>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Recommended: 120-160 characters</span>
                  <span className={(field.value?.length || 0) > 160 ? 'text-red-500' : (field.value?.length || 0) < 120 ? 'text-yellow-500' : 'text-green-500'}>
                    {field.value?.length || 0}/160
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Canonical URL */}
          <FormField
            control={form.control}
            name="canonical_url"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Canonical URL</FormLabel>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={generateCanonicalURL}
                    className="border-orange-500 text-orange-600 hover:bg-orange-50 hover:text-orange-700 bg-white"
                  >
                    Auto-Generate
                  </Button>
                </div>
                <FormControl>
                  <Input placeholder="https://saltandscoville.com/products/..." {...field} />
                </FormControl>
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
                {(metaKeywords || []).map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {keyword}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-500"
                      onClick={() => removeKeyword(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          {/* Open Graph Image */}
          <FormField
            control={form.control}
            name="og_image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Open Graph Image</FormLabel>
                <FormControl>
                  <Input placeholder="URL to social media image" {...field} />
                </FormControl>
                <p className="text-sm text-gray-500">
                  Recommended size: 1200x630px
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Twitter Card Type */}
          <FormField
            control={form.control}
            name="twitter_card_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter Card Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select card type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="summary">Summary</SelectItem>
                    <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                    <SelectItem value="app">App</SelectItem>
                    <SelectItem value="player">Player</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Meta Robots */}
          <FormField
            control={form.control}
            name="meta_robots"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Robots</FormLabel>
                <FormControl>
                  <Input placeholder="index,follow" {...field} />
                </FormControl>
                <p className="text-sm text-gray-500">
                  Control how search engines crawl this page
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>

        <TabsContent value="schema" className="space-y-4">
          {/* Schema Type */}
          <FormField
            control={form.control}
            name="schema_org_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Schema.org Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select schema type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="CreativeWork">Creative Work</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Generate Schema Button */}
          <div className="flex justify-between items-center">
            <Button 
              type="button" 
              onClick={generateStructuredData} 
              variant="outline"
              className="border-orange-500 text-orange-600 hover:bg-orange-50 hover:text-orange-700 bg-white"
            >
              <Code className="h-4 w-4 mr-2" />
              Generate Schema
            </Button>
            <Button 
              type="button" 
              onClick={validateSchema} 
              variant="outline"
              className="border-orange-500 text-orange-600 hover:bg-orange-50 hover:text-orange-700 bg-white"
            >
              Validate Schema
            </Button>
          </div>

          {/* Schema Errors */}
          {schemaErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <h4 className="text-red-800 font-medium">Schema Validation Errors:</h4>
              <ul className="text-red-700 text-sm mt-1">
                {schemaErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Structured Data JSON Editor */}
          <FormField
            control={form.control}
            name="structured_data"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Structured Data (JSON-LD)</FormLabel>
                <FormControl>
                  <Textarea
                    className="font-mono text-sm min-h-[200px]"
                    placeholder="JSON-LD structured data"
                    value={field.value ? JSON.stringify(field.value, null, 2) : ''}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        field.onChange(parsed);
                        setSchemaErrors([]);
                      } catch (error) {
                        setSchemaErrors(['Invalid JSON format']);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <div className="flex space-x-2 mb-4">
            <Button
              type="button"
              variant={previewMode === 'google' ? 'default' : 'outline'}
              onClick={() => setPreviewMode('google')}
              size="sm"
            >
              Google
            </Button>
            <Button
              type="button"
              variant={previewMode === 'facebook' ? 'default' : 'outline'}
              onClick={() => setPreviewMode('facebook')}
              size="sm"
            >
              Facebook
            </Button>
            <Button
              type="button"
              variant={previewMode === 'twitter' ? 'default' : 'outline'}
              onClick={() => setPreviewMode('twitter')}
              size="sm"
            >
              Twitter
            </Button>
          </div>

          {/* Google Preview */}
          {previewMode === 'google' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Google Search Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                    {seoTitle || name || 'Product Title'}
                  </div>
                  <div className="text-green-700 text-sm">
                    saltandscoville.com › products › {form.getValues('slug') || 'product-slug'}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {seoDescription || 'No meta description available for this product.'}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Facebook Preview */}
          {previewMode === 'facebook' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Facebook Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden max-w-md">
                  {ogImage && (
                    <img src={ogImage} alt="OG Preview" className="w-full h-48 object-cover" />
                  )}
                  <div className="p-3 bg-gray-50">
                    <div className="text-gray-500 text-xs uppercase">SALTANDSCOVILLE.COM</div>
                    <div className="font-semibold text-sm mt-1">
                      {seoTitle || name || 'Product Title'}
                    </div>
                    <div className="text-gray-600 text-sm mt-1">
                      {seoDescription || 'No description available.'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Twitter Preview */}
          {previewMode === 'twitter' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Twitter Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden max-w-md">
                  {ogImage && (
                    <img src={ogImage} alt="Twitter Preview" className="w-full h-48 object-cover" />
                  )}
                  <div className="p-3">
                    <div className="font-semibold text-sm">
                      {seoTitle || name || 'Product Title'}
                    </div>
                    <div className="text-gray-600 text-sm mt-1">
                      {seoDescription || 'No description available.'}
                    </div>
                    <div className="text-gray-500 text-xs mt-2">
                      saltandscoville.com
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedSEOManager;
