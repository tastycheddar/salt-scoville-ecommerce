import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  MoreHorizontal,
  FileText
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import EnhancedCreateBlogPostDialog from './EnhancedCreateBlogPostDialog';
import EditBlogPostDialog from './EditBlogPostDialog';
import DeleteBlogPostDialog from './DeleteBlogPostDialog';

const BlogPostManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: posts, isLoading, refetch } = useQuery({
    queryKey: ['adminBlogPosts', searchTerm],
    queryFn: async () => {
      const url = searchTerm 
        ? `/api/admin/blog-posts?search=${encodeURIComponent(searchTerm)}`
        : '/api/admin/blog-posts';
        
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch blog posts: ${response.statusText}`);
      }

      return response.json();
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleEdit = (post: { id: string; title: string; slug: string; status: string }) => {
    setSelectedPost(post);
    setShowEditDialog(true);
  };

  const handleDelete = (post: { id: string; title: string }) => {
    setSelectedPost(post);
    setShowDeleteDialog(true);
  };

  return (
    <>
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Blog Posts
            </CardTitle>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-flame-red hover:bg-flame-red/90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="text-white/70 mt-4">Loading posts...</p>
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-medium truncate">{post.title}</h3>
                      <Badge className={getStatusColor(post.status)}>
                        {post.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(post.created_at)}
                      </div>
                      {post.published_at && (
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          Published {formatDate(post.published_at)}
                        </div>
                      )}
                    </div>
                    
                    {post.excerpt && (
                      <p className="text-white/70 text-sm mt-2 truncate">
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/60 hover:text-white hover:bg-white/10"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-800 border-white/20">
                      <DropdownMenuItem
                        onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                        className="text-white hover:bg-white/10"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEdit(post)}
                        className="text-white hover:bg-white/10"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(post)}
                        className="text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-white/40 mx-auto mb-4" />
              <h3 className="text-white font-medium mb-2">No blog posts found</h3>
              <p className="text-white/60 mb-4">
                {searchTerm ? 'Try adjusting your search terms.' : 'Create your first blog post to get started.'}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-flame-red hover:bg-flame-red/90 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Post
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <EnhancedCreateBlogPostDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={() => {
          refetch();
          setShowCreateDialog(false);
        }}
      />

      {selectedPost && (
        <>
          <EditBlogPostDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            post={selectedPost}
            onSuccess={() => {
              refetch();
              setShowEditDialog(false);
              setSelectedPost(null);
            }}
          />

          <DeleteBlogPostDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            post={selectedPost}
            onSuccess={() => {
              refetch();
              setShowDeleteDialog(false);
              setSelectedPost(null);
            }}
          />
        </>
      )}
    </>
  );
};

export default BlogPostManagement;