
import React from 'react';
import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { AdvancedProductFormData } from '../advancedProductSchema';
import MultiCategorySelector from '../MultiCategorySelector';
import ImageUploadManager from '../ImageUploadManager';

interface CategoryImageSectionProps {
  control: Control<AdvancedProductFormData>;
  categories: Array<{ id: string; name: string }>;
}

const CategoryImageSection: React.FC<CategoryImageSectionProps> = ({ 
  control, 
  categories 
}) => {
  return (
    <>
      <FormField
        control={control}
        name="category_ids"
        render={({ field }) => (
          <MultiCategorySelector
            categories={categories}
            value={field.value || []}
            onChange={field.onChange}
          />
        )}
      />

      <FormField
        control={control}
        name="images"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Product Images</FormLabel>
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
    </>
  );
};

export default CategoryImageSection;
