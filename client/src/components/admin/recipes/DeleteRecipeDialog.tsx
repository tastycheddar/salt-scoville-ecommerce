
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
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface DeleteRecipeDialogProps {
  recipeId: string;
  recipeName: string;
}

const DeleteRecipeDialog: React.FC<DeleteRecipeDialogProps> = ({ 
  recipeId, 
  recipeName 
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteRecipeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      toast.success('Recipe deleted successfully!');
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error('Failed to delete recipe');
    },
  });

  const handleDelete = () => {
    deleteRecipeMutation.mutate();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
          <Trash2 className="h-3 w-3" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-slate-900 border-slate-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Delete Recipe</AlertDialogTitle>
          <AlertDialogDescription className="text-white/70">
            Are you sure you want to delete "{recipeName}"? This action cannot be undone and will remove all associated ratings and comments.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600 hover:text-white">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteRecipeMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteRecipeMutation.isPending ? 'Deleting...' : 'Delete Recipe'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteRecipeDialog;
