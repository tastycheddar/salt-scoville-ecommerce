
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserProfile, AdminRole } from '../types';

interface EditUserFormData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  customerType?: 'retail' | 'wholesale';
  wholesaleApproved?: boolean;
  loyaltyPoints?: number;
  emailNotifications?: boolean;
  marketingNotifications?: boolean;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

interface EditUserFormProps {
  form: UseFormReturn<EditUserFormData>;
  onSubmit: (data: EditUserFormData) => Promise<void>;
  isLoading: boolean;
  currentRole: AdminRole;
  setCurrentRole: (role: AdminRole) => void;
  user: UserProfile;
  onCancel: () => void;
}

const EditUserForm = ({ 
  form, 
  onSubmit, 
  isLoading, 
  currentRole, 
  setCurrentRole, 
  user, 
  onCancel 
}: EditUserFormProps) => {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
      </TabsList>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <TabsContent value="profile" className="space-y-4">
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
              <Label>Email</Label>
              <Input value={user.email} disabled className="bg-gray-100" />
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

          <div className="space-y-2">
            <Label htmlFor="loyaltyPoints">Loyalty Points</Label>
            <Input
              id="loyaltyPoints"
              type="number"
              {...form.register('loyaltyPoints', { valueAsNumber: true })}
              className="bg-white/90"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  {...form.register('address.street')}
                  className="bg-white/90"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  {...form.register('address.city')}
                  className="bg-white/90"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  {...form.register('address.state')}
                  className="bg-white/90"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  {...form.register('address.zipCode')}
                  className="bg-white/90"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  {...form.register('address.country')}
                  className="bg-white/90"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
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
                value={currentRole}
                onValueChange={setCurrentRole}
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

          <div className="flex items-center space-x-2">
            <Switch
              id="wholesaleApproved"
              checked={form.watch('wholesaleApproved')}
              onCheckedChange={(checked) => form.setValue('wholesaleApproved', checked)}
            />
            <Label htmlFor="wholesaleApproved">Wholesale Approved</Label>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="emailNotifications"
                checked={form.watch('emailNotifications')}
                onCheckedChange={(checked) => form.setValue('emailNotifications', checked)}
              />
              <Label htmlFor="emailNotifications">Email Notifications</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="marketingNotifications"
                checked={form.watch('marketingNotifications')}
                onCheckedChange={(checked) => form.setValue('marketingNotifications', checked)}
              />
              <Label htmlFor="marketingNotifications">Marketing Notifications</Label>
            </div>
          </div>
        </TabsContent>

        <div className="flex justify-end space-x-2 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Tabs>
  );
};

export default EditUserForm;
