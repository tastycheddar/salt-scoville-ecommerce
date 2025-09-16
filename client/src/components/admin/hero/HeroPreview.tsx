
import { HeroImage } from '@/hooks/useHeroImages';
import { HeroContent } from '@/types/content';
import { Button } from '@/components/ui/button';
import { Eye, ExternalLink } from 'lucide-react';

interface HeroPreviewProps {
  images: HeroImage[];
  content?: HeroContent;
}

const HeroPreview = ({ images, content }: HeroPreviewProps) => {
  const activeImages = images.filter(img => img.is_active);

  if (activeImages.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/70 mb-4">No active hero images to preview.</p>
        <p className="text-white/50 text-sm">Upload and activate some images to see the preview.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Preview Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium mb-1">Live Preview</h3>
          <p className="text-white/70 text-sm">
            Preview how your hero section will look on the live site
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open('/', '_blank')}
          className="border-white/20 text-white hover:bg-white/10"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View Live Site
        </Button>
      </div>

      {/* Preview Container */}
      <div className="relative w-full h-96 rounded-lg overflow-hidden border border-white/20">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: activeImages[0]?.image_url ? `url('${activeImages[0].image_url}')` : 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
            backgroundPosition: "center center",
            backgroundSize: "cover"
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30" />
          
          {/* Loading State */}
          {!activeImages[0]?.image_url && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white/50 text-center">
                <div className="w-16 h-16 border-4 border-white/20 border-t-white/50 rounded-full animate-spin mx-auto mb-4"></div>
                <p>Loading preview...</p>
              </div>
            </div>
          )}
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
          {content && (
            <>
              <h1 
                className="font-bold text-white mb-4 tracking-normal"
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                  textShadow: '0 0 20px rgba(0, 0, 0, 0.8)',
                  lineHeight: '1.1'
                }}
              >
                {content.title}
              </h1>

              {content.subtitle && (
                <p className="text-white/90 mb-6 text-lg max-w-2xl">
                  {content.subtitle}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {content.primary_button_text && (
                  <Button
                    className="px-8 py-3 bg-flame-red hover:bg-flame-red/80 text-white font-semibold"
                    style={{ borderRadius: '20px' }}
                  >
                    <span className="mr-2">🌶️</span>
                    {content.primary_button_text}
                  </Button>
                )}
                
                {content.secondary_button_text && (
                  <Button
                    variant="outline"
                    className="px-8 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/80 text-white hover:bg-white/30"
                    style={{ borderRadius: '20px' }}
                  >
                    {content.secondary_button_text}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Image Carousel Preview */}
      <div className="space-y-4">
        <h4 className="text-white font-medium">Image Rotation Preview</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {activeImages.map((image, index) => (
            <div key={image.id} className="relative group">
              <img
                src={image.image_url}
                alt={image.alt_text || 'Hero image'}
                className="w-full h-24 object-cover rounded border border-white/20 group-hover:border-white/40 transition-colors"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-24 bg-gray-200/20 rounded border border-white/20 flex items-center justify-center"><span class="text-white/60 text-xs">Image error</span></div>';
                  }
                }}
              />
              <div className="absolute inset-0 bg-black/40 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-medium">#{index + 1}</span>
              </div>
              {image.title && (
                <p className="text-white/70 text-xs mt-1 truncate">
                  {image.title}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SEO Preview */}
      {content && (
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h4 className="text-white font-medium mb-3">SEO Preview</h4>
          <div className="space-y-2">
            <div>
              <span className="text-blue-300 text-sm">Title: </span>
              <span className="text-white text-sm">{content.title}</span>
            </div>
            {content.subtitle && (
              <div>
                <span className="text-blue-300 text-sm">Description: </span>
                <span className="text-white/70 text-sm">{content.subtitle}</span>
              </div>
            )}
            <div>
              <span className="text-blue-300 text-sm">Images: </span>
              <span className="text-white/70 text-sm">{activeImages.length} optimized hero images</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroPreview;
