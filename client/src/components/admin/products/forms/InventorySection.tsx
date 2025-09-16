
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

interface InventorySectionProps {
  control: Control<AdvancedProductFormData>;
}

const InventorySection: React.FC<InventorySectionProps> = ({ control }) => {
  return (
    <>
      <FormField
        control={control}
        name="heat_level"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Heat Level (1-5)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="1" 
                max="5" 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={control}
          name="stock_quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Stock Quantity *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="low_stock_threshold"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Low Stock Threshold</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Weight (oz)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default InventorySection;
