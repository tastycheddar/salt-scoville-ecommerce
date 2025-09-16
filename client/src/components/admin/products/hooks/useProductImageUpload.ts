import { useState } from 'react';

import { useToast } from '@/hooks/use-toast';

export const useProductImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImages = async (files: FileList): Promise<string[]> => {
    if (!files || files.length === 0) return [];

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      // Upload using object storage

      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not an image file`,
            variant: "destructive",
          });
          continue;
        }

        // Validate file size (10MB max)
        if (file.size > 10485760) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds 10MB limit`,
            variant: "destructive",
          });
          continue;
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        // Get upload URL from object storage
        const uploadResponse = await fetch('/api/objects/upload', {
          method: 'POST',
          credentials: 'include',
        });
        
        if (!uploadResponse.ok) {
          toast({
            title: "Upload failed",
            description: `Failed to get upload URL for ${file.name}`,
            variant: "destructive",
          });
          continue;
        }
        
        const { uploadURL } = await uploadResponse.json();
        
        // Upload file to object storage
        const uploadResult = await fetch(uploadURL, {
          method: 'PUT',
          body: file,
        });
        
        if (!uploadResult.ok) {
          toast({
            title: "Upload failed",
            description: `Failed to upload ${file.name}`,
            variant: "destructive",
          });
          continue;
        }

        uploadedUrls.push(uploadURL);
      }

      if (uploadedUrls.length > 0) {
        toast({
          title: "Upload successful",
          description: `${uploadedUrls.length} image(s) uploaded successfully`,
        });
      }

      return uploadedUrls;
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      });
      return [];
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageUrl: string): Promise<boolean> => {
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `products/${fileName}`;

      const response = await fetch(`/api/objects/${filePath}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      const error = !response.ok;

      if (error) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    uploading,
    uploadImages,
    deleteImage
  };
};