
import { Button } from '@/components/ui/button';
import { Menu, X, Zap } from 'lucide-react';

interface AdminSidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobile?: boolean;
}

const AdminSidebarHeader = ({ isCollapsed, onToggleCollapse, isMobile = false }: AdminSidebarHeaderProps) => {
  return (
    <div className="p-4 border-b border-white/10">
      <div className="flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-flame-red/20 backdrop-blur-sm rounded-xl border border-flame-red/30">
              <Zap className="h-5 w-5 text-flame-red" />
            </div>
            <div>
              <h2 className={`font-bold text-white ${isMobile ? 'text-sm' : 'text-lg'}`}>
                Salt & Scoville
              </h2>
              <p className="text-xs text-white/70">
                {isMobile ? 'Admin' : 'Admin Panel'}
              </p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="text-white hover:bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-2"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebarHeader;
