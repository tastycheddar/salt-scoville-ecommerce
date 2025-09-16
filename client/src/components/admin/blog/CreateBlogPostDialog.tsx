import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
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
import { 
  FileText, 
  Search, 
  Eye, 
  Save, 
  Globe,
  Tag,
  Image,
  Calendar
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(300, 'Excerpt must be less than 300 characters').optional(),
  status: z.enum(['draft', 'published']),
  featured_image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  seo_title: z.string().max(60, 'SEO title must be less than 60 characters').optional(),
  seo_description: z.string().max(160, 'SEO description must be less than 160 characters').optional(),
  tags: z.string().optional(),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

interface CreateBlogPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CreateBlogPostDialog: React.FC<CreateBlogPostDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('content');

  const form = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
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
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: BlogPostFormData) => {
      const postData = {
        title: data.title,
        slug: data.slug,
        content: data.content,
        status: data.status,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : null,
        featuredImage: data.featured_image || null,
        seoTitle: data.seo_title || null,
        seoDescription: data.seo_description || null,
        excerpt: data.excerpt || null,
        publishedAt: data.status === 'published' ? new Date().toISOString() : null,
      };

      const response = await fetch('/api/admin/blog-posts', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create blog post');
      }

      return response.json();
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

  const onSubmit = (data: BlogPostFormData) => {
    createPostMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Create New Blog Post
          </DialogTitle>
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
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Content *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Write your blog post content here..."
                          rows={15}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
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
                          placeholder="Brief description of the post (optional)"
                          rows={3}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="seo" className="space-y-4">
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

              <TabsContent value="settings" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-800 border-white/20">
                            <SelectItem value="draft" className="text-white">Draft</SelectItem>
                            <SelectItem value="published" className="text-white">Published</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="featured_image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Featured Image URL</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://saltandscoville.com/images/blog-image.jpg"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                    Create Post
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBlogPostDialog;