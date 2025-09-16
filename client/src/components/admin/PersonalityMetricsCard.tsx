import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Settings, TrendingUp, Users, Zap, Flame } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface PersonalityMetrics {
  totalSessions: number;
  knowledgeUpdates: {
    contextualInsights: number;
  };
}

export function PersonalityMetricsCard() {
  const [metrics, setMetrics] = useState<PersonalityMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPersonalityMetrics();
  }, []);

  const loadPersonalityMetrics = async () => {
    try {
      // Simulate loading real metrics - would connect to actual API
      const response = await fetch('/api/flava-dave/v4/metrics');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      } else {
        // No fallback - show error if API fails
        setMetrics(null);
      }
    } catch (error) {
      console.error('Failed to load personality metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-flame-red/10 to-charcoal/20 border-flame-red/30">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-white/10 rounded w-1/4"></div>
            <div className="h-20 bg-white/10 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card className="bg-gradient-to-br from-flame-red/20 to-burnt-orange/20 border-flame-red/30">
        <CardContent className="p-6 text-center">
          <p className="text-white/70">Failed to load personality metrics</p>
          <Button onClick={loadPersonalityMetrics} size="sm" className="mt-2 bg-flame-red/20 hover:bg-flame-red/30 border border-flame-red/30">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getHeatIcon = (level: string, count: number) => {
    const icons = {
      mild_dave: <Flame className="h-4 w-4 text-green-400" />,
      medium_dave: <Flame className="h-4 w-4 text-yellow-400" />,
      hot_dave: <Flame className="h-4 w-4 text-orange-400" />,
      volcanic_dave: <Flame className="h-4 w-4 text-red-400" />
    };
    return (
      <div className="flex items-center space-x-2">
        {icons[level as keyof typeof icons]}
        <span className="text-sm font-medium">{count}</span>
      </div>
    );
  };

  return (
    <Card className="admin-brand-card shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5" style={{ color: 'hsl(0 84% 57%)' }} />
            <CardTitle className="text-white">V4.0 Personality System</CardTitle>
          </div>
          <Badge className="admin-brand-badge">
            ACTIVE
          </Badge>
        </div>
        <CardDescription className="text-white/70">
          AI personality control and adaptation metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Sessions */}
        <div className="flex items-center justify-between">
          <span className="text-white/80 text-sm">Total Sessions</span>
          <span className="text-2xl font-bold text-white">{metrics.totalSessions}</span>
        </div>

        {/* No adaptation data - table doesn't exist */}

        {/* Remove fake progress bar - keep only real counts */}

        {/* Remove fake AI Router Status - no real data available */}

        {/* Neural Learning Events - Real Data */}
        <div>
          <h4 className="text-white font-medium mb-3 flex items-center space-x-2">
            <Settings className="h-4 w-4" style={{ color: 'hsl(0 84% 57%)' }} />
            <span>Neural Learning Events</span>
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Total Events</span>
              <span className="text-xs text-white">{metrics.knowledgeUpdates.contextualInsights}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Status</span>
              <span className="text-xs text-green-400">Recording Real Data</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}