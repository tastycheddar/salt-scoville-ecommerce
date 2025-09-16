
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

interface AdminSidebarFooterProps {
  isCollapsed: boolean;
}

const AdminSidebarFooter = ({ isCollapsed }: AdminSidebarFooterProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="absolute bottom-4 left-0 right-0 px-3">
      <Button
        variant="ghost"
        onClick={handleSignOut}
        className="w-full flex items-center justify-start text-white/80 hover:bg-red-500/20 hover:text-red-200 backdrop-blur-sm rounded-xl border border-transparent"
      >
        <LogOut className="h-5 w-5" />
        {!isCollapsed && <span className="ml-3">Sign Out</span>}
      </Button>
    </div>
  );
};

export default AdminSidebarFooter;
