
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateOrderForm } from './CreateOrderForm';

interface CreateOrderDialogProps {
  onOrderCreated?: () => void;
}

const CreateOrderDialog = ({ onOrderCreated }: CreateOrderDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOrderCreated = () => {
    setIsOpen(false);
    onOrderCreated?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">Create New Order</DialogTitle>
          <DialogDescription className="text-gray-600">
            Create a new order for a customer with product selection and details.
          </DialogDescription>
        </DialogHeader>
        <CreateOrderForm onOrderCreated={handleOrderCreated} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrderDialog;
