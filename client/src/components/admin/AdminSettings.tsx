
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

const AdminSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your store settings and configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Store Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Payment Settings</h3>
              <p className="text-sm text-gray-600">Configure Stripe and PayPal integration</p>
            </div>
            <div>
              <h3 className="font-medium">Shipping Settings</h3>
              <p className="text-sm text-gray-600">Set up shipping rates and zones</p>
            </div>
            <div>
              <h3 className="font-medium">Tax Settings</h3>
              <p className="text-sm text-gray-600">Configure tax rates by location</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Platform Version</span>
              <span className="text-sm font-mono">v1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Database Status</span>
              <span className="text-sm text-green-600">Connected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Last Backup</span>
              <span className="text-sm">Auto-managed</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
