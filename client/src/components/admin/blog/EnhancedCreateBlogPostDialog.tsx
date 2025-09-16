import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DOMPurify from 'dompurify';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  FileText, 
  Save, 
  Calendar as CalendarIcon,
  Clock,
  Image as ImageIcon,
  Tags,
  Eye,
  Globe,
  Search
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

import { useToast } from '@/hooks/use-toast';
import RichTextEditor from './RichTextEditor';
import MediaLibrary from './MediaLibrary';

const enhancedBlogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(300, 'Excerpt must be less than 300 characters').optional(),
  status: z.enum(['draft', 'published', 'scheduled']),
  featured_image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  seo_title: z.string().max(60, 'SEO title must be less than 60 characters').optional(),
  seo_description: z.string().max(160, 'SEO description must be less than 160 characters').optional(),
  tags: z.string().optional(),
  categories: z.array(z.string()).optional(),
  scheduled_for: z.date().optional(),
});

type EnhancedBlogPostFormData = z.infer<typeof enhancedBlogPostSchema>;

interface EnhancedCreateBlogPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EnhancedCreateBlogPostDialog: React.FC<EnhancedCreateBlogPostDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('content');
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const form = useForm<EnhancedBlogPostFormData>({
    resolver: zodResolver(enhancedBlogPostSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      status: 'draft',
      featured_image: '',
      seo_title: '',
      seo_description: '',
      tags: '',
      categories: [],
      scheduled_for: undefined,
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['blogCategories'],
    queryFn: async () => {
      const response = await fetch('/api/admin/blog-categories', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const categories = await response.json();
      return categories.filter((cat: any) => cat.is_active);
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: EnhancedBlogPostFormData) => {
      const postData = {
        title: data.title,
        slug: data.slug,
        content: data.content,
        status: data.status,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : null,
        featured_image: data.featured_image || null,
        seo_title: data.seo_title || null,
        seo_description: data.seo_description || null,
        excerpt: data.excerpt || null,
        published_at: data.status === 'published' ? new Date().toISOString() : null,
        scheduled_for: data.status === 'scheduled' ? data.scheduled_for?.toISOString() : null,
      };

      const response = await fetch('/api/admin/blog-posts', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create blog post');
      }
      
      const newPost = await response.json();

      // Handle category assignments
      if (data.categories && data.categories.length > 0) {
        for (const categoryId of data.categories) {
          const categoryResponse = await fetch('/api/admin/blog-post-categories', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              blog_post_id: newPost.id,
              category_id: categoryId,
            }),
          });
          
          if (!categoryResponse.ok) {
            throw new Error('Failed to link categories');
          }
        }
      }

      return newPost;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Blog post created successfully',
      });
      form.reset();
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create blog post',
        variant: 'destructive',
      });
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    form.setValue('title', title);
    if (!form.getValues('slug') || form.getValues('slug') === generateSlug(form.getValues('title'))) {
      form.setValue('slug', generateSlug(title));
    }
    if (!form.getValues('seo_title')) {
      form.setValue('seo_title', title.slice(0, 60));
    }
  };

  const handleMediaSelect = (media: any) => {
const data = { publicUrl: `/public-objects/${media.file_path}` };
    form.setValue('featured_image', data.publicUrl);
    setShowMediaLibrary(false);
  };

  const calculateSEOScore = () => {
    const title = form.watch('title');
    const content = form.watch('content');
    const seoTitle = form.watch('seo_title');
    const seoDescription = form.watch('seo_description');
    
    let score = 0;
    
    if (title && title.length >= 30 && title.length <= 60) score += 20;
    if (seoTitle && seoTitle.length >= 30 && seoTitle.length <= 60) score += 20;
    if (seoDescription && seoDescription.length >= 120 && seoDescription.length <= 160) score += 20;
    if (content && content.length >= 300) score += 20;
    if (form.watch('featured_image')) score += 10;
    if (form.watch('tags')) score += 10;
    
    return score;
  };

  const wordCount = form.watch('content')?.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length || 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  const seoScore = calculateSEOScore();

  const onSubmit = (data: EnhancedBlogPostFormData) => {
    createPostMutation.mutate(data);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto bg-slate-900/95 border-white/20">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Create New Blog Post
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Badge variant={seoScore >= 80 ? 'default' : seoScore >= 60 ? 'secondary' : 'destructive'}>
                  SEO Score: {seoScore}%
                </Badge>
                <div className="text-white/60 text-sm">
                  {wordCount} words • {readingTime} min read
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="border-white/20 text-white hover:bg-white/10"
                  type="button"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {previewMode ? 'Edit' : 'Preview'}
                </Button>
              </div>
            </div>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Title *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          placeholder="Enter blog post title"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">URL Slug *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="url-friendly-slug"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                  <TabsTrigger value="categories">Categories</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                  <TabsTrigger value="publish">Publish</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                  {previewMode ? (
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h1 className="text-2xl font-bold text-white mb-4">{form.watch('title')}</h1>
                      <div 
                        className="text-white/90 prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(form.watch('content') || '') }}
                      />
                    </div>
                  ) : (
                    <>
                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Content *</FormLabel>
                            <FormControl>
                              <RichTextEditor
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Start writing your amazing blog post..."
                                height="400px"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="excerpt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Excerpt</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Brief description of the post (will be auto-generated if left empty)"
                                rows={3}
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </TabsContent>

                <TabsContent value="media" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="featured_image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Featured Image</FormLabel>
                        <div className="space-y-3">
                          {field.value && (
                            <div className="relative">
                              <img
                                src={field.value}
                                alt="Featured"
                                className="w-full h-48 object-cover rounded-lg border border-white/20"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => field.onChange('')}
                                className="absolute top-2 right-2 bg-black/50 hover:bg-red-600 text-white"
                              >
                                Remove
                              </Button>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowMediaLibrary(true)}
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              <ImageIcon className="h-4 w-4 mr-2" />
                              Choose from Library
                            </Button>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Or paste image URL"
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                              />
                            </FormControl>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="categories" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Categories</FormLabel>
                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto bg-white/5 p-3 rounded-lg border border-white/10">
                          {categories?.map((category: any) => (
                            <div key={category.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={category.id}
                                checked={field.value?.includes(category.id)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  if (checked) {
                                    field.onChange([...current, category.id]);
                                  } else {
                                    field.onChange(current.filter(id => id !== category.id));
                                  }
                                }}
                              />
                              <label
                                htmlFor={category.id}
                                className="text-white/90 text-sm cursor-pointer"
                              >
                                {category.name}
                              </label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Tags</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="tag1, tag2, tag3"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                          />
                        </FormControl>
                        <div className="text-xs text-white/60">
                          Separate tags with commas
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="seo" className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      SEO Analysis
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-white/70">
                        Title Length: {form.watch('title')?.length || 0}/60
                        <div className={`w-full bg-gray-700 rounded-full h-1.5 mt-1`}>
                          <div 
                            className={`h-1.5 rounded-full ${
                              (form.watch('title')?.length || 0) >= 30 && (form.watch('title')?.length || 0) <= 60 
                                ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, ((form.watch('title')?.length || 0) / 60) * 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-white/70">
                        Content Length: {wordCount} words
                        <div className={`w-full bg-gray-700 rounded-full h-1.5 mt-1`}>
                          <div 
                            className={`h-1.5 rounded-full ${wordCount >= 300 ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(100, (wordCount / 500) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="seo_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">SEO Title</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="SEO optimized title (max 60 chars)"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                          />
                        </FormControl>
                        <div className="text-xs text-white/60">
                          {field.value?.length || 0}/60 characters
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="seo_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Meta Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="SEO meta description (max 160 chars)"
                            rows={3}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                          />
                        </FormControl>
                        <div className="text-xs text-white/60">
                          {field.value?.length || 0}/160 characters
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="publish" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Publication Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-800 border-white/20">
                            <SelectItem value="draft" className="text-white">Draft</SelectItem>
                            <SelectItem value="published" className="text-white">Publish Now</SelectItem>
                            <SelectItem value="scheduled" className="text-white">Schedule for Later</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch('status') === 'scheduled' && (
                    <FormField
                      control={form.control}
                      name="scheduled_for"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-white">Schedule Date & Time</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20",
                                    !field.value && "text-white/60"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP 'at' p")
                                  ) : (
                                    <span>Pick a date and time</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-slate-800 border-white/20" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-white font-medium mb-2">Publishing Checklist</h3>
                    <div className="space-y-1 text-sm">
                      <div className={`flex items-center gap-2 ${form.watch('title') ? 'text-green-400' : 'text-red-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${form.watch('title') ? 'bg-green-400' : 'bg-red-400'}`} />
                        Title added
                      </div>
                      <div className={`flex items-center gap-2 ${wordCount >= 300 ? 'text-green-400' : 'text-red-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${wordCount >= 300 ? 'bg-green-400' : 'bg-red-400'}`} />
                        Content has 300+ words
                      </div>
                      <div className={`flex items-center gap-2 ${form.watch('featured_image') ? 'text-green-400' : 'text-yellow-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${form.watch('featured_image') ? 'bg-green-400' : 'bg-yellow-400'}`} />
                        Featured image added (recommended)
                      </div>
                      <div className={`flex items-center gap-2 ${form.watch('seo_description') ? 'text-green-400' : 'text-yellow-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${form.watch('seo_description') ? 'bg-green-400' : 'bg-yellow-400'}`} />
                        SEO description added (recommended)
                      </div>
                      <div className={`flex items-center gap-2 ${(form.watch('categories')?.length || 0) > 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${(form.watch('categories')?.length || 0) > 0 ? 'bg-green-400' : 'bg-yellow-400'}`} />
                        Categories selected (recommended)
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/20">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createPostMutation.isPending}
                  className="bg-flame-red hover:bg-flame-red/90 text-white"
                >
                  {createPostMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {form.watch('status') === 'published' ? 'Publish Post' : 
                       form.watch('status') === 'scheduled' ? 'Schedule Post' : 'Save Draft'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <MediaLibrary
        open={showMediaLibrary}
        onOpenChange={setShowMediaLibrary}
        onSelectMedia={handleMediaSelect}
      />
    </>
  );
};

export default EnhancedCreateBlogPostDialog;