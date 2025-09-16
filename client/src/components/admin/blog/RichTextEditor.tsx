import React, { useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useToast } from '@/hooks/use-toast';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing your blog post...",
  height = "300px"
}) => {
  const { toast } = useToast();
  const quillRef = useRef<ReactQuill>(null);

  const imageHandler = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        // Get upload URL from PostgreSQL API
        const uploadResponse = await fetch('/api/blog-media/upload-url', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to get upload URL');
        }
        
        const { uploadURL } = await uploadResponse.json();

        // Upload file to object storage
        const uploadFileResponse = await fetch(uploadURL, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });

        if (!uploadFileResponse.ok) {
          throw new Error('Failed to upload file');
        }

        // Save media record to PostgreSQL database
        const mediaResponse = await fetch('/api/admin/blog-media', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            originalName: file.name,
            mimeType: file.type,
            fileSize: file.size,
            filePath: uploadURL.split('?')[0], // Remove query params for storage path
            altText: '',
            caption: ''
          })
        });

        if (!mediaResponse.ok) {
          throw new Error('Failed to save media record');
        }

        const mediaData = await mediaResponse.json();
        const imageUrl = mediaData.filePath;

        // Insert image into editor
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection();
          const index = range ? range.index : quill.getLength();
          quill.insertEmbed(index, 'image', imageUrl);
          quill.setSelection(index + 1, 0);
        }

        toast({
          title: 'Success',
          description: 'Image uploaded and inserted successfully',
        });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'align', 'blockquote', 'code-block', 'link', 'image', 'video'
  ];

  return (
    <div className="relative">
      <style>{`
        .ql-editor {
          min-height: ${height};
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
        }
        
        .ql-toolbar {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px 6px 0 0;
          border-bottom: none;
        }
        
        .ql-toolbar .ql-stroke {
          fill: none;
          stroke: rgba(255, 255, 255, 0.7);
        }
        
        .ql-toolbar .ql-fill {
          fill: rgba(255, 255, 255, 0.7);
          stroke: none;
        }
        
        .ql-toolbar .ql-picker-label {
          color: rgba(255, 255, 255, 0.7);
        }
        
        .ql-container {
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-top: none;
          border-radius: 0 0 6px 6px;
        }
        
        .ql-editor.ql-blank::before {
          color: rgba(255, 255, 255, 0.6);
          font-style: italic;
        }
        
        .ql-picker-options {
          background: rgb(30, 41, 59);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .ql-picker-item {
          color: rgba(255, 255, 255, 0.7);
        }
        
        .ql-picker-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
      
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
      
      <div className="mt-2 text-xs text-white/60">
        Word count: {value.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length} | 
        Reading time: {Math.max(1, Math.ceil(value.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length / 200))} min
      </div>
    </div>
  );
};

export default RichTextEditor;