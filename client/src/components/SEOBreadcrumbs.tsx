import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface SEOBreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const SEOBreadcrumbs: React.FC<SEOBreadcrumbsProps> = ({ 
  items: customItems, 
  className 
}) => {
  const location = useLocation();
  
  // Auto-generate breadcrumbs from URL if no custom items provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Format segment for display
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
        current: isLast
      });
    });

    return breadcrumbs;
  };

  const items = customItems || generateBreadcrumbs();

  // Don't render breadcrumbs on homepage
  if (items.length <= 1) return null;

  // Generate JSON-LD structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      ...(item.href && { "item": `https://saltandscoville.com${item.href}` })
    }))
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Breadcrumb Navigation */}
      <nav 
        aria-label="Breadcrumb" 
        className={cn('py-4', className)}
      >
        <ol className="flex items-center space-x-2 text-sm">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            
            return (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
                )}
                
                {item.href ? (
                  <Link
                    to={item.href}
                    className="text-gray-600 hover:text-flame-red transition-colors duration-200"
                  >
                    {index === 0 ? (
                      <div className="flex items-center space-x-1">
                        <Home className="h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                    ) : (
                      item.label
                    )}
                  </Link>
                ) : (
                  <span 
                    className={cn(
                      'font-medium',
                      isLast ? 'text-flame-red' : 'text-gray-900'
                    )}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default SEOBreadcrumbs;