import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { enhancedProductSchema, EnhancedProductFormData } from './enhancedProductSchema';
import { useEnhancedCreateProduct } from './useEnhancedCreateProduct';
import ImageUploadManager from './ImageUploadManager';
import SEOManager from './SEOManager';
import InventoryManager from './InventoryManager';

interface EnhancedCreateProductFormProps {
  categories: Array<{ id: string; name: string }>;
  onCancel: () => void;
  onSuccess: () => void;
}

const commonAllergens = ['Gluten', 'Dairy', 'Nuts', 'Soy', 'Eggs', 'Fish', 'Shellfish', 'Sesame'];
const commonIngredients = ['Peppers', 'Vinegar', 'Salt', 'Garlic', 'Onion', 'Sugar', 'Spices', 'Natural Flavors'];

const EnhancedCreateProductForm: React.FC<EnhancedCreateProductFormProps> = ({ 
  categories, 
  onCancel, 
  onSuccess 
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [newIngredient, setNewIngredient] = useState('');
  const [newAllergen, setNewAllergen] = useState('');

  const form = useForm<EnhancedProductFormData>({
    resolver: zodResolver(enhancedProductSchema),
    defaultValues: {
      name: '',
      sku: '',
      price: 0,
      short_description: '',
      description: '',
      stock_quantity: 0,
      low_stock_threshold: 10,
      weight: 0,
      heat_level: 1,
      wholesale_price: 0,
      cost_price: 0,
      seo_title: '',
      seo_description: '',
      is_active: true,
      is_featured: false,
      wholesale_available: true,
      images: [],
      ingredients: [],
      allergens: [],
      meta_keywords: [],
      minimum_order_quantity: 1,
    },
  });

  const createProductMutation = useEnhancedCreateProduct(() => {
    onSuccess();
    form.reset();
  });

  const onSubmit = (data: EnhancedProductFormData) => {
    createProductMutation.mutate(data);
  };

  const addIngredient = (ingredient: string) => {
    const currentIngredients = form.getValues('ingredients') || [];
    if (ingredient && !currentIngredients.includes(ingredient)) {
      form.setValue('ingredients', [...currentIngredients, ingredient]);
    }
    setNewIngredient('');
  };

  const removeIngredient = (index: number) => {
    const currentIngredients = form.getValues('ingredients') || [];
    form.setValue('ingredients', currentIngredients.filter((_, i) => i !== index));
  };

  const addAllergen = (allergen: string) => {
    const currentAllergens = form.getValues('allergens') || [];
    if (allergen && !currentAllergens.includes(allergen)) {
      form.setValue('allergens', [...currentAllergens, allergen]);
    }
    setNewAllergen('');
  };

  const removeAllergen = (index: number) => {
    const currentAllergens = form.getValues('allergens') || [];
    form.setValue('allergens', currentAllergens.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter SKU" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="short_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief description for listings" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detailed product description" 
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing & Inventory Tab */}
          <TabsContent value="pricing" className="space-y-4">
            <InventoryManager form={form} />
          </TabsContent>

          {/* Product Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (oz)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1" 
                            min="0" 
                            placeholder="0.0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="heat_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heat Level (1-5)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="5" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Ingredients */}
                <div>
                  <FormLabel>Ingredients</FormLabel>
                  <div className="mt-2 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add ingredient"
                        value={newIngredient}
                        onChange={(e) => setNewIngredient(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient(newIngredient))}
                      />
                      <Button type="button" variant="outline" onClick={() => addIngredient(newIngredient)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {commonIngredients.map(ingredient => (
                        <Button 
                          key={ingredient}
                          type="button"
                          variant="outline" 
                          size="sm"
                          onClick={() => addIngredient(ingredient)}
                          className="h-8 text-xs"
                        >
                          + {ingredient}
                        </Button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(form.watch('ingredients') || []).map((ingredient) => (
                        <Badge key={`ingredient-${ingredient}`} variant="secondary" className="flex items-center gap-1">
                          {ingredient}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-red-500"
                            onClick={() => removeIngredient(form.watch('ingredients')?.indexOf(ingredient) || 0)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Allergens */}
                <div>
                  <FormLabel>Allergens</FormLabel>
                  <div className="mt-2 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add allergen"
                        value={newAllergen}
                        onChange={(e) => setNewAllergen(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergen(newAllergen))}
                      />
                      <Button type="button" variant="outline" onClick={() => addAllergen(newAllergen)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {commonAllergens.map(allergen => (
                        <Button 
                          key={allergen}
                          type="button"
                          variant="outline" 
                          size="sm"
                          onClick={() => addAllergen(allergen)}
                          className="h-8 text-xs"
                        >
                          + {allergen}
                        </Button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(form.watch('allergens') || []).map((allergen) => (
                        <Badge key={`allergen-${allergen}`} variant="secondary" className="flex items-center gap-1">
                          {allergen}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-red-500"
                            onClick={() => removeAllergen(form.watch('allergens')?.indexOf(allergen) || 0)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUploadManager 
                          images={field.value || []}
                          onImagesChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SEO & Search Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <SEOManager form={form} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Settings Tab */}
          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active Product</FormLabel>
                          <div className="text-sm text-gray-600">
                            Make this product visible to customers
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Featured Product</FormLabel>
                          <div className="text-sm text-gray-600">
                            Display in featured sections
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Form Actions */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-gray-400 text-gray-700 hover:bg-gray-50 hover:text-gray-800 bg-white"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={createProductMutation.isPending}
            className="bg-flame-red hover:bg-flame-red/90"
          >
            {createProductMutation.isPending ? 'Creating Product...' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EnhancedCreateProductForm;
