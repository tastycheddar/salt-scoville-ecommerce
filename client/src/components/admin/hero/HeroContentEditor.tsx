
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateHeroContent } from '@/hooks/useHeroContent';
import { HeroContent } from '@/types/content';
import { Save, Type } from 'lucide-react';

interface HeroContentEditorProps {
  content?: HeroContent;
}

const HeroContentEditor = ({ content }: HeroContentEditorProps) => {
  const [formData, setFormData] = useState({
    title: content?.title || '',
    subtitle: content?.subtitle || '',
    primary_button_text: content?.primary_button_text || '',
    primary_button_action: content?.primary_button_action || '',
    secondary_button_text: content?.secondary_button_text || '',
    secondary_button_action: content?.secondary_button_action || '',
  });

  const updateContent = useUpdateHeroContent();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content?.id) return;
    
    updateContent.mutate({
      id: content.id,
      ...formData,
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!content) {
    return (
      <div className="text-center py-8">
        <p className="text-white/70">No hero content found. Please refresh the page.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-white">Hero Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter hero title"
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle" className="text-white">Hero Subtitle</Label>
        <Textarea
          id="subtitle"
          value={formData.subtitle}
          onChange={(e) => handleChange('subtitle', e.target.value)}
          placeholder="Enter hero subtitle (optional)"
          rows={2}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-white font-medium">Primary Button</h3>
          <div className="space-y-2">
            <Label htmlFor="primary_button_text" className="text-white">Button Text</Label>
            <Input
              id="primary_button_text"
              value={formData.primary_button_text}
              onChange={(e) => handleChange('primary_button_text', e.target.value)}
              placeholder="e.g., SHOP NOW"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="primary_button_action" className="text-white">Button Action</Label>
            <Input
              id="primary_button_action"
              value={formData.primary_button_action}
              onChange={(e) => handleChange('primary_button_action', e.target.value)}
              placeholder="e.g., /products"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-white font-medium">Secondary Button</h3>
          <div className="space-y-2">
            <Label htmlFor="secondary_button_text" className="text-white">Button Text</Label>
            <Input
              id="secondary_button_text"
              value={formData.secondary_button_text}
              onChange={(e) => handleChange('secondary_button_text', e.target.value)}
              placeholder="e.g., LEARN MORE"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondary_button_action" className="text-white">Button Action</Label>
            <Input
              id="secondary_button_action"
              value={formData.secondary_button_action}
              onChange={(e) => handleChange('secondary_button_action', e.target.value)}
              placeholder="e.g., scroll_to_heat_guide"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded p-4">
        <h4 className="text-blue-300 font-medium mb-2">Button Action Tips</h4>
        <ul className="text-blue-200/70 text-sm space-y-1">
          <li>• Use URL paths like "/products" or "/about" for navigation</li>
          <li>• Use "scroll_to_[id]" for smooth scrolling to page sections</li>
          <li>• Use external URLs for links to other websites</li>
        </ul>
      </div>

      <Button
        type="submit"
        disabled={updateContent.isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Save className="h-4 w-4 mr-2" />
        {updateContent.isPending ? 'Saving...' : 'Save Hero Content'}
      </Button>
    </form>
  );
};

export default HeroContentEditor;
