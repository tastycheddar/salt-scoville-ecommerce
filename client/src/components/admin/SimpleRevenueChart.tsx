import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface SimpleRevenueChartProps {
  data: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
}

// Custom tooltip component for better styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-lg">
        <p className="text-gray-900 font-medium">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {`${entry.name}: ${entry.name === 'Revenue' ? '$' + entry.value.toLocaleString() : entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const SimpleRevenueChart: React.FC<SimpleRevenueChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-white/60">
        <p>No revenue data available</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="month" 
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          />
          <YAxis 
            yAxisId="revenue"
            orientation="left"
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <YAxis 
            yAxisId="orders"
            orientation="right"
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ color: 'rgba(255,255,255,0.8)' }}
          />
          <Area
            yAxisId="revenue"
            type="monotone"
            dataKey="revenue"
            fill="url(#revenueGradient)"
            stroke="#10b981"
            strokeWidth={2}
            name="Revenue"
          />
          <Bar
            yAxisId="orders"
            dataKey="orders"
            fill="rgba(59, 130, 246, 0.6)"
            name="Orders"
            radius={[2, 2, 0, 0]}
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
          </defs>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};