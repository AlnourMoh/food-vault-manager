
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
  
  console.log('بيانات المبيعات الشهرية:', data);

  // تأكد من أن البيانات غير فارغة
  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>المبيعات الشهرية</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">لا توجد بيانات متاحة</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
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
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorProducts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
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
                fillOpacity={1}
                fill="url(#colorSales)" 
              />
              <Area 
                type="monotone" 
                dataKey="منتجات" 
                name="المنتجات"
                stroke={theme === 'dark' ? '#34D399' : '#10B981'} 
                fillOpacity={1}
                fill="url(#colorProducts)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlySalesChart;
