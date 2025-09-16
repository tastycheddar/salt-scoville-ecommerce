
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, ShoppingCart, DollarSign } from 'lucide-react';
import DashboardStats from './DashboardStats';
import RevenueChart from './RevenueChart';
import ActivityFeed from './ActivityFeed';
import QuickActions from './QuickActions';
import InventoryAlerts from './InventoryAlerts';

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-white/80">Welcome to your control center</p>
      </div>

      {/* Stats Overview */}
      <DashboardStats />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>

        {/* Quick Actions */}
        <QuickActions />
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Alerts */}
        <InventoryAlerts />

        {/* Activity Feed */}
        <ActivityFeed />
      </div>
    </div>
  );
};

export default AdminDashboard;
