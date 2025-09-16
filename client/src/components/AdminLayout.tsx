
import AdminSidebar from './AdminSidebar';
import Breadcrumb from './navigation/Breadcrumb';
import { cn } from '@/lib/utils';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminLayoutProps {
  children: React.ReactNode;
  className?: string;
  breadcrumbItems?: Array<{ label: string; href?: string; isActive?: boolean }>;
}

const AdminLayout = ({ children, className, breadcrumbItems }: AdminLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-charcoal via-charcoal to-slate-800">
      <AdminSidebar />
      <main className={cn(
        "flex-1 min-w-0",
        // Add top padding on mobile to account for fixed header
        "pt-14 md:pt-0",
        className
      )}>
        <div className="p-2 sm:p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb Navigation */}
            {breadcrumbItems && (
              <div className="mb-6">
                <Breadcrumb items={breadcrumbItems} />
              </div>
            )}
            <Suspense fallback={
              <div className="space-y-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            }>
              {children}
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
