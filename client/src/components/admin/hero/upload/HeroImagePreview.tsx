
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface HeroImagePreviewProps {
  previewUrl: string;
  fileName: string;
  onRemove: () => void;
}

const HeroImagePreview = ({ previewUrl, fileName, onRemove }: HeroImagePreviewProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <div className="relative">
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200/20 rounded-lg">
          <div className="w-8 h-8 border-4 border-white/20 border-t-white/50 rounded-full animate-spin"></div>
        </div>
      )}
      
      {imageError ? (
        <div className="w-full h-48 bg-gray-200/20 rounded-lg border border-white/20 flex items-center justify-center">
          <div className="text-white/60 text-center">
            <div className="text-2xl mb-2">📷</div>
            <p className="text-sm">Failed to load image</p>
          </div>
        </div>
      ) : (
        <img
          src={previewUrl}
          alt="Preview"
          className="w-full h-48 object-cover rounded-lg border border-white/20"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: imageLoading ? 'none' : 'block' }}
        />
      )}
      
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={onRemove}
        className="absolute top-2 right-2 z-10"
      >
        <X className="h-4 w-4" />
      </Button>
      
      <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm truncate max-w-[80%]">
        {fileName}
      </div>
    </div>
  );
};

export default HeroImagePreview;
