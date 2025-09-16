
import { useState } from 'react';
import { useCreateHeroImage } from '@/hooks/useHeroImages';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';
import { queryClient } from '../../../../lib/queryClient';

interface FormData {
  title: string;
  alt_text: string;
  description: string;
  seo_title: string;
  seo_description: string;
  sort_order: number;
}

export const useHeroImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    alt_text: '',
    description: '',
    seo_title: '',
    seo_description: '',
    sort_order: 0,
  });

  const { toast } = useToast();
  const createHeroImage = useCreateHeroImage();

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Auto-fill some fields based on filename
    const nameWithoutExt = file.name.split('.')[0];
    setFormData(prev => ({
      ...prev,
      title: prev.title || nameWithoutExt.replace(/[-_]/g, ' '),
      alt_text: prev.alt_text || `Hero image: ${nameWithoutExt.replace(/[-_]/g, ' ')}`,
    }));
  };

  const handleFieldChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const uploadImage = async () => {
    if (!uploadedFile) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // LOCKED SYSTEM: Real file upload using FormData - DO NOT MODIFY
      // This system uploads actual user files, not AI-generated placeholders
      const uploadFormData = new FormData();
      uploadFormData.append('image', uploadedFile);
      uploadFormData.append('title', formData.title);
      uploadFormData.append('altText', formData.alt_text);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('seoTitle', formData.seo_title);
      uploadFormData.append('seoDescription', formData.seo_description);
      uploadFormData.append('sortOrder', formData.sort_order.toString());
      uploadFormData.append('isActive', 'true');

      // Upload the actual file to the server - STABLE ENDPOINT
      const response = await fetch("/api/hero-images/upload", {
        method: "POST",
        credentials: "include",
        body: uploadFormData, // Don't set Content-Type header - let browser handle it for FormData
      });

      if (!response.ok) {
        throw new Error("Failed to upload hero image");
      }

      const result = await response.json();

      // The server returns the created hero image data in snake_case format
      // No need to create heroImageData object - the upload endpoint already saved to database

      // Invalidate the hero images cache to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ['hero-images'] });

      toast({
        title: "Upload successful",
        description: "Hero image has been uploaded successfully.",
        variant: "default",
      });

      // Reset form
      setUploadedFile(null);
      setPreviewUrl(null);
      setFormData({
        title: '',
        alt_text: '',
        description: '',
        seo_title: '',
        seo_description: '',
        sort_order: 0,
      });

    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      logger.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadedFile,
    previewUrl,
    formData,
    handleFileSelect,
    handleFieldChange,
    removeFile,
    uploadImage,
    isUploading: uploading || createHeroImage.isPending
  };
};
