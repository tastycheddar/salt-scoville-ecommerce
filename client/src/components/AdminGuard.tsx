
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';

interface AdminGuardProps {
  children: React.ReactNode;
  requiredRole?: 'superadmin' | 'admin' | 'moderator';
}

const AdminGuard = ({ children, requiredRole }: AdminGuardProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const { data: userRole, isPending: roleLoading, error: roleError } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const response = await fetch(`/api/users/${user.id}/role`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user role');
      }
      
      const data = await response.json();
      return data.role;
    },
    enabled: !!user,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  // Check if user has required admin privileges
  const isAdmin = userRole && ['superadmin', 'admin', 'moderator'].includes(userRole);
  const hasRequiredRole = !requiredRole || userRole === requiredRole || 
    (requiredRole === 'admin' && userRole === 'superadmin') ||
    (requiredRole === 'moderator' && ['superadmin', 'admin'].includes(userRole));

  useEffect(() => {
    // Add timeout to prevent infinite hanging
    const timeout = setTimeout(() => {
      if (!user && !loading) {
        navigate('/auth');
      }
    }, 3000);

    if (!loading && !roleLoading) {
      clearTimeout(timeout);
      if (!user) {
        navigate('/auth');
      } else if (!isAdmin || !hasRequiredRole) {
        navigate('/');
      }
    }

    return () => clearTimeout(timeout);
  }, [user, loading, isAdmin, roleLoading, navigate]);

  if (roleError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-destructive">Authentication Error</h2>
          <p className="text-muted-foreground">Unable to verify admin access. Please try again.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user || !isAdmin || !hasRequiredRole) {
    return null;
  }

  return <>{children}</>;
};

export default AdminGuard;
