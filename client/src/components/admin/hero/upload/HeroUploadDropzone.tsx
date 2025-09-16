import { useCallback } from 'react';
import { SimpleFileUpload } from '@/components/ui/simple-file-upload';
import { Upload } from 'lucide-react';

interface HeroUploadDropzoneProps {
  onFileSelect: (file: File) => void;
}

const HeroUploadDropzone = ({ onFileSelect }: HeroUploadDropzoneProps) => {
  const handleFileUpload = (files: File[]) => {
    const file = files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <SimpleFileUpload
      onFileSelect={handleFileUpload}
      accept="image/*"
      multiple={false}
      maxSize={10485760} // 10MB
      className="bg-white/5 border-white/20"
    >
      <div className="space-y-4">
        <Upload className="h-12 w-12 mx-auto text-white/70" />
        <div className="space-y-2">
          <p className="text-white">Drag & drop an image here, or click to select</p>
          <p className="text-white/50 text-sm">
            Supports JPEG, PNG, WebP up to 10MB
          </p>
        </div>
      </div>
    </SimpleFileUpload>
  );
};

export default HeroUploadDropzone;