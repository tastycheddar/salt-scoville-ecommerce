import React, { useState } from 'react';
import { useLazyImage } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import { imageOptimizer, generateResponsiveImageProps } from '@/services/imageOptimization';

interface LazyImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src: string;
  alt: string;
  placeholder?: string;
  blurDataURL?: string;
  priority?: boolean;
  optimizeForSupabase?: boolean;
  responsive?: boolean;
  quality?: number;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzBjMGIwYyIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNzM3MzczIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Mb2FkaW5nLi4uPC90ZXh0Pjwvc3ZnPg==',
  blurDataURL,
  priority = false,
  optimizeForSupabase = true,
  responsive = true,
  quality = 85,
  className,
  onLoad,
  onError,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  
  // Generate optimized image URLs using Supabase CDN
  const optimizedSrc = optimizeForSupabase 
    ? imageOptimizer.generateOptimizedUrl(src, { 
        quality, 
        format: 'webp',
        fit: 'cover'
      })
    : src;

  const optimizedBlurSrc = optimizeForSupabase && !blurDataURL
    ? imageOptimizer.generateBlurPlaceholder(src)
    : blurDataURL;

  // Use lazy loading unless marked as priority
  const { elementRef, src: lazySrc, isLoaded, isError } = useLazyImage(priority ? optimizedSrc : optimizedSrc);

  const handleLoad = () => {
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // For priority images, load immediately
  const imageSrc = priority ? optimizedSrc : lazySrc;
  
  // Generate responsive props if enabled
  const responsiveProps = responsive && optimizeForSupabase 
    ? {
        srcSet: imageOptimizer.generateResponsiveSrcSet(src, undefined, { quality, format: 'webp' }),
        sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      }
    : {};

  if (hasError || isError) {
    return (
      <div 
        ref={priority ? undefined : elementRef as React.RefObject<HTMLDivElement>}
        className={cn(
          'flex items-center justify-center bg-gray-100 text-gray-400',
          className
        )}
        {...props}
      >
        <span className="text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div 
      ref={priority ? undefined : elementRef as React.RefObject<HTMLDivElement>}
      className={cn('relative overflow-hidden', className)}
    >
      {/* Placeholder/blur image */}
      {!isLoaded && imageSrc && (
        <img
          src={optimizedBlurSrc || placeholder}
          alt=""
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-300 filter blur-sm',
            isLoaded ? 'opacity-0' : 'opacity-100'
          )}
          aria-hidden="true"
        />
      )}
      
      {/* Main image */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          {...responsiveProps}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...props}
        />
      )}
      
      {/* Loading skeleton */}
      {!imageSrc && !priority && (
        <div className={cn(
          'animate-pulse bg-gray-200 w-full h-full flex items-center justify-center',
          className
        )}>
          <span className="text-gray-400 text-sm">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default LazyImage;