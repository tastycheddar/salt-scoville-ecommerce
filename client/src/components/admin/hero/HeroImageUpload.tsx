
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { SimpleFileUpload } from '@/components/ui/simple-file-upload';
import HeroUploadDropzone from './upload/HeroUploadDropzone';
import HeroImagePreview from './upload/HeroImagePreview';
import HeroMetadataForm from './upload/HeroMetadataForm';
import { useHeroImageUpload } from './upload/useHeroImageUpload';

const HeroImageUpload = () => {
  const {
    uploadedFile,
    previewUrl,
    formData,
    handleFileSelect,
    handleFieldChange,
    removeFile,
    uploadImage,
    isUploading
  } = useHeroImageUpload();

  const { isDragActive } = useDropzone({
    onDrop: () => {}, // Handled in HeroUploadDropzone
    noClick: true,
    noKeyboard: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await uploadImage();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Upload Area */}
      <div className="space-y-4">
        {!uploadedFile ? (
          <HeroUploadDropzone 
            onFileSelect={handleFileSelect}
            isDragActive={isDragActive}
          />
        ) : (
          <HeroImagePreview
            previewUrl={previewUrl!}
            fileName={uploadedFile.name}
            onRemove={removeFile}
          />
        )}
      </div>

      {/* Image Metadata Form */}
      <HeroMetadataForm
        formData={formData}
        onChange={handleFieldChange}
      />

      <Button
        type="submit"
        disabled={!uploadedFile || isUploading}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
      >
        <Upload className="h-4 w-4 mr-2" />
        {isUploading ? 'Uploading...' : 'Upload Hero Image'}
      </Button>
    </form>
  );
};

export default HeroImageUpload;
