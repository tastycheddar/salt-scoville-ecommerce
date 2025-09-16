
import React, { useEffect } from 'react';
import { Product } from '@/types/product';
import { logger } from '@/utils/logger';

interface SEOMetaInjectorProps {
  productData: Product;
}

const SEOMetaInjector: React.FC<SEOMetaInjectorProps> = ({ productData }) => {
  useEffect(() => {
    if (!productData) {
      return;
    }

    try {
      // Use consistent snake_case fields with proper fallbacks
      const seoTitle = productData.seo_title || `${productData.name} | Salt & Scoville`;
      const seoDescription = productData.seo_description || productData.short_description || productData.description || 'Premium gourmet spice blend';
      
      logger.info('Injecting SEO metadata', { 
        productId: productData.id, 
        hasTitle: !!seoTitle,
        hasDescription: !!seoDescription 
      }, 'SEOMetaInjector');

      // Update document title
      if (seoTitle) {
        document.title = seoTitle;
      }

      // Remove existing SEO meta tags
      const existingMetas = document.querySelectorAll('meta[data-seo="true"]');
      existingMetas.forEach(meta => meta.remove());

      // Generate and add meta tags
      const metaTags = [
        { name: 'description', content: seoDescription },
        { property: 'og:title', content: seoTitle },
        { property: 'og:description', content: seoDescription },
        { property: 'og:image', content: productData.og_image },
        { name: 'twitter:card', content: productData.twitter_card_type || 'summary_large_image' },
        { name: 'twitter:title', content: seoTitle },
        { name: 'twitter:description', content: seoDescription },
        { name: 'robots', content: productData.meta_robots || 'index,follow' }
      ].filter(tag => tag.content);

      metaTags.forEach(tag => {
        const metaElement = document.createElement('meta');
        metaElement.setAttribute('data-seo', 'true');
        
        if (tag.name) {
          metaElement.setAttribute('name', tag.name);
        }
        if (tag.property) {
          metaElement.setAttribute('property', tag.property);
        }
        if (tag.content) {
          metaElement.setAttribute('content', tag.content);
        }
        
        document.head.appendChild(metaElement);
      });

      // Add canonical URL
      const existingCanonical = document.querySelector('link[rel="canonical"]');
      if (existingCanonical) {
        existingCanonical.remove();
      }
      
      if (productData.canonical_url) {
        const canonicalElement = document.createElement('link');
        canonicalElement.setAttribute('rel', 'canonical');
        canonicalElement.setAttribute('href', productData.canonical_url);
        document.head.appendChild(canonicalElement);
      }

      // Add structured data
      const existingStructuredData = document.querySelector('script[data-schema="product"]');
      if (existingStructuredData) {
        existingStructuredData.remove();
      }

      if (productData.structured_data && Object.keys(productData.structured_data).length > 0) {
        const scriptElement = document.createElement('script');
        scriptElement.setAttribute('type', 'application/ld+json');
        scriptElement.setAttribute('data-schema', 'product');
        scriptElement.textContent = JSON.stringify(productData.structured_data);
        document.head.appendChild(scriptElement);
      }

      logger.info('Successfully injected SEO metadata', { 
        metaTagCount: metaTags.length, 
        hasCanonical: !!productData.canonical_url,
        hasStructuredData: !!(productData.structured_data && Object.keys(productData.structured_data).length > 0)
      }, 'SEOMetaInjector');

      // Cleanup function
      return () => {
        const seoMetas = document.querySelectorAll('meta[data-seo="true"]');
        seoMetas.forEach(meta => meta.remove());
        
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) canonical.remove();
        
        const structuredData = document.querySelector('script[data-schema="product"]');
        if (structuredData) structuredData.remove();
      };
    } catch (error) {
      logger.error('Error injecting SEO metadata', { error, productId: productData.id }, 'SEOMetaInjector');
    }
  }, [productData]);

  return null; // This component only handles side effects
};

export default SEOMetaInjector;
