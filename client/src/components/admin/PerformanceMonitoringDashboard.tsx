/**
 * Performance Monitoring Dashboard - Real-time System Health
 * Monitors response times, cache performance, and system resources
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Cpu, 
  Database, 
  Gauge, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Trash2
} from 'lucide-react';

interface PerformanceMetrics {
  status: string;
  metrics: {
    avgResponseTime: number;
    queryCount: number;
    cacheHitRate: number;
    memoryUsage: number;
    activeConnections: number;
  };
  slowQueries: Array<{
    query: string;
    time: number;
    timestamp: string;
  }>;
  alerts: Array<{
    level: 'info' | 'warning' | 'error';
    message: string;
    value: string;
  }>;
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  memory: {
    heapUsed: number;
    heapTotal: number;
    rss: number;
  };
  performance: {
    avgResponseTime: number;
    slowQueryCount: number;
    cacheEfficiency: number;
  };
}

const PerformanceMonitoringDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Fetch performance metrics
  const { data: metrics, isLoading: metricsLoading, refetch: refetchMetrics } = useQuery<PerformanceMetrics>({
    queryKey: ['performance-metrics'],
    queryFn: async () => {
      const response = await fetch('/api/performance/metrics', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch metrics');
      return response.json();
    },
    refetchInterval: 5000, // Update every 5 seconds
  });

  // Fetch system health
  const { data: health, isLoading: healthLoading } = useQuery<SystemHealth>({
    queryKey: ['system-health'],
    queryFn: async () => {
      const response = await fetch('/api/performance/health', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch health');
      return response.json();
    },
    refetchInterval: 10000, // Update every 10 seconds
  });

  // Clear cache action
  const clearCache = async () => {
    try {
      await fetch('/api/performance/clear-cache', {
        method: 'POST',
        credentials: 'include'
      });
      refetchMetrics();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'operational':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-white/10 text-white border-white/20';
    }
  };

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default:
        return <CheckCircle className="h-4 w-4 text-blue-400" />;
    }
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (metricsLoading || healthLoading) {
    return (
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-flame-red animate-pulse" />
            Performance Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-white/10 rounded-lg mb-2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="h-5 w-5 text-flame-red" />
          Performance Monitoring
          <Badge className={getStatusColor(health?.status || 'unknown')}>
            {health?.status?.toUpperCase() || 'UNKNOWN'}
          </Badge>
          <Button
            onClick={() => refetchMetrics()}
            size="sm"
            variant="ghost"
            className="ml-auto text-white/60 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/5 border-white/10">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-flame-red/20">
              Overview
            </TabsTrigger>
            <TabsTrigger value="performance" className="text-white data-[state=active]:bg-flame-red/20">
              Performance
            </TabsTrigger>
            <TabsTrigger value="alerts" className="text-white data-[state=active]:bg-flame-red/20">
              Alerts
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="text-white data-[state=active]:bg-flame-red/20">
              Maintenance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Gauge className="h-4 w-4 text-blue-400" />
                    <span className="text-white text-sm font-medium">Avg Response</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {metrics?.metrics.avgResponseTime || 0}ms
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-4 w-4 text-green-400" />
                    <span className="text-white text-sm font-medium">Cache Hit Rate</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {metrics?.metrics.cacheHitRate || 0}%
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="h-4 w-4 text-orange-400" />
                    <span className="text-white text-sm font-medium">Memory Usage</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {metrics?.metrics.memoryUsage || 0}MB
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-purple-400" />
                    <span className="text-white text-sm font-medium">Total Queries</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {metrics?.metrics.queryCount || 0}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Status</span>
                      <Badge className={getStatusColor(health?.status || 'unknown')}>
                        {health?.status?.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Uptime</span>
                      <span className="text-white">{formatUptime(health?.uptime || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Heap Used</span>
                      <span className="text-white">{health?.memory.heapUsed || 0}MB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Active Connections</span>
                      <span className="text-white">{metrics?.metrics.activeConnections || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {metrics?.slowQueries.slice(0, 4).map((query, index) => (
                      <div key={index} className="text-sm">
                        <div className="text-white/70 truncate">{query.query}</div>
                        <div className="text-white/50 text-xs">{query.time}ms</div>
                      </div>
                    )) || (
                      <div className="text-white/60 text-sm">No recent slow queries</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4 mt-4">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Performance Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-white/70 text-sm mb-1">Cache Efficiency</div>
                      <div className="bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((metrics?.metrics.cacheHitRate || 0), 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-white text-sm mt-1">{metrics?.metrics.cacheHitRate || 0}%</div>
                    </div>
                    <div>
                      <div className="text-white/70 text-sm mb-1">Response Time</div>
                      <div className="bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((metrics?.metrics.avgResponseTime || 0) / 10, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-white text-sm mt-1">{metrics?.metrics.avgResponseTime || 0}ms avg</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-2">Slow Queries</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {metrics?.slowQueries.map((query, index) => (
                        <div key={index} className="bg-white/5 rounded p-2">
                          <div className="text-white/90 text-sm font-mono truncate">{query.query}</div>
                          <div className="text-white/60 text-xs flex justify-between mt-1">
                            <span>{query.time}ms</span>
                            <span>{new Date(query.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      )) || (
                        <div className="text-white/60 text-sm">No slow queries recorded</div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4 mt-4">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">System Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics?.alerts.length ? (
                    metrics.alerts.map((alert, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        {getAlertIcon(alert.level)}
                        <div className="flex-1">
                          <div className="text-white text-sm">{alert.message}</div>
                          <div className="text-white/60 text-xs">{alert.value}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-white/60 text-center py-8">
                      <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <div>All systems operating normally</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-4 mt-4">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Maintenance Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <div className="text-white text-sm font-medium">Clear Performance Cache</div>
                      <div className="text-white/60 text-xs">Clears all cached performance data</div>
                    </div>
                    <Button
                      onClick={clearCache}
                      size="sm"
                      className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear Cache
                    </Button>
                  </div>

                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-white text-sm font-medium mb-2">Cache Statistics</div>
                    <div className="text-white/60 text-xs space-y-1">
                      <div>Active cache entries: {metrics?.metrics.activeConnections || 0}</div>
                      <div>Hit rate: {metrics?.metrics.cacheHitRate || 0}%</div>
                      <div>Memory usage: {metrics?.metrics.memoryUsage || 0}MB</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PerformanceMonitoringDashboard;