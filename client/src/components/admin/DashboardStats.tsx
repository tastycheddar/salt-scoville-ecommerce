
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, ShoppingCart, DollarSign } from 'lucide-react';
import { useLowStockProducts } from '@/hooks/useLowStockProducts';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { AdminStatsSkeleton } from '@/components/ui/admin-skeleton';

const DashboardStats = React.memo(() => {
  const { data: lowStockProducts = [] } = useLowStockProducts();
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return <AdminStatsSkeleton />;
  }

  const formatChange = (change: number) => {
    if (change === 0) return undefined;
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}% from last month`;
  };

  const statsData = [
    {
      title: 'Total Products',
      value: stats?.totalProducts?.toString() || '0',
      icon: Package,
      change: stats?.newProductsThisMonth 
        ? `${stats.newProductsThisMonth} new this month`
        : undefined,
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers?.toLocaleString() || '0',
      icon: Users,
      change: formatChange(stats?.customerChange || 0),
    },
    {
      title: 'Orders This Month',
      value: stats?.thisMonthOrders?.toString() || '0',
      icon: ShoppingCart,
      change: formatChange(stats?.orderChange || 0),
    },
    {
      title: 'Revenue This Month',
      value: `$${stats?.thisMonthRevenue?.toLocaleString() || '0'}`,
      icon: DollarSign,
      change: formatChange(stats?.revenueChange || 0),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => (
        <Card key={stat.title} className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-white/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            {stat.change && (
              <p className="text-xs text-white/60">
                {stat.change}
              </p>
            )}
            {stat.title === 'Total Products' && lowStockProducts.length > 0 && (
              <p className="text-xs text-red-400 mt-1">
                {lowStockProducts.length} products low in stock
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
});

DashboardStats.displayName = 'DashboardStats';

export default DashboardStats;
