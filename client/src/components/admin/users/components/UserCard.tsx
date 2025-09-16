
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Crown, Store, MoreHorizontal, Edit, Trash2, Key } from 'lucide-react';
import { UserProfile } from '../types';

interface UserCardProps {
  user: UserProfile;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  onResetPassword: () => void;
  isMobile: boolean;
}

const UserCard = ({ 
  user, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete, 
  onResetPassword,
  isMobile 
}: UserCardProps) => {
  const getRoleIcon = (role?: string) => {
    if (role === 'admin' || role === 'superadmin') return <Crown className="h-3 w-3 mr-1" />;
    if (role === 'wholesale') return <Store className="h-3 w-3 mr-1" />;
    return null;
  };

  const getRoleBadgeVariant = (role?: string) => {
    return role === 'admin' || role === 'superadmin' ? 'default' : 'secondary';
  };

  return (
    <div className="p-4 hover:bg-white/5 transition-colors">
      <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center justify-between'}`}>
        <div className="flex items-start space-x-4">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            className="mt-1"
          />
          
          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium flex-shrink-0">
            {user.first_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium text-white truncate">
                {user.last_name || user.email}
              </p>
              <Badge 
                variant={getRoleBadgeVariant(user.role)}
                className="text-xs flex-shrink-0"
              >
                {getRoleIcon(user.role)}
                {user.role || 'customer'}
              </Badge>
              {user.wholesale_approved && (
                <Badge variant="outline" className="text-xs border-green-300 text-green-200 flex-shrink-0">
                  Wholesale Approved
                </Badge>
              )}
            </div>
            
            {user.phone && (
              <p className="text-sm text-white/60">{user.phone}</p>
            )}
            <div className="flex items-center gap-4 mt-1 text-xs text-white/60">
              <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
              <span>{user.loyalty_points || 0} points</span>
              <span className="capitalize">{user.customer_type}</span>
            </div>
          </div>
        </div>
        
        <div className={`flex items-center gap-2 ${isMobile ? 'justify-end' : ''}`}>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-charcoal/95 backdrop-blur-xl border border-white/20 text-white">
              <DropdownMenuItem onClick={onResetPassword} className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">
                <Key className="h-4 w-4 mr-2" />
                Reset Password
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-400 hover:bg-red-500/20 focus:bg-red-500/20 focus:text-red-400">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
