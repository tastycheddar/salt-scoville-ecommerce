import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Users, ShoppingCart, Package, Star, Settings, AlertCircle, CheckCircle } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'order' | 'user' | 'product' | 'review' | 'system';
  message: string;
  user: string;
  status?: 'completed' | 'pending' | 'cancelled';
  timestamp: string;
  icon: any;
}

// Mock data for development - replace with real API call
const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'order',
    message: 'New order placed',
    user: 'John Doe',
    status: 'pending',
    timestamp: new Date().toISOString(),
    icon: ShoppingCart
  },
  {
    id: '2', 
    type: 'user',
    message: 'New user registered',
    user: 'Jane Smith',
    status: 'completed',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    icon: Users
  },
  {
    id: '3',
    type: 'product',
    message: 'Product updated',
    user: 'Admin',
    status: 'completed',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    icon: Package
  }
];

const ActivityFeed = () => {
  // Use mock data for now - replace with real API call
  const { data: activities = mockActivities, isLoading } = useQuery({
    queryKey: ['/api/admin/activity'],
    enabled: false // Disabled for now, using mock data
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'text-blue-600 bg-blue-50';
      case 'user':
        return 'text-green-600 bg-green-50';
      case 'product':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities?.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`p-2 rounded-full ${getTypeColor(activity.type)}`}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.message}
                  </p>
                  {activity.status && (
                    <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {activity.user} • {new Date(activity.timestamp).toLocaleDateString()} at{' '}
                  {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;