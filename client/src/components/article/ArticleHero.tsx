import React from 'react';
import { Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface ArticleHeroProps {
  title: string;
  subtitle?: string;
  featuredImage?: string;
  readTime?: number;
  publishedAt?: string;
}

const ArticleHero = ({ title, subtitle, featuredImage, readTime, publishedAt }: ArticleHeroProps) => {
  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-char-black">
      {/* Background Image */}
      {featuredImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${featuredImage})` }}
        >
          <div className="absolute inset-0 bg-char-black/60"></div>
        </div>
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-char-black/20 via-char-black/40 to-char-black/80"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-im-fell font-bold text-white mb-6 leading-tight">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        
        {/* Article Meta */}
        <div className="flex items-center justify-center space-x-6 text-white/60">
          {readTime && (
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{readTime} min read</span>
            </div>
          )}
          
          {publishedAt && (
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(publishedAt), 'MMM dd, yyyy')}</span>
            </div>
          )}
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticleHero;