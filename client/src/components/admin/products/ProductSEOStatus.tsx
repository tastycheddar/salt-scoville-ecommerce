
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { logger } from '@/utils/logger';

interface ProductSEOStatusProps {
  product: {
    canonical_url?: string;
    structured_data?: any;
    seo_title?: string;
    seo_description?: string;
    seo_focus_keyword?: string;
  };
}

const ProductSEOStatus: React.FC<ProductSEOStatusProps> = ({ product }) => {
  const seoChecks = [
    { field: 'canonical_url', label: 'Canonical URL' },
    { field: 'structured_data', label: 'Structured Data' },
    { field: 'seo_title', label: 'SEO Title' },
    { field: 'seo_description', label: 'SEO Description' },
    { field: 'seo_focus_keyword', label: 'Focus Keyword' },
  ];

  const completedChecks = seoChecks.filter(check => {
    const value = product[check.field as keyof typeof product];
    if (check.field === 'structured_data') {
      return value && Object.keys(value).length > 0;
    }
    return value && value.toString().trim().length > 0;
  });

  const completionRate = (completedChecks.length / seoChecks.length) * 100;

  logger.debug('Calculated SEO completion rate', { 
    completionRate, 
    completedCount: completedChecks.length, 
    totalChecks: seoChecks.length 
  }, 'ProductSEOStatus');

  const getStatusIcon = () => {
    if (completionRate === 100) {
      return <CheckCircle className="h-3 w-3 text-green-500" />;
    } else if (completionRate >= 60) {
      return <AlertTriangle className="h-3 w-3 text-amber-500" />;
    } else {
      return <XCircle className="h-3 w-3 text-red-500" />;
    }
  };

  const getStatusVariant = () => {
    if (completionRate === 100) return "default";
    if (completionRate >= 60) return "secondary";
    return "destructive";
  };

  return (
    <Badge variant={getStatusVariant()} className="flex items-center space-x-1">
      {getStatusIcon()}
      <span className="text-xs">
        SEO {Math.round(completionRate)}%
      </span>
    </Badge>
  );
};

export default ProductSEOStatus;
