
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface AdminSidebarQuickActionsProps {
  isCollapsed: boolean;
  onActionClick?: () => void;
}

const AdminSidebarQuickActions = ({ isCollapsed, onActionClick }: AdminSidebarQuickActionsProps) => {
  const navigate = useNavigate();

  const handleViewSite = () => {
    navigate('/');
    if (onActionClick) {
      onActionClick();
    }
  };

  return (
    <div className="mt-6 px-3 pt-4 border-t border-white/10">
      <Button
        variant="ghost"
        onClick={handleViewSite}
        className="w-full flex items-center justify-start text-white/80 hover:bg-white/15 backdrop-blur-sm rounded-xl border border-transparent mb-2"
      >
        <FileText className="h-5 w-5" />
        {!isCollapsed && <span className="ml-3">View Site</span>}
      </Button>
    </div>
  );
};

export default AdminSidebarQuickActions;
