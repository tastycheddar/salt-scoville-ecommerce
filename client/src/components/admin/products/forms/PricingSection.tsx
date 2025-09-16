
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
import { AdvancedProductFormData } from '../advancedProductSchema';

interface PricingSectionProps {
  control: Control<AdvancedProductFormData>;
}

const PricingSection: React.FC<PricingSectionProps> = ({ control }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <FormField
        control={control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Price *</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01" 
                min="0" 
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
        name="wholesale_price"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Wholesale Price</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01" 
                min="0" 
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
        name="cost_price"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Cost Price</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01" 
                min="0" 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PricingSection;
