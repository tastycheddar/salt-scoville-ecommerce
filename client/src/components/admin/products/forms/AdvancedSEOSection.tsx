
import React from 'react';
import { Control } from 'react-hook-form';
import EnhancedSEOManager from '../EnhancedSEOManager';
import { AdvancedProductFormData } from '../advancedProductSchema';
import { UseFormReturn } from 'react-hook-form';

interface AdvancedSEOSectionProps {
  form: UseFormReturn<AdvancedProductFormData>;
}

const AdvancedSEOSection: React.FC<AdvancedSEOSectionProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white">Advanced SEO Management</h3>
        <p className="text-sm text-white/70">
          Optimize your product for search engines with advanced SEO tools and real-time scoring.
        </p>
      </div>
      <EnhancedSEOManager form={form} />
    </div>
  );
};

export default AdvancedSEOSection;
