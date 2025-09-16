import React from 'react';
import { ChartDataPoint } from '@/types/admin';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleRevenueChart } from './SimpleRevenueChart';
import { AdminChartSkeleton } from '@/components/ui/admin-skeleton';

const RevenueChart = React.memo(() => {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['revenueChart'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/admin/revenue-chart', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch chart data: ${response.statusText}`);
        }

        const data = await response.json();
        return (data as ChartDataPoint[]) || [];
      } catch (error) {
        // Silently handle chart data errors in production
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 1,
    retryDelay: 500,
  });

  if (isLoading) {
    return <AdminChartSkeleton />;
  }

  // Transform data for SimpleRevenueChart
  const transformedData = chartData?.map(item => ({
    month: item.month,
    revenue: item.revenue || 0,
    orders: item.orders || 0
  })) || [];

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">Revenue & Orders Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleRevenueChart data={transformedData} />
        </CardContent>
      </Card>
    </div>
  );
});

RevenueChart.displayName = 'RevenueChart';

export default RevenueChart;