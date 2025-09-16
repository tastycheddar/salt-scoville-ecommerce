import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
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
import { 
  MoreHorizontal, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  CreditCard,
  Trash2,
  Eye,
  Edit
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { OrderViewEditDialog } from './OrderViewEditDialog';

interface OrderActionsProps {
  orderId: string;
  currentStatus: string;
  currentPaymentStatus: string;
  orderNumber: string;
  onViewOrder?: (orderId: string) => void;
}

export const OrderActions = ({ 
  orderId, 
  currentStatus, 
  currentPaymentStatus,
  orderNumber,
  onViewOrder 
}: OrderActionsProps) => {
  const [isViewEditDialogOpen, setIsViewEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateOrderMutation = useMutation({
    mutationFn: async ({ status, paymentStatus }: { status?: string; paymentStatus?: string }) => {
      const updateData: { status?: string; tracking_number?: string; shipped_at?: string; delivered_at?: string; payment_status?: string } = {};
      if (status) updateData.status = status;
      if (paymentStatus) updateData.payment_status = paymentStatus;
      
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      toast({
        title: 'Success',
        description: 'Order updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update order',
        variant: 'destructive',
      });
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete order');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      toast({
        title: 'Success',
        description: 'Order deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete order',
        variant: 'destructive',
      });
    },
  });

  const handleStatusUpdate = (status: string) => {
    updateOrderMutation.mutate({ status });
  };

  const handlePaymentStatusUpdate = (paymentStatus: string) => {
    updateOrderMutation.mutate({ paymentStatus });
  };

  const handleDelete = () => {
    deleteOrderMutation.mutate();
  };

  return (
    <>
      <div className="flex space-x-2">
        {/* Combined View/Edit Button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsViewEditDialogOpen(true)}
          className="bg-charcoal/50 border-charcoal/70 text-white hover:bg-charcoal/70"
        >
          <Eye className="h-4 w-4" />
        </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-charcoal/50 border-charcoal/70 text-white hover:bg-charcoal/70"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 bg-charcoal border-charcoal/70">
          {/* Edit Order - Removed since handled by main button */}
          
          <DropdownMenuSeparator className="bg-charcoal/70" />
          
          {/* Order Status Updates */}
          {currentStatus === 'pending' && (
            <DropdownMenuItem 
              onClick={() => handleStatusUpdate('processing')}
              className="text-white hover:bg-charcoal/70"
            >
              <Package className="mr-2 h-4 w-4" />
              Mark as Processing
            </DropdownMenuItem>
          )}
          
          {currentStatus === 'processing' && (
            <DropdownMenuItem 
              onClick={() => handleStatusUpdate('shipped')}
              className="text-white hover:bg-charcoal/70"
            >
              <Truck className="mr-2 h-4 w-4" />
              Mark as Shipped
            </DropdownMenuItem>
          )}
          
          {currentStatus === 'shipped' && (
            <DropdownMenuItem 
              onClick={() => handleStatusUpdate('delivered')}
              className="text-white hover:bg-charcoal/70"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Delivered
            </DropdownMenuItem>
          )}

          {/* Payment Status Updates */}
          {currentPaymentStatus === 'pending' && (
            <>
              <DropdownMenuSeparator className="bg-charcoal/70" />
              <DropdownMenuItem 
                onClick={() => handlePaymentStatusUpdate('paid')}
                className="text-white hover:bg-charcoal/70"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Mark as Paid
              </DropdownMenuItem>
            </>
          )}

          {/* Cancel Order */}
          {currentStatus !== 'cancelled' && currentStatus !== 'delivered' && (
            <DropdownMenuItem 
              onClick={() => handleStatusUpdate('cancelled')}
              className="text-white hover:bg-charcoal/70"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Order
            </DropdownMenuItem>
          )}

          {/* Delete Order */}
          <DropdownMenuSeparator className="bg-charcoal/70" />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem 
                onSelect={(e) => e.preventDefault()}
                className="text-red-400 hover:bg-red-500/20"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Order
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-charcoal border-charcoal/70">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Delete Order</AlertDialogTitle>
                <AlertDialogDescription className="text-white/70">
                  Are you sure you want to delete order {orderNumber}? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-charcoal/50 border-charcoal/70 text-white hover:bg-charcoal/70">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>

      </div>

      <OrderViewEditDialog
        orderId={orderId}
        isOpen={isViewEditDialogOpen}
        onClose={() => setIsViewEditDialogOpen(false)}
      />
    </>
  );
};