import React from 'react';
import { imageOptimizer } from '@/services/imageOptimization';
import { cn } from '@/lib/utils';

interface OptimizedPictureProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  width?: number;
  height?: number;
  objectFit?: 'cover' | 'contain' | 'fill';
}

export const OptimizedPicture: React.FC<OptimizedPictureProps> = ({
  src,
  alt,
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85,
  width,
  height,
  objectFit = 'cover'
}) => {
  // Generate different format sources using Supabase CDN
  const fitMapping = objectFit === 'fill' ? 'fill' : objectFit === 'contain' ? 'contain' : 'cover';
  const sources = imageOptimizer.generatePictureSources(src, {
    quality,
    width,
    height,
    fit: fitMapping as 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
  });

  // Generate responsive srcSets for each format
  const responsiveSizes = [320, 480, 768, 1024, 1280, 1920];

  return (
    <picture className={cn('block', className)}>
      {sources.map((source, index) => (
        <source
          key={index}
          srcSet={imageOptimizer.generateResponsiveSrcSet(src, responsiveSizes, {
            quality,
            format: source.type.includes('avif') ? 'avif' : 
                   source.type.includes('webp') ? 'webp' : 'jpg',
            width,
            height,
            fit: fitMapping
          })}
          type={source.type}
          sizes={sizes}
        />
      ))}
      <img
        src={imageOptimizer.generateOptimizedUrl(src, {
          quality,
          format: 'jpg',
          width,
          height,
          fit: fitMapping
        })}
        alt={alt}
        className={cn(
          'w-full h-full',
          objectFit === 'cover' && 'object-cover',
          objectFit === 'contain' && 'object-contain',
          objectFit === 'fill' && 'object-fill'
        )}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        sizes={sizes}
      />
    </picture>
  );
};