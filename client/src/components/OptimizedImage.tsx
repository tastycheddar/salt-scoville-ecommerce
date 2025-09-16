import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg';
  placeholder?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

// Critical: Aggressive optimization for LCP images
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width = 400,
  height = 300,
  className = '',
  priority = false,
  sizes = '100vw',
  quality = 75,
  format = 'webp',
  placeholder = true,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate optimized URLs with aggressive compression
  const generateOptimizedUrl = (baseUrl: string, w: number, h?: number, q: number = quality, fmt: string = format) => {
    if (!baseUrl) return '';
    
    // For Supabase/external URLs, add optimization params
    if (baseUrl.includes('supabase.co') || baseUrl.includes('lovable-uploads')) {
      const params = new URLSearchParams();
      params.set('width', w.toString());
      if (h) params.set('height', h.toString());
      params.set('quality', q.toString());
      params.set('format', fmt);
      return `${baseUrl}?${params.toString()}`;
    }
    
    return baseUrl;
  };

  // Generate responsive srcSet with modern formats
  const generateSrcSet = () => {
    const breakpoints = [320, 640, 768, 1024, 1200];
    const aspectRatio = height / width;
    
    return breakpoints
      .map(w => {
        const h = Math.round(w * aspectRatio);
        return `${generateOptimizedUrl(src, w, h, quality, format)} ${w}w`;
      })
      .join(', ');
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Preload critical images
  useEffect(() => {
    if (priority && src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = generateOptimizedUrl(src, width, height, quality, format);
      link.fetchPriority = 'high';
      document.head.appendChild(link);
      
      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [src, priority, width, height, quality, format]);

  if (hasError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">Image failed to load</span>
      </div>
    );
  }

  return (
    <picture className={className}>
      {/* AVIF - maximum compression */}
      <source
        srcSet={generateSrcSet().replace(/format=webp/g, 'format=avif')}
        type="image/avif"
        sizes={sizes}
      />
      
      {/* WebP - fallback */}
      <source
        srcSet={generateSrcSet()}
        type="image/webp"
        sizes={sizes}
      />
      
      {/* JPEG - final fallback */}
      <img
        ref={imgRef}
        src={generateOptimizedUrl(src, width, height, quality, 'jpeg')}
        srcSet={generateSrcSet().replace(/format=webp/g, 'format=jpeg')}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'low'}
        decoding={priority ? 'sync' : 'async'}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          aspectRatio: `${width}/${height}`,
        }}
      />
      
      {/* Loading placeholder */}
      {placeholder && !isLoaded && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"
          style={{ aspectRatio: `${width}/${height}` }}
        />
      )}
    </picture>
  );
};

export default OptimizedImage;