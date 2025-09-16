
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { UserProfile, AdminRole } from './types';
import EditUserForm from './forms/EditUserForm';

const editUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  customerType: z.enum(['retail', 'wholesale']),
  wholesaleApproved: z.boolean(),
  loyaltyPoints: z.number().min(0),
  emailNotifications: z.boolean(),
  marketingNotifications: z.boolean(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

interface EditUserDialogProps {
  user: UserProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const EditUserDialog = ({ user, open, onOpenChange, onSuccess }: EditUserDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState<AdminRole>('customer');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      customerType: 'retail',
      wholesaleApproved: false,
      loyaltyPoints: 0,
      emailNotifications: true,
      marketingNotifications: true,
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
    },
  });

  useEffect(() => {
    if (user && open) {
      form.reset({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        phone: user.phone || '',
        customerType: user.customer_type as 'retail' | 'wholesale',
        wholesaleApproved: user.wholesale_approved || false,
        loyaltyPoints: user.loyalty_points || 0,
        emailNotifications: user.email_notifications ?? true,
        marketingNotifications: user.marketing_notifications ?? true,
        address: user.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
        },
      });
      setCurrentRole((user.role as AdminRole) || 'customer');
    }
  }, [user, open, form]);

  const handleSubmit = async (data: EditUserFormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Handle wholesale-only customers differently
      if (user.is_wholesale_only) {
        // Update wholesale application via Express API
        const wholesaleResponse = await fetch(`/api/wholesale-applications/${user.id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contactPerson: data.firstName,
            businessName: data.lastName,
            email: user.email, // Keep original email
            phone: data.phone,
            businessType: data.customerType === 'wholesale' ? 'retail' : data.customerType,
            businessAddress: data.address,
          }),
        });

        if (!wholesaleResponse.ok) {
          const error = await wholesaleResponse.json();
          throw new Error(error.error || 'Failed to update wholesale application');
        }
      } else {
        // Update profile for regular users via Express API
        const profileResponse = await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            customerType: data.customerType,
            wholesaleApproved: data.wholesaleApproved,
            loyaltyPoints: data.loyaltyPoints,
            emailNotifications: data.emailNotifications,
            marketingNotifications: data.marketingNotifications,
            address: data.address,
          }),
        });

        if (!profileResponse.ok) {
          const error = await profileResponse.json();
          throw new Error(error.error || 'Failed to update user profile');
        }

        // Update role if changed (only for users with auth accounts)
        if (currentRole !== (user.role || 'customer')) {
          const roleResponse = await fetch(`/api/users/${user.id}/role`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role: currentRole }),
          });

          if (!roleResponse.ok) {
            const error = await roleResponse.json();
            throw new Error(error.error || 'Failed to update user role');
          }
        }
      }

      toast({
        title: 'User updated successfully',
        description: `${data.firstName} ${data.lastName} has been updated.`,
      });

      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Error updating user',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Edit User: {user.first_name} {user.last_name}
          </DialogTitle>
        </DialogHeader>
        
        <EditUserForm
          form={form}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          user={user}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
