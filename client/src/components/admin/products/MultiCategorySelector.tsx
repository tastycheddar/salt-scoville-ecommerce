
import React from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

interface Category {
  id: string;
  name: string;
}

interface MultiCategorySelectorProps {
  categories: Category[];
  value: string[];
  onChange: (value: string[]) => void;
}

const MultiCategorySelector: React.FC<MultiCategorySelectorProps> = ({
  categories,
  value,
  onChange,
}) => {
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      onChange([...value, categoryId]);
    } else {
      onChange(value.filter(id => id !== categoryId));
    }
  };

  return (
    <FormItem>
      <FormLabel>Categories</FormLabel>
      <div className="grid grid-cols-2 gap-2">
        {categories?.map((category) => (
          <div key={category.id} className="flex items-center space-x-2">
            <Checkbox
              id={category.id}
              checked={value.includes(category.id)}
              onCheckedChange={(checked) => 
                handleCategoryChange(category.id, checked as boolean)
              }
            />
            <label
              htmlFor={category.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {category.name}
            </label>
          </div>
        ))}
      </div>
      <FormMessage />
    </FormItem>
  );
};

export default MultiCategorySelector;
