
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { 
  MoreHorizontal, 
  Mail, 
  UserCheck, 
  UserX, 
  Shield,
  Users,
  Trash2
} from 'lucide-react';
import { AdminRole } from '../types';

interface BulkActionsDropdownProps {
  isLoading: boolean;
  onBulkAction: (action: string, value?: string) => void;
}

const BulkActionsDropdown = ({ isLoading, onBulkAction }: BulkActionsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          disabled={isLoading}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-charcoal/95 backdrop-blur-xl border border-white/20 text-white">
        <DropdownMenuItem onClick={() => onBulkAction('send-email')} className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">
          <Mail className="h-4 w-4 mr-2" />
          Send Email
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-white/20" />
        
        <DropdownMenuItem onClick={() => onBulkAction('activate')} className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">
          <UserCheck className="h-4 w-4 mr-2" />
          Activate Users
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onBulkAction('deactivate')} className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">
          <UserX className="h-4 w-4 mr-2" />
          Deactivate Users
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-white/20" />
        
        <DropdownMenuItem onClick={() => onBulkAction('change-role', 'admin')} className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">
          <Shield className="h-4 w-4 mr-2" />
          Make Admin
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onBulkAction('change-role', 'wholesale')} className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">
          <Users className="h-4 w-4 mr-2" />
          Make Wholesale
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onBulkAction('change-role', 'customer')} className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">
          <Users className="h-4 w-4 mr-2" />
          Make Customer
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-white/20" />
        
        <DropdownMenuItem 
          onClick={() => onBulkAction('delete')}
          className="text-red-400 hover:bg-red-500/20 focus:bg-red-500/20 focus:text-red-400"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Users
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BulkActionsDropdown;
