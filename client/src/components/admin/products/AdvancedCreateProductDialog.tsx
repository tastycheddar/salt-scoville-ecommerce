
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
import AdvancedCreateProductForm from './AdvancedCreateProductForm';

interface AdvancedCreateProductDialogProps {
  categories: Array<{ id: string; name: string }>;
}

const AdvancedCreateProductDialog: React.FC<AdvancedCreateProductDialogProps> = ({ categories }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-flame-red hover:bg-flame-red/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Product with Enhanced SEO</DialogTitle>
        </DialogHeader>
        <AdvancedCreateProductForm
          categories={categories}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedCreateProductDialog;
