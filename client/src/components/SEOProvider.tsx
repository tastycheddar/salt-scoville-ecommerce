import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDynamicSEO } from '@/hooks/useDynamicSEO';
import { Helmet } from 'react-helmet-async';

interface SEOProviderProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
}

const SEOProvider: React.FC<SEOProviderProps> = ({ 
  children, 
  title, 
  description, 
  keywords, 
  image 
}) => {
  const location = useLocation();
  
  // Use dynamic SEO with page-specific overrides
  useDynamicSEO({
    page_title: title,
    meta_description: description,
    meta_keywords: keywords,
    og_image: image
  });

  // Enhanced structured data for homepage to prevent soft 404
  const isHomepage = location.pathname === '/';
  
  const structuredData = isHomepage ? {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Salt & Scoville",
    "url": "https://saltandscoville.com",
    "description": description || "Premium hot sauces and spicy seasonings",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://saltandscoville.com/products?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "@id": "https://saltandscoville.com/#organization"
    }
  } : null;

  const organizationData = isHomepage ? {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://saltandscoville.com/#organization",
    "name": "Salt & Scoville",
    "url": "https://saltandscoville.com",
    "logo": "https://saltandscoville.com/assets/salt-scoville-logo.png",
    "description": "Premium hot sauces and spicy seasonings manufacturer",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://saltandscoville.com"
    ]
  } : null;

  return (
    <>
      {structuredData && (
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(organizationData)}
          </script>
          {/* Additional meta tags for Google indexing */}
          <meta name="google-site-verification" content="" />
          <meta name="robots" content="index, follow, max-image-preview:large" />
          <link rel="canonical" href={`https://saltandscoville.com${location.pathname}`} />
        </Helmet>
      )}
      {children}
    </>
  );
};

export default SEOProvider;