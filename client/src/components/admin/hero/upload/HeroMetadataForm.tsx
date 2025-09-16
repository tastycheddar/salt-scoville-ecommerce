
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface HeroMetadataFormData {
  title: string;
  alt_text: string;
  description: string;
  seo_title: string;
  seo_description: string;
  sort_order: number;
}

interface HeroMetadataFormProps {
  formData: HeroMetadataFormData;
  onChange: (field: string, value: string | number) => void;
}

const HeroMetadataForm = ({ formData, onChange }: HeroMetadataFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-white">Image Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="Hero image title"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="alt_text" className="text-white">Alt Text</Label>
          <Input
            id="alt_text"
            value={formData.alt_text}
            onChange={(e) => onChange('alt_text', e.target.value)}
            placeholder="Descriptive alt text for accessibility"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-white">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Image description"
            rows={3}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="seo_title" className="text-white">SEO Title</Label>
          <Input
            id="seo_title"
            value={formData.seo_title}
            onChange={(e) => onChange('seo_title', e.target.value)}
            placeholder="SEO optimized title"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="seo_description" className="text-white">SEO Description</Label>
          <Textarea
            id="seo_description"
            value={formData.seo_description}
            onChange={(e) => onChange('seo_description', e.target.value)}
            placeholder="SEO meta description"
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
            onChange={(e) => onChange('sort_order', parseInt(e.target.value) || 0)}
            min="0"
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroMetadataForm;
