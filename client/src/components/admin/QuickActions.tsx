
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Package, ShoppingCart, FileText, Settings, TrendingUp } from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Add New Product',
      description: 'Create a new product listing',
      icon: Plus,
      color: 'bg-flame-red/20 hover:bg-flame-red/30 border border-flame-red/30',
      onClick: () => navigate('/admin/products'),
    },
    {
      title: 'View Users',
      description: 'Manage customer accounts',
      icon: Users,
      color: 'bg-charcoal/40 hover:bg-charcoal/60 border border-white/20',
      onClick: () => navigate('/admin/users'),
    },
    {
      title: 'Manage Orders',
      description: 'Process pending orders',
      icon: ShoppingCart,
      color: 'bg-burnt-orange/20 hover:bg-burnt-orange/30 border border-burnt-orange/30',
      onClick: () => navigate('/admin/orders'),
    },
    {
      title: 'SEO Management',
      description: 'Optimize search rankings',
      icon: TrendingUp,
      color: 'bg-flame-red/15 hover:bg-flame-red/25 border border-flame-red/25',
      onClick: () => navigate('/admin/seo'),
    },
    {
      title: 'Content Management',
      description: 'Edit website content',
      icon: FileText,
      color: 'bg-charcoal/30 hover:bg-charcoal/50 border border-white/15',
      onClick: () => navigate('/admin/content'),
    },
    {
      title: 'System Settings',
      description: 'Configure site settings',
      icon: Settings,
      color: 'bg-white/10 hover:bg-white/20 border border-white/30',
      onClick: () => navigate('/admin/settings'),
    },
  ];

  return (
    <Card className="bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-white">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              onClick={action.onClick}
              className={`${action.color} text-white h-auto min-h-[80px] p-4 flex flex-col items-center justify-center space-y-2 hover:scale-105 transition-all duration-200 border-0 shadow-lg`}
            >
              <action.icon className="h-5 w-5 flex-shrink-0" />
              <div className="text-center space-y-1 w-full">
                <div className="text-sm font-medium leading-tight line-clamp-2">{action.title}</div>
                <div className="text-xs opacity-90 leading-tight line-clamp-2">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
