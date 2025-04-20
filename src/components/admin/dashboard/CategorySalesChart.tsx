
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTheme } from '@/hooks/use-theme';
import { CategoryData } from '@/types';

interface CategorySalesChartProps {
  data: CategoryData[];
}

const CategorySalesChart: React.FC<CategorySalesChartProps> = ({ data }) => {
  const { theme } = useTheme();
  
  console.log('بيانات مخطط المبيعات حسب الفئة:', data);

  // تأكد من أن البيانات غير فارغة
  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>إحصائيات المبيعات حسب الفئة</CardTitle>
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
        <CardTitle>إحصائيات المبيعات حسب الفئة</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}`, 'الكمية']} />
              <Legend />
              <Bar 
                dataKey="value" 
                name="الكمية" 
                fill={theme === 'dark' ? '#60A5FA' : '#3B82F6'} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategorySalesChart;
