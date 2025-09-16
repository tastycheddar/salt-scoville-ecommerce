
import AdminSidebarHeader from './AdminSidebarHeader';
import AdminSidebarNavigation from './AdminSidebarNavigation';
import AdminSidebarQuickActions from './AdminSidebarQuickActions';
import AdminSidebarFooter from './AdminSidebarFooter';

interface AdminSidebarDesktopProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const AdminSidebarDesktop = ({ isCollapsed, onToggleCollapse }: AdminSidebarDesktopProps) => {
  
  
  return (
    <div className={`hidden md:block relative ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen transition-all duration-300`}>
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-xl border-r border-white/20 shadow-xl"></div>
      
      <div className="relative z-10 h-full text-white">
        {/* Header */}
        <AdminSidebarHeader 
          isCollapsed={isCollapsed} 
          onToggleCollapse={onToggleCollapse}
        />

        {/* Navigation */}
        <AdminSidebarNavigation isCollapsed={isCollapsed} />

        {/* Quick Actions */}
        <AdminSidebarQuickActions isCollapsed={isCollapsed} />

        {/* Footer */}
        <AdminSidebarFooter isCollapsed={isCollapsed} />
      </div>
    </div>
  );
};

export default AdminSidebarDesktop;
