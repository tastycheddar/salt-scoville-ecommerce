
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useQuery } from '@tanstack/react-query';

import { logger } from '@/utils/logger';
import { useUserMenuTheme } from './user-menu/hooks/useUserMenuTheme';
import UserMenuHeader from './user-menu/UserMenuHeader';
import UserMenuItems from './user-menu/UserMenuItems';
import EmailVerificationItem from './user-menu/EmailVerificationItem';
import SignOutItem from './user-menu/SignOutItem';
import { cn } from '@/lib/utils';

const UserMenu = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const { getIconColor, getDropdownStyles } = useUserMenuTheme();

  // Check if user has admin role
  const { data: isAdmin } = useQuery({
    queryKey: ['userAdminStatus', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });
        
        if (!response.ok) {
          return false;
        }
        
        const userData = await response.json();
        return userData.role === 'admin' || userData.role === 'superadmin';
      } catch (error) {
        logger.error('Admin status check failed', { error }, 'UserMenu');
        return false;
      }
    },
    enabled: !!user?.id,
  });

  if (!user) {
    return (
      <Button
        variant="ghost"
        onClick={() => navigate('/auth')}
        className="p-2 h-auto bg-transparent hover:bg-transparent transition-colors"
      >
        <User className={cn("h-5 w-5 transition-colors", getIconColor())} />
      </Button>
    );
  }

  const displayName = profile?.firstName && profile?.lastName 
    ? `${profile.firstName} ${profile.lastName}`
    : user.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="p-2 h-auto bg-transparent hover:bg-transparent transition-colors"
        >
          <User className={cn("h-5 w-5 transition-colors", getIconColor())} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={cn("w-64 shadow-lg z-50", getDropdownStyles())}>
        <UserMenuHeader 
          displayName={displayName || ''} 
          user={user} 
          isAdmin={isAdmin} 
        />
        
        {!user.email_verified && (
          <>
            <DropdownMenuSeparator />
            <EmailVerificationItem user={user} />
          </>
        )}
        
        <DropdownMenuSeparator />
        <UserMenuItems isAdmin={isAdmin} />
        <DropdownMenuSeparator />
        <SignOutItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
