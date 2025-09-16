import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Share2, Bookmark, ExternalLink } from 'lucide-react';
import ArticleProductRecommendations from './ArticleProductRecommendations';
import { useDynamicSEO } from '@/hooks/useDynamicSEO';
import { useArticleSchema } from '@/hooks/useArticleSchema';
import { useProductMatching } from '@/hooks/useProductMatching';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  published_at?: string;
  reading_time?: number;
  tags?: string[];
  seo_title?: string;
  seo_description?: string;
}

interface EnhancedArticleLayoutProps {
  article: Article;
  className?: string;
}

// Extract heat level from content (simple regex approach)
const extractHeatLevel = (content: string): number => {
  const heatKeywords = {
    'mild': 1,
    'medium': 2,
    'hot': 3,
    'very hot': 4,
    'extreme': 5,
    'ghost pepper': 5,
    'carolina reaper': 5,
    'scotch bonnet': 4,
    'habanero': 4,
    'jalapeño': 2,
    'serrano': 3
  };

  const contentLower = content.toLowerCase();
  let maxHeat = 0;

  Object.entries(heatKeywords).forEach(([keyword, level]) => {
    if (contentLower.includes(keyword)) {
      maxHeat = Math.max(maxHeat, level);
    }
  });

  return maxHeat || 3; // Default to medium heat
};

const EnhancedArticleLayout: React.FC<EnhancedArticleLayoutProps> = ({
  article,
  className = ''
}) => {
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // Get product recommendations for schema
  const { matchedProducts } = useProductMatching({
    articleContent: article.content,
    articleTitle: article.title,
    articleHeatLevel: extractHeatLevel(article.content),
    maxProducts: 6
  });

  // Apply dynamic SEO
  useDynamicSEO({
    page_title: article.seo_title || article.title,
    meta_description: article.seo_description || article.excerpt,
    og_title: article.title,
    og_description: article.excerpt,
    og_image: article.featured_image,
    canonical_url: `https://saltandscoville.com/articles/${article.id}`
  });

  // Apply structured data schema
  useArticleSchema({
    article,
    recommendedProducts: matchedProducts.map(match => match.product)
  });

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setReadingProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setShowExitIntent(true);
        setHasShown(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShown]);


  const articleHeatLevel = extractHeatLevel(article.content);
  const publishedDate = article.published_at ? new Date(article.published_at) : new Date();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        // Silently handle share error
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 ${className}`}>
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-300"
        style={{ width: `${readingProgress}%` }}
      />

      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Article Meta */}
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-primary/20 text-primary-foreground">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              {article.excerpt}
            </p>
          )}

          {/* Article Info */}
          <div className="flex flex-wrap items-center gap-6 text-white/70 mb-8">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Salt & Scoville Team</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{publishedDate.toLocaleDateString()}</span>
            </div>
            {article.reading_time && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{article.reading_time} min read</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button onClick={handleShare} variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Bookmark className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-8">
            {/* Featured Image */}
            {article.featured_image && (
              <div className="mb-8 rounded-lg overflow-hidden">
                <img
                  src={article.featured_image}
                  alt={article.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Article Content */}
            <div 
              className="prose prose-lg prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Article CTA Section */}
            <div className="mt-12 p-6 bg-primary/20 rounded-lg border border-primary/30">
              <h3 className="text-xl font-bold text-white mb-4">
                Ready to Spice Up Your Kitchen?
              </h3>
              <p className="text-white/80 mb-4">
                Get the premium spicy salts featured in this article and transform your cooking today!
              </p>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <ExternalLink className="h-4 w-4 mr-2" />
                Shop Spicy Salts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Recommendations */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <ArticleProductRecommendations
          articleContent={article.content}
          articleTitle={article.title}
          articleHeatLevel={articleHeatLevel}
        />
      </div>

      {/* Exit Intent Modal */}
      {showExitIntent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-white max-w-md w-full">
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Wait! Don't Miss Out!
              </h3>
              <p className="text-gray-600 mb-6">
                Get 15% off your first order of the spicy salts featured in this article.
              </p>
              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={() => setShowExitIntent(false)}
                >
                  Get My Discount
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowExitIntent(false)}
                >
                  No Thanks
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Social Proof Section */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-6">
              Join 10,000+ Spice Enthusiasts
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">4.9/5</div>
                <p className="text-white/70">Average Rating</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">10k+</div>
                <p className="text-white/70">Happy Customers</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <p className="text-white/70">Unique Products</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedArticleLayout;