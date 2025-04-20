
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTheme } from '@/hooks/use-theme';
import { MonthlyData } from '@/types';

interface MonthlySalesChartProps {
  data: MonthlyData[];
}

const MonthlySalesChart: React.FC<MonthlySalesChartProps> = ({ data }) => {
  const { theme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>المبيعات الشهرية</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="مبيعات" 
                name="المبيعات"
                stroke={theme === 'dark' ? '#60A5FA' : '#3B82F6'} 
                fill={theme === 'dark' ? 'rgba(96, 165, 250, 0.2)' : 'rgba(59, 130, 246, 0.2)'} 
              />
              <Area 
                type="monotone" 
                dataKey="منتجات" 
                name="المنتجات"
                stroke={theme === 'dark' ? '#34D399' : '#10B981'} 
                fill={theme === 'dark' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(16, 185, 129, 0.2)'} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlySalesChart;
