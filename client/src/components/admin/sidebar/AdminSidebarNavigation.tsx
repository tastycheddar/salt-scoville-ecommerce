
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { adminMenuItems, AdminMenuItem } from './AdminMenuConfig';
import { usePendingReviewsCount } from '@/hooks/usePendingReviews';
import AdminNavGuard from '@/components/navigation/AdminNavGuard';

interface AdminSidebarNavigationProps {
  isCollapsed?: boolean;
  onItemClick?: () => void;
}

const AdminSidebarNavigation = ({ isCollapsed = false, onItemClick }: AdminSidebarNavigationProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const { data: pendingReviewsCount = 0 } = usePendingReviewsCount();

  // Get user's admin role
  const { data: userRole } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const response = await fetch(`/api/users/${user.id}/role`, {
        credentials: 'include',
      });
      
      if (!response.ok) return null;
      const data = await response.json();
      return data.role;
    },
    enabled: !!user?.id,
  });

  const isActiveRoute = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  const canAccessMenuItem = (item: AdminMenuItem) => {
    if (!item.requiredRole) return true;
    if (!userRole) return false;
    
    // Role hierarchy: superadmin > admin > moderator
    const roleHierarchy = { superadmin: 3, admin: 2, moderator: 1 };
    const userRoleLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
    const requiredRoleLevel = roleHierarchy[item.requiredRole] || 0;
    
    return userRoleLevel >= requiredRoleLevel;
  };

  const renderMenuItem = (item: AdminMenuItem) => {
    if (!canAccessMenuItem(item)) return null;

    const isActive = isActiveRoute(item.href);
    const Icon = item.icon;
    
    // Add badge count for reviews
    let badgeCount = item.badge;
    if (item.id === 'reviews' && pendingReviewsCount > 0) {
      badgeCount = pendingReviewsCount;
    }

    return (
      <AdminNavGuard key={item.id} requiredRole={item.requiredRole}>
        <a
          href={item.href}
          onClick={onItemClick}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            "hover:bg-white/10 hover:text-white",
            isActive
              ? "bg-white/20 text-white shadow-lg"
              : "text-white/70",
            isCollapsed && "justify-center px-2"
          )}
        >
          <Icon className={cn("h-5 w-5 flex-shrink-0")} />
          {!isCollapsed && (
            <>
              <span className="flex-1">{item.label}</span>
              {badgeCount && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] h-4 flex items-center justify-center animate-pulse">
                  {badgeCount}
                </span>
              )}
            </>
          )}
          {isCollapsed && badgeCount && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center animate-pulse">
              {typeof badgeCount === 'number' && badgeCount > 9 ? '9+' : badgeCount}
            </span>
          )}
        </a>
      </AdminNavGuard>
    );
  };

  return (
    <nav className="flex-1 px-2 py-4 space-y-1">
      {adminMenuItems.map(renderMenuItem)}
    </nav>
  );
};

export default AdminSidebarNavigation;
