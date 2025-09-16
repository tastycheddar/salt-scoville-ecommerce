import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  seo_title?: string;
  seo_description?: string;
  featured_image?: string;
  tags?: string[];
}

interface SEOAnalysisProps {
  post: BlogPost;
}

export const BlogSEOAnalysis: React.FC<SEOAnalysisProps> = ({ post }) => {
  const seoChecks = [
    {
      name: 'Title Length',
      check: () => {
        const title = post.seo_title || post.title;
        return title.length >= 30 && title.length <= 60;
      },
      message: 'Title should be 30-60 characters',
    },
    {
      name: 'Meta Description',
      check: () => {
        const desc = post.seo_description || post.excerpt;
        return desc && desc.length >= 120 && desc.length <= 160;
      },
      message: 'Meta description should be 120-160 characters',
    },
    {
      name: 'Featured Image',
      check: () => !!post.featured_image,
      message: 'Should have a featured image for social sharing',
    },
    {
      name: 'Content Length',
      check: () => {
        const textContent = post.content.replace(/<[^>]*>/g, '');
        return textContent.length >= 1000;
      },
      message: 'Content should be at least 1000 characters',
    },
    {
      name: 'Tags',
      check: () => post.tags && post.tags.length >= 2 && post.tags.length <= 5,
      message: 'Should have 2-5 tags for better categorization',
    },
    {
      name: 'URL Structure',
      check: () => {
        const slug = post.slug;
        return slug.length <= 60 && !slug.includes('_') && slug.match(/^[a-z0-9-]+$/);
      },
      message: 'URL should be clean, lowercase, and use hyphens',
    },
  ];

  const passedChecks = seoChecks.filter(check => check.check());
  const seoScore = Math.round((passedChecks.length / seoChecks.length) * 100);

  const getScoreColor = () => {
    if (seoScore >= 80) return 'text-green-400';
    if (seoScore >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreIcon = () => {
    if (seoScore >= 80) return CheckCircle2;
    if (seoScore >= 60) return AlertCircle;
    return XCircle;
  };

  const ScoreIcon = getScoreIcon();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <ScoreIcon className={`h-6 w-6 ${getScoreColor()}`} />
        <span className="text-white font-medium">SEO Score: </span>
        <span className={`text-xl font-bold ${getScoreColor()}`}>{seoScore}%</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {seoChecks.map((check, index) => {
          const passed = check.check();
          return (
            <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-white/5">
              {passed ? (
                <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <div className="text-white text-sm font-medium">{check.name}</div>
                <div className="text-white/60 text-xs">{check.message}</div>
              </div>
            </div>
          );
        })}
      </div>

      {seoScore < 80 && (
        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <div className="text-yellow-400 font-medium mb-1">SEO Recommendations</div>
          <div className="text-yellow-300/80 text-sm">
            Consider improving the failed checks above to boost your SEO score and search visibility.
          </div>
        </div>
      )}
    </div>
  );
};