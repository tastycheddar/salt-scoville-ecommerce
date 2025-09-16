import React, { useState, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const editBlogPostSchema = z.object({
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

type EditBlogPostFormData = z.infer<typeof editBlogPostSchema>;

interface EditBlogPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: { 
    id: string; 
    title: string; 
    content: string; 
    slug: string; 
    status: 'draft' | 'published'; 
    excerpt?: string;
    featured_image?: string;
    seo_title?: string;
    seo_description?: string;
    tags?: string[];
    published_at?: string;
  };
  onSuccess: () => void;
}

const EditBlogPostDialog: React.FC<EditBlogPostDialogProps> = ({
  open,
  onOpenChange,
  post,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('content');

  const form = useForm<EditBlogPostFormData>({
    resolver: zodResolver(editBlogPostSchema),
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

  useEffect(() => {
    if (post && open) {
      form.reset({
        title: post.title || '',
        slug: post.slug || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        status: post.status || 'draft',
        featured_image: post.featured_image || '',
        seo_title: post.seo_title || '',
        seo_description: post.seo_description || '',
        tags: post.tags ? post.tags.join(', ') : '',
      });
    }
  }, [post, open, form]);

  const updatePostMutation = useMutation({
    mutationFn: async (data: EditBlogPostFormData) => {
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
        publishedAt: data.status === 'published' && !post.published_at 
          ? new Date().toISOString() 
          : post.published_at,
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch(`/api/admin/blog-posts/${post.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update blog post');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Blog post updated successfully',
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update blog post',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: EditBlogPostFormData) => {
    updatePostMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Blog Post
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
                        <Select onValueChange={field.onChange} value={field.value}>
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
            disabled={updatePostMutation.isPending}
            className="bg-flame-red hover:bg-flame-red/90 text-white"
          >
                {updatePostMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Post
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

export default EditBlogPostDialog;