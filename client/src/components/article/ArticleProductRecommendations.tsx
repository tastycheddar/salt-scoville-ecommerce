import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Flame } from 'lucide-react';
import { useProductMatching } from '@/hooks/useProductMatching';
import { ImageUtils } from '@/utils/imageUtils';

interface ArticleProductRecommendationsProps {
  articleContent: string;
  articleTitle: string;
  articleHeatLevel?: number;
  className?: string;
}

const ArticleProductRecommendations: React.FC<ArticleProductRecommendationsProps> = ({
  articleContent,
  articleTitle,
  articleHeatLevel,
  className = ''
}) => {
  const { matchedProducts, isLoading } = useProductMatching({
    articleContent,
    articleTitle,
    articleHeatLevel,
    maxProducts: 6
  });

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center">
          <div className="animate-pulse bg-muted h-8 w-64 mx-auto rounded-md"></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted h-48 rounded-lg mb-4"></div>
              <div className="bg-muted h-4 rounded mb-2"></div>
              <div className="bg-muted h-4 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (matchedProducts.length === 0) {
    return null;
  }

  const getHeatLevelDisplay = (level?: number) => {
    if (!level) return null;
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Flame 
            key={i} 
            className={`h-3 w-3 ${i < level ? 'text-red-500 fill-current' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">
          Perfect Products for This Recipe
        </h3>
        <p className="text-white/70">
          Handpicked recommendations based on the spices and heat levels mentioned in this article
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matchedProducts.map(({ product, relevanceScore, matchReasons }) => (
          <Card 
            key={product.id} 
            className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 group"
          >
            <CardHeader className="p-4">
              <div className="aspect-square rounded-lg overflow-hidden mb-3">
                <img
                  src={ImageUtils.validateImageUrl(product.images)}
                  alt="Spicy Salt & Scoville Micro Salt #FlavorHack"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => ImageUtils.createImageErrorHandler(product.id, e.currentTarget.src, 'article-recommendations')(e)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-white text-lg leading-tight">
                    {product.name}
                  </CardTitle>
                  {getHeatLevelDisplay(product.heat_level)}
                </div>
                
                {product.short_description && (
                  <p className="text-white/70 text-sm line-clamp-2">
                    {product.short_description}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-1">
                  {matchReasons.slice(0, 2).map((reason) => (
                    <Badge 
                      key={`reason-${product.id}-${reason}`}
                      variant="secondary" 
                      className="text-xs bg-primary/20 text-primary-foreground border-primary/30"
                    >
                      {reason}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-0">
              <div className="flex items-center justify-between mb-3">
                <div className="text-2xl font-bold text-white">
                  ${Number(product.price).toFixed(2)}
                </div>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm">4.8</span>
                </div>
              </div>

              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => {
                  // Track product click from article - analytics would go here
                }}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>

              {product.stock_quantity && product.stock_quantity <= 5 && (
                <p className="text-orange-400 text-xs mt-2 text-center">
                  Only {product.stock_quantity} left in stock!
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
          View All Spicy Salts
        </Button>
      </div>
    </div>
  );
};

export default ArticleProductRecommendations;