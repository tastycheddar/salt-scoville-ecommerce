
import { Button } from '@/components/ui/button';
import { Zap, X } from 'lucide-react';
import AdminSidebarNavigation from './AdminSidebarNavigation';
import AdminSidebarQuickActions from './AdminSidebarQuickActions';
import AdminSidebarFooter from './AdminSidebarFooter';

interface AdminSidebarMobileProps {
  isMobileMenuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
}

const AdminSidebarMobile = ({ 
  isMobileMenuOpen, 
  onToggleMenu, 
  onCloseMenu 
}: AdminSidebarMobileProps) => {
  
  
  return (
    <>
      {/* Mobile Header - only show on mobile screens */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-charcoal/95 backdrop-blur-xl border-b border-flame-red/20 shadow-xl">
        <div className="flex items-center justify-between px-4 h-full">
          {/* Brand section with icon and text */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-flame-red/20 backdrop-blur-sm rounded-xl border border-flame-red/30">
              <Zap className="h-4 w-4 text-flame-red" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm">
                Salt & Scoville
              </h2>
              <p className="text-xs text-white/70">
                Admin
              </p>
            </div>
          </div>
          
          {/* Toggle button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleMenu}
            className="text-white hover:bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-2 ml-4"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 pt-14">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm"
            onClick={onCloseMenu}
          />
          
          {/* Menu Panel */}
          <div className="relative bg-charcoal/95 backdrop-blur-xl border-r border-flame-red/20 shadow-xl h-full w-64 animate-in slide-in-from-left duration-300">
            <div className="p-4 h-full flex flex-col">
              {/* Navigation */}
              <div className="flex-1">
                <AdminSidebarNavigation 
                  isCollapsed={false} 
                  onItemClick={onCloseMenu}
                />
              </div>

              {/* Quick Actions */}
              <AdminSidebarQuickActions 
                isCollapsed={false} 
                onActionClick={onCloseMenu}
              />

              {/* Sign Out Button */}
              <div className="mt-4">
                <AdminSidebarFooter isCollapsed={false} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebarMobile;
