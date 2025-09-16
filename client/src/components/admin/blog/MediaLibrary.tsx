import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Image as ImageIcon, 
  File, 
  Video, 
  Trash2, 
  Edit3,
  Search,
  Grid,
  List
} from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
// import { useDropzone } from 'react-dropzone';
import { SimpleFileUpload } from '@/components/ui/simple-file-upload';

interface MediaItem {
  id: string;
  filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  alt_text?: string;
  caption?: string;
  created_at: string;
}

interface MediaLibraryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectMedia?: (media: MediaItem) => void;
  allowMultiple?: boolean;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({
  open,
  onOpenChange,
  onSelectMedia,
  allowMultiple = false
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<MediaItem[]>([]);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);

  const { data: mediaItems, isLoading } = useQuery({
    queryKey: ['blogMedia', searchTerm],
    queryFn: async () => {
      // Use PostgreSQL API instead of Supabase
      let url = '/api/admin/blog-media';
      const params = new URLSearchParams();
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      if (params.toString()) {
        url += '?' + params.toString();
      }
      
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch media: ${response.statusText}`);
      }

      return response.json() as Promise<MediaItem[]>;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const uploadPromises = files.map(async (file) => {
        // Get upload URL from PostgreSQL API
        const uploadUrlResponse = await fetch('/api/blog-media/upload-url', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!uploadUrlResponse.ok) {
          throw new Error('Failed to get upload URL');
        }
        
        const { uploadURL } = await uploadUrlResponse.json();

        // Upload file to object storage using the presigned URL
        const uploadResult = await fetch(uploadURL, {
          method: 'PUT',
          body: file,
        });
        
        if (!uploadResult.ok) {
          throw new Error('Failed to upload file to storage');
        }

        // Save to database
        const mediaResponse = await fetch('/api/admin/blog-media', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            file_path: uploadURL,
            file_size: file.size,
            mime_type: file.type,
          }),
        });
        
        if (!mediaResponse.ok) {
          throw new Error('Failed to save media record');
        }
        
        const dbData = await mediaResponse.json();
        return dbData;
      });

      return Promise.all(uploadPromises);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Files uploaded successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['blogMedia'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload files',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (item: MediaItem) => {
      // Delete from database
      const response = await fetch(`/api/admin/blog-media/${item.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete media');
      }
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'File deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['blogMedia'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete file',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, alt_text, caption }: { id: string; alt_text: string; caption: string }) => {
      const response = await fetch(`/api/admin/blog-media/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alt_text, caption }),
      });

      if (!response.ok) {
        throw new Error('Failed to update media');
      }
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Media updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['blogMedia'] });
      setEditingItem(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update media',
        variant: 'destructive',
      });
    },
  });

  const handleFileUpload = (files: File[]) => {
    uploadMutation.mutate(files);
  };

  const getPublicUrl = (filePath: string) => {
    return `/public-objects/${filePath}`;
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="h-4 w-4" />;
    if (mimeType.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSelectItem = (item: MediaItem) => {
    if (allowMultiple) {
      setSelectedItems(prev => 
        prev.find(i => i.id === item.id) 
          ? prev.filter(i => i.id !== item.id)
          : [...prev, item]
      );
    } else {
      setSelectedItems([item]);
    }
  };

  const handleInsertSelected = () => {
    if (onSelectMedia && selectedItems.length > 0) {
      if (allowMultiple) {
        selectedItems.forEach(item => onSelectMedia(item));
      } else {
        onSelectMedia(selectedItems[0]);
      }
      onOpenChange(false);
      setSelectedItems([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] bg-slate-900/95 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Media Library
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="library" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="library">Media Library</TabsTrigger>
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <SimpleFileUpload
              onFileSelect={handleFileUpload}
              accept="image/*,video/*,application/pdf"
              multiple={true}
              maxSize={50 * 1024 * 1024} // 50MB
              className="bg-white/5 border-white/20 text-white"
            >
              <div className="space-y-4">
                <Upload className="h-12 w-12 text-white/60 mx-auto" />
                <div className="text-white">
                  Drag & drop files here, or click to select
                </div>
                <div className="text-white/60 text-sm">
                  Supports images, videos, and PDFs (up to 50MB)
                </div>
              </div>
            </SimpleFileUpload>
          </TabsContent>

          <TabsContent value="library" className="space-y-4">
            {/* Search and View Controls */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                <Input
                  placeholder="Search media..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="bg-flame-red hover:bg-flame-red/90 text-white"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="bg-flame-red hover:bg-flame-red/90 text-white"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Media Grid/List */}
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                <p className="text-white/70 mt-4">Loading media...</p>
              </div>
            ) : mediaItems && mediaItems.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-2'}>
                {mediaItems.map((item) => (
                  <div
                    key={item.id}
                    className={`relative group cursor-pointer rounded-lg overflow-hidden border transition-all ${
                      selectedItems.find(i => i.id === item.id)
                        ? 'border-flame-red bg-flame-red/20'
                        : 'border-white/10 hover:border-white/30 bg-white/5'
                    }`}
                    onClick={() => handleSelectItem(item)}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        {item.mime_type.startsWith('image/') ? (
                          <img
                            src={getPublicUrl(item.file_path)}
                            alt={item.alt_text || item.filename}
                            className="w-full h-32 object-cover"
                          />
                        ) : (
                          <div className="w-full h-32 flex items-center justify-center bg-white/10">
                            {getFileIcon(item.mime_type)}
                          </div>
                        )}
                        <div className="p-3">
                          <div className="text-white text-sm font-medium truncate">
                            {item.filename}
                          </div>
                          <div className="text-white/60 text-xs">
                            {formatFileSize(item.file_size)}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-3 p-3">
                        <div className="flex-shrink-0">
                          {item.mime_type.startsWith('image/') ? (
                            <img
                              src={getPublicUrl(item.file_path)}
                              alt={item.alt_text || item.filename}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded">
                              {getFileIcon(item.mime_type)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium truncate">
                            {item.filename}
                          </div>
                          <div className="text-white/60 text-sm">
                            {formatFileSize(item.file_size)} • {new Date(item.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingItem(item);
                        }}
                        className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMutation.mutate(item);
                        }}
                        className="h-8 w-8 p-0 bg-black/50 hover:bg-red-600 text-white"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ImageIcon className="h-12 w-12 text-white/40 mx-auto mb-4" />
                <h3 className="text-white font-medium mb-2">No media files found</h3>
                <p className="text-white/60">Upload some files to get started</p>
              </div>
            )}

            {/* Insert Button */}
            {selectedItems.length > 0 && (
              <div className="flex justify-end pt-4 border-t border-white/20">
                <Button
                  onClick={handleInsertSelected}
                  className="bg-flame-red hover:bg-flame-red/90 text-white"
                >
                  Insert Selected ({selectedItems.length})
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Edit Media Dialog */}
        {editingItem && (
          <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
            <DialogContent className="bg-slate-900/95 border-white/20">
              <DialogHeader>
                <DialogTitle className="text-white">Edit Media</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Alt Text</Label>
                  <Input
                    defaultValue={editingItem.alt_text || ''}
                    placeholder="Describe this image..."
                    className="bg-white/10 border-white/20 text-white"
                    onChange={(e) => {
                      setEditingItem({ ...editingItem, alt_text: e.target.value });
                    }}
                  />
                </div>
                <div>
                  <Label className="text-white">Caption</Label>
                  <Input
                    defaultValue={editingItem.caption || ''}
                    placeholder="Add a caption..."
                    className="bg-white/10 border-white/20 text-white"
                    onChange={(e) => {
                      setEditingItem({ ...editingItem, caption: e.target.value });
                    }}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingItem(null)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => updateMutation.mutate({
                      id: editingItem.id,
                      alt_text: editingItem.alt_text || '',
                      caption: editingItem.caption || ''
                    })}
                    className="bg-flame-red hover:bg-flame-red/90 text-white"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MediaLibrary;