
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface DeleteProductDialogProps {
  productId: string;
  productName: string;
}

const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({ 
  productId, 
  productName 
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteProductMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully!');
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error('Failed to delete product');
    },
  });

  const handleDelete = () => {
    deleteProductMutation.mutate();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-slate-900 border-slate-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Delete Product</AlertDialogTitle>
          <AlertDialogDescription className="text-white/70">
            Are you sure you want to delete "{productName}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600 hover:text-white">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteProductMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteProductMutation.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProductDialog;
