
import React from 'react';
import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AdvancedProductFormData } from '../advancedProductSchema';

interface BasicInfoSectionProps {
  control: Control<AdvancedProductFormData>;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ control }) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Product Name *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter product name" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">SKU *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter SKU" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="short_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Short Description</FormLabel>
            <FormControl>
              <Input 
                placeholder="Brief description" 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Detailed product description" 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default BasicInfoSection;
