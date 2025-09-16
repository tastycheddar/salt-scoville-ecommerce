
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface CreateUserFormData {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  customerType?: 'retail' | 'wholesale';
  role?: 'customer' | 'admin' | 'wholesale';
  wholesaleApproved?: boolean;
  sendWelcomeEmail?: boolean;
}

interface CreateUserFormProps {
  form: UseFormReturn<CreateUserFormData>;
  onSubmit: (data: CreateUserFormData) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

const CreateUserForm = ({ form, onSubmit, isLoading, onCancel }: CreateUserFormProps) => {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            {...form.register('email')}
            className="bg-white/90"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            {...form.register('phone')}
            className="bg-white/90"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            {...form.register('firstName')}
            className="bg-white/90"
          />
          {form.formState.errors.firstName && (
            <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            {...form.register('lastName')}
            className="bg-white/90"
          />
          {form.formState.errors.lastName && (
            <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Customer Type</Label>
          <Select
            value={form.watch('customerType')}
            onValueChange={(value: 'retail' | 'wholesale') => form.setValue('customerType', value)}
          >
            <SelectTrigger className="bg-white/90">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="retail">Retail Customer</SelectItem>
              <SelectItem value="wholesale">Wholesale Customer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>User Role</Label>
          <Select
            value={form.watch('role')}
            onValueChange={(value: 'customer' | 'admin' | 'wholesale') => form.setValue('role', value)}
          >
            <SelectTrigger className="bg-white/90">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="wholesale">Wholesale</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="wholesaleApproved"
            checked={form.watch('wholesaleApproved')}
            onCheckedChange={(checked) => form.setValue('wholesaleApproved', checked)}
          />
          <Label htmlFor="wholesaleApproved">Wholesale Approved</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="sendWelcomeEmail"
            checked={form.watch('sendWelcomeEmail')}
            onCheckedChange={(checked) => form.setValue('sendWelcomeEmail', checked)}
          />
          <Label htmlFor="sendWelcomeEmail">Send Welcome Email</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

export default CreateUserForm;
