
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateHeroImage } from '@/hooks/useHeroImages';
import { HeroImage } from '@/hooks/useHeroImages';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, X } from 'lucide-react';

interface HeroImageEditorProps {
  image: HeroImage;
  onClose: () => void;
}

const HeroImageEditor = ({ image, onClose }: HeroImageEditorProps) => {
  const [formData, setFormData] = useState({
    title: image.title || '',
    alt_text: image.alt_text || '',
    description: image.description || '',
    seo_title: image.seo_title || '',
    seo_description: image.seo_description || '',
    sort_order: image.sort_order,
  });

  const updateImage = useUpdateHeroImage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateImage.mutate(
      { id: image.id, ...formData },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            Edit Hero Image
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Preview */}
          <div className="flex justify-center">
            <img
              src={image.image_url}
              alt={formData.alt_text || 'Hero image'}
              className="max-w-full h-32 object-cover rounded-lg border border-white/10"
            />
          </div>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="seo">SEO Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Hero image title"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alt_text" className="text-white">Alt Text</Label>
                <Input
                  id="alt_text"
                  value={formData.alt_text}
                  onChange={(e) => handleChange('alt_text', e.target.value)}
                  placeholder="Descriptive alt text for accessibility"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Image description for context"
                  rows={3}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort_order" className="text-white">Display Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => handleChange('sort_order', parseInt(e.target.value) || 0)}
                  min="0"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo_title" className="text-white">SEO Title</Label>
                <Input
                  id="seo_title"
                  value={formData.seo_title}
                  onChange={(e) => handleChange('seo_title', e.target.value)}
                  placeholder="SEO optimized title"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo_description" className="text-white">SEO Description</Label>
                <Textarea
                  id="seo_description"
                  value={formData.seo_description}
                  onChange={(e) => handleChange('seo_description', e.target.value)}
                  placeholder="SEO meta description for this image"
                  rows={3}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded p-4">
                <h4 className="text-blue-300 font-medium mb-2">SEO Tips</h4>
                <ul className="text-blue-200/70 text-sm space-y-1">
                  <li>• Keep titles under 60 characters</li>
                  <li>• Use descriptive, keyword-rich content</li>
                  <li>• Alt text should describe the image content</li>
                  <li>• SEO description should be 150-160 characters</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateImage.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {updateImage.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HeroImageEditor;
