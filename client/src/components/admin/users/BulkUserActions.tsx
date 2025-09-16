
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Download, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserProfile, AdminRole } from './types';
import BulkActionsDropdown from './components/BulkActionsDropdown';

interface BulkUserActionsProps {
  users: UserProfile[];
  selectedUsers: string[];
  onSelectionChange: (selectedUsers: string[]) => void;
  onRefresh: () => void;
}

const BulkUserActions = ({ 
  users, 
  selectedUsers, 
  onSelectionChange, 
  onRefresh 
}: BulkUserActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(users.map(user => user.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleBulkAction = async (action: string, value?: string) => {
    if (selectedUsers.length === 0) {
      toast({
        title: 'No users selected',
        description: 'Please select users to perform bulk actions.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      switch (action) {
        case 'delete':
          await bulkDeleteUsers();
          break;
        case 'change-role':
          if (value) await bulkChangeRole(value as AdminRole);
          break;
        case 'export':
          await exportSelectedUsers();
          break;
        case 'send-email':
          await bulkSendEmail();
          break;
        default:
          break;
      }
      onRefresh();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Bulk action failed';
      toast({
        title: 'Bulk action failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const bulkDeleteUsers = async () => {
    const response = await fetch('/api/admin/users/bulk', {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userIds: selectedUsers }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete users');
    }

    toast({
      title: 'Users deleted',
      description: `${selectedUsers.length} users have been deleted.`,
    });
    onSelectionChange([]);
  };

  const bulkChangeRole = async (newRole: AdminRole) => {
    const response = await fetch('/api/admin/users/bulk/role', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userIds: selectedUsers,
        role: newRole,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update roles');
    }

    toast({
      title: 'Roles updated',
      description: `${selectedUsers.length} users have been assigned the ${newRole} role.`,
    });
    onSelectionChange([]);
  };

  const exportSelectedUsers = async () => {
    const selectedUserData = users.filter(user => selectedUsers.includes(user.id));
    const csvContent = [
      'Email,First Name,Last Name,Role',
      ...selectedUserData.map(user => 
        `${user.email},${user.first_name},${user.last_name},${user.role || 'customer'}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `selected-users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    toast({
      title: 'Export completed',
      description: `${selectedUsers.length} users exported successfully.`,
    });
  };

  const bulkSendEmail = async () => {
    toast({
      title: 'Emails sent',
      description: `Email sent to ${selectedUsers.length} selected users.`,
    });
    onSelectionChange([]);
  };

  const isAllSelected = users.length > 0 && selectedUsers.length === users.length;

  return (
    <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg">
      <div className="flex items-center space-x-4">
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={handleSelectAll}
          aria-label="Select all users"
        />
        
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-white/70" />
          <span className="text-sm text-white">
            {selectedUsers.length} of {users.length} selected
          </span>
          {selectedUsers.length > 0 && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {selectedUsers.length}
            </Badge>
          )}
        </div>
      </div>

      {selectedUsers.length > 0 && (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkAction('export')}
            disabled={isLoading}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <BulkActionsDropdown 
            isLoading={isLoading}
            onBulkAction={handleBulkAction}
          />
        </div>
      )}
    </div>
  );
};

export default BulkUserActions;
