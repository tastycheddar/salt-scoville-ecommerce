
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import EnhancedCreateProductForm from './EnhancedCreateProductForm';

interface EnhancedCreateProductDialogProps {
  categories: Array<{ id: string; name: string }>;
}

const EnhancedCreateProductDialog: React.FC<EnhancedCreateProductDialogProps> = ({ categories }) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-flame-red hover:bg-flame-red/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
        </DialogHeader>
        <EnhancedCreateProductForm 
          categories={categories} 
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedCreateProductDialog;
