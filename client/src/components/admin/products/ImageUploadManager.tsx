
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';
import { useProductImageUpload } from './hooks/useProductImageUpload';

interface ImageUploadManagerProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

const ImageUploadManager: React.FC<ImageUploadManagerProps> = ({
  images,
  onImagesChange,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const { uploading, uploadImages, deleteImage } = useProductImageUpload();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const uploadedUrls = await uploadImages(files);
      if (uploadedUrls.length > 0) {
        // Filter out any blob URLs before adding new ones
        const validImages = images.filter(img => !img.startsWith('blob:'));
        onImagesChange([...validImages, ...uploadedUrls]);
      }
    }
    // Reset input
    event.target.value = '';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const uploadedUrls = await uploadImages(files);
      if (uploadedUrls.length > 0) {
        const validImages = images.filter(img => !img.startsWith('blob:'));
        onImagesChange([...validImages, ...uploadedUrls]);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const removeImage = async (index: number) => {
    const imageUrl = images[index];
    
    // Only try to delete from storage if it's not a blob URL
    if (!imageUrl.startsWith('blob:') && imageUrl.includes('supabase')) {
      await deleteImage(imageUrl);
    }
    
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  // Filter out blob URLs from display
  const validImages = images.filter(img => !img.startsWith('blob:'));

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        <div className="flex flex-col items-center space-y-2">
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
          <div className="text-sm text-muted-foreground">
            {uploading ? (
              'Uploading images...'
            ) : (
              <>
                <span className="font-medium">Click to upload</span> or drag and drop
                <br />
                PNG, JPG, WEBP up to 10MB each
              </>
            )}
          </div>
        </div>
      </div>

      {/* Image Preview Grid */}
      {validImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {validImages.map((image, index) => (
            <div key={`upload-image-${image}-${index}`} className="relative group">
              <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                <img
                  src={image}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    // If image fails to load, remove it from the list
                    // Handle image load error gracefully
                    removeImage(index);
                  }}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploadManager;
