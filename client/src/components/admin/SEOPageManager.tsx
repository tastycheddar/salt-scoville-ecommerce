import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Globe, Search, FileText, Plus, Edit, Save, X } from 'lucide-react';

interface PageSEO {
  id: string;
  page_path: string;
  page_title: string;
  meta_description: string;
  meta_keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
  canonical_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const DEFAULT_PAGES = [
  { path: '/', name: 'Home Page', description: 'Main landing page' },
  { path: '/products', name: 'Products', description: 'Product catalog page' },
  { path: '/recipes', name: 'Recipes', description: 'Recipe collection page' },
  { path: '/about', name: 'About', description: 'About us page' },
  { path: '/contact', name: 'Contact', description: 'Contact information page' },
  { path: '/wholesale', name: 'Wholesale', description: 'Wholesale application page' },
  { path: '/blog', name: 'Blog', description: 'Blog listing page' },
];

const SEOPageManager = () => {
  const [editingPage, setEditingPage] = useState<PageSEO | null>(null);
  const [newPage, setNewPage] = useState(false);
  const queryClient = useQueryClient();

  // Fetch existing page SEO settings
  const { data: pages, isLoading } = useQuery({
    queryKey: ['page-seo'],
    queryFn: async () => {
      const response = await fetch('/api/admin/seo-settings');
      if (!response.ok) throw new Error('Failed to fetch SEO settings');
      const data = await response.json();
      
      return data.filter((setting: any) => setting.settingKey.startsWith('page_seo_'))
        .map((setting: any) => ({
          id: setting.id,
          page_path: setting.settingKey.replace('page_seo_', '').replace(/_/g, '/'),
          ...(setting.settingValue as any)
        }));
    }
  });

  // Update page SEO mutation
  const updatePageSEO = useMutation({
    mutationFn: async (pageData: Partial<PageSEO>) => {
      const settingKey = `page_seo_${pageData.page_path?.replace(/\//g, '_')}`;
      
      return apiRequest('/api/admin/seo-settings', {
        method: 'POST',
        body: JSON.stringify({
          settingKey,
          settingValue: {
            page_title: pageData.page_title,
            meta_description: pageData.meta_description,
            meta_keywords: pageData.meta_keywords,
            og_title: pageData.og_title,
            og_description: pageData.og_description,
            og_image: pageData.og_image,
            canonical_url: pageData.canonical_url,
            is_active: pageData.is_active
          },
          description: `SEO settings for ${pageData.page_path}`
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-seo'] });
      toast({
        title: "SEO Updated",
        description: "Page SEO settings have been saved successfully.",
      });
      setEditingPage(null);
      setNewPage(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update SEO settings. Please try again.",
        variant: "destructive",
      });
      if (process.env.NODE_ENV === 'development') {
        console.error('SEO update error:', error);
      }
    }
  });

  const handleSave = (formData: FormData) => {
    const data = {
      page_path: formData.get('page_path') as string,
      page_title: formData.get('page_title') as string,
      meta_description: formData.get('meta_description') as string,
      meta_keywords: formData.get('meta_keywords') as string,
      og_title: formData.get('og_title') as string,
      og_description: formData.get('og_description') as string,
      og_image: formData.get('og_image') as string,
      canonical_url: formData.get('canonical_url') as string,
      is_active: true
    };
    
    updatePageSEO.mutate(data);
  };

  const getPageSEOScore = (page: PageSEO | any) => {
    let score = 0;
    const checks = [
      page.page_title?.length >= 30 && page.page_title?.length <= 60,
      page.meta_description?.length >= 120 && page.meta_description?.length <= 160,
      page.meta_keywords?.length > 0,
      page.og_title?.length > 0,
      page.og_description?.length > 0,
      page.canonical_url?.length > 0
    ];
    
    score = Math.round((checks.filter(Boolean).length / checks.length) * 100);
    return score;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">SEO Page Management</h2>
          <p className="text-white/70">Manage meta tags and SEO settings for all public pages</p>
        </div>
        <Button onClick={() => setNewPage(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Page SEO
        </Button>
      </div>

      <Tabs defaultValue="pages" className="w-full">
        <TabsList>
          <TabsTrigger value="pages">Page Settings</TabsTrigger>
          <TabsTrigger value="defaults">Default Pages</TabsTrigger>
          <TabsTrigger value="analysis">SEO Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-4">
          <div className="grid gap-4">
            {pages?.map((page) => (
              <Card key={page.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{page.page_path}</CardTitle>
                        <p className="text-sm text-gray-600">{page.page_title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getPageSEOScore(page) >= 80 ? "default" : "secondary"}>
                        SEO: {getPageSEOScore(page)}%
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPage(page)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Meta Description:</span>
                      <p className="text-gray-600 truncate">{page.meta_description || 'Not set'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Keywords:</span>
                      <p className="text-gray-600 truncate">{page.meta_keywords || 'Not set'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="defaults" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Default Page Templates</CardTitle>
              <p className="text-sm text-gray-600">Quick setup for common pages</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {DEFAULT_PAGES.map((defaultPage) => {
                  const exists = pages?.some(p => p.page_path === defaultPage.path);
                  return (
                    <div key={defaultPage.path} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{defaultPage.name}</div>
                        <div className="text-sm text-gray-600">{defaultPage.description}</div>
                        <div className="text-xs text-gray-500">{defaultPage.path}</div>
                      </div>
                      <Button
                        variant={exists ? "secondary" : "default"}
                        size="sm"
                        disabled={exists}
                        onClick={() => {
                          setEditingPage({
                            id: '',
                            page_path: defaultPage.path,
                            page_title: defaultPage.name,
                            meta_description: '',
                            meta_keywords: '',
                            og_title: '',
                            og_description: '',
                            og_image: '',
                            canonical_url: `https://saltandscoville.com${defaultPage.path}`,
                            is_active: true,
                            created_at: '',
                            updated_at: ''
                          });
                        }}
                      >
                        {exists ? 'Configured' : 'Setup SEO'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Pages Configured</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pages?.length || 0}</div>
                <p className="text-xs text-gray-600">Total pages with SEO</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Avg SEO Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {pages?.length ? Math.round(pages.reduce((acc, page) => acc + getPageSEOScore(page), 0) / pages.length) : 0}%
                </div>
                <p className="text-xs text-gray-600">Across all pages</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {pages?.filter(page => getPageSEOScore(page) < 80).length || 0}
                </div>
                <p className="text-xs text-gray-600">Pages below 80%</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit/New Page Modal */}
      {(editingPage || newPage) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {editingPage?.id ? 'Edit Page SEO' : 'New Page SEO'}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingPage(null);
                    setNewPage(false);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSave(new FormData(e.currentTarget));
              }} className="space-y-4">
                <div>
                  <Label htmlFor="page_path">Page Path</Label>
                  <Input
                    id="page_path"
                    name="page_path"
                    defaultValue={editingPage?.page_path || ''}
                    placeholder="/example-page"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="page_title">Page Title (30-60 chars)</Label>
                  <Input
                    id="page_title"
                    name="page_title"
                    defaultValue={editingPage?.page_title || ''}
                    placeholder="SEO optimized page title"
                    maxLength={60}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="meta_description">Meta Description (120-160 chars)</Label>
                  <Textarea
                    id="meta_description"
                    name="meta_description"
                    defaultValue={editingPage?.meta_description || ''}
                    placeholder="Compelling description for search results"
                    maxLength={160}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="meta_keywords">Keywords (comma separated)</Label>
                  <Input
                    id="meta_keywords"
                    name="meta_keywords"
                    defaultValue={editingPage?.meta_keywords || ''}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
                
                <div>
                  <Label htmlFor="og_title">Open Graph Title</Label>
                  <Input
                    id="og_title"
                    name="og_title"
                    defaultValue={editingPage?.og_title || ''}
                    placeholder="Title for social media sharing"
                  />
                </div>
                
                <div>
                  <Label htmlFor="og_description">Open Graph Description</Label>
                  <Textarea
                    id="og_description"
                    name="og_description"
                    defaultValue={editingPage?.og_description || ''}
                    placeholder="Description for social media sharing"
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="og_image">Open Graph Image URL</Label>
                  <Input
                    id="og_image"
                    name="og_image"
                    defaultValue={editingPage?.og_image || ''}
                    placeholder="https://saltandscoville.com/images/page-image.jpg"
                    type="url"
                  />
                </div>
                
                <div>
                  <Label htmlFor="canonical_url">Canonical URL</Label>
                  <Input
                    id="canonical_url"
                    name="canonical_url"
                    defaultValue={editingPage?.canonical_url || ''}
                    placeholder="https://saltandscoville.com/page-path"
                    type="url"
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="gap-2" disabled={updatePageSEO.isPending}>
                    <Save className="h-4 w-4" />
                    {updatePageSEO.isPending ? 'Saving...' : 'Save SEO Settings'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingPage(null);
                      setNewPage(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SEOPageManager;