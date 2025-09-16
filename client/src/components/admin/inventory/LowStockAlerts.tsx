import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Package, ExternalLink } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const LowStockAlerts: React.FC = () => {
  const { toast } = useToast();

  const { data: alerts, isLoading, refetch } = useQuery({
    queryKey: ['lowStockAlerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('low_stock_alerts')
        .select(`
          *,
          products (
            id,
            name,
            sku,
            stock_quantity,
            price
          )
        `)
        .is('resolved_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const markAsResolved = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('low_stock_alerts')
        .update({ resolved_at: new Date().toISOString() })
        .eq('id', alertId);

      if (error) throw error;

      toast({
        title: 'Alert Resolved',
        description: 'Low stock alert has been marked as resolved.',
      });

      refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Low Stock Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-white/10 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Low Stock Alerts
          {alerts && alerts.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {alerts.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!alerts || alerts.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/70">No low stock alerts at the moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-yellow-500/30"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-white">
                      {alert.products?.name}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      SKU: {alert.products?.sku}
                    </Badge>
                  </div>
                  <div className="text-sm text-white/70">
                    Current stock: <span className="text-yellow-500 font-medium">{alert.current_stock}</span>
                    {' '} (Threshold: {alert.threshold})
                  </div>
                  <div className="text-xs text-white/50 mt-1">
                    Alert created: {new Date(alert.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    <Link to={`/admin/products?product=${alert.products?.id}`}>
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  </Button>
                  <Button
                    onClick={() => markAsResolved(alert.id)}
                    variant="outline"
                    size="sm"
                    className="bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30"
                  >
                    Resolve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LowStockAlerts;