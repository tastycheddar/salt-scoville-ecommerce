
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import AdminSidebarMobile from './admin/sidebar/AdminSidebarMobile';
import AdminSidebarDesktop from './admin/sidebar/AdminSidebarDesktop';

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // Reset mobile menu state when switching to desktop
  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      
      setIsMobileMenuOpen(false);
    }
  }, [isMobile, isMobileMenuOpen]);

  
  

  // Prevent double rendering during mobile detection
  if (isMobile) {
    return (
      <AdminSidebarMobile
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onCloseMenu={() => setIsMobileMenuOpen(false)}
      />
    );
  }

  return (
    <AdminSidebarDesktop
      isCollapsed={isCollapsed}
      onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
    />
  );
};

export default AdminSidebar;
