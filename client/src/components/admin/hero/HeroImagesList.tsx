
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDeleteHeroImage, useReorderHeroImages } from '@/hooks/useHeroImages';
import { HeroImage } from '@/hooks/useHeroImages';
import HeroImageEditor from './HeroImageEditor';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Edit, 
  Trash2, 
  GripVertical, 
  Eye,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface HeroImagesListProps {
  images: HeroImage[];
}

const HeroImagesList = ({ images }: HeroImagesListProps) => {
  const [editingImage, setEditingImage] = useState<HeroImage | null>(null);
  const deleteImage = useDeleteHeroImage();
  const reorderImages = useReorderHeroImages();

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    
    const newImages = [...images];
    const currentImage = newImages[index];
    const previousImage = newImages[index - 1];
    
    // Swap sort orders
    const tempOrder = currentImage.sort_order;
    currentImage.sort_order = previousImage.sort_order;
    previousImage.sort_order = tempOrder;
    
    reorderImages.mutate([
      { id: currentImage.id, sort_order: currentImage.sort_order },
      { id: previousImage.id, sort_order: previousImage.sort_order }
    ]);
  };

  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return;
    
    const newImages = [...images];
    const currentImage = newImages[index];
    const nextImage = newImages[index + 1];
    
    // Swap sort orders
    const tempOrder = currentImage.sort_order;
    currentImage.sort_order = nextImage.sort_order;
    nextImage.sort_order = tempOrder;
    
    reorderImages.mutate([
      { id: currentImage.id, sort_order: currentImage.sort_order },
      { id: nextImage.id, sort_order: nextImage.sort_order }
    ]);
  };

  const handleDelete = (id: string) => {
    deleteImage.mutate(id);
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/70 mb-4">No hero images found.</p>
        <p className="text-white/50 text-sm">Upload your first hero image to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {images.map((image, index) => (
        <Card key={image.id} className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              {/* Image Preview */}
              <div className="flex-shrink-0">
                <img
                  src={image.image_url}
                  alt={image.alt_text || 'Hero image'}
                  className="w-20 h-20 object-cover rounded-lg border border-white/10"
                />
              </div>

              {/* Image Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-white font-medium truncate">
                    {image.title || 'Untitled Image'}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    Order: {image.sort_order}
                  </Badge>
                </div>
                <p className="text-white/70 text-sm mb-1 truncate">
                  {image.alt_text || 'No alt text'}
                </p>
                {image.seo_title && (
                  <p className="text-white/50 text-xs truncate">
                    SEO: {image.seo_title}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                {/* Move buttons */}
                <div className="flex flex-col">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === images.length - 1}
                    className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>

                {/* Edit Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingImage(image)}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Edit className="h-4 w-4" />
                </Button>

                {/* Delete Button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-slate-900 border-slate-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Delete Hero Image</AlertDialogTitle>
                      <AlertDialogDescription className="text-white/70">
                        Are you sure you want to remove this hero image? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600 hover:text-white">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(image.id)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Edit Image Dialog */}
      {editingImage && (
        <HeroImageEditor
          image={editingImage}
          onClose={() => setEditingImage(null)}
        />
      )}
    </div>
  );
};

export default HeroImagesList;
