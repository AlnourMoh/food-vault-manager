
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getMockData } from '@/services/mockData';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Smartphone } from 'lucide-react';

const Dashboard = () => {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const { products } = getMockData();

  useEffect(() => {
    // استرجاع معرف المطعم من التخزين المحلي
    const id = localStorage.getItem('restaurantId');
    setRestaurantId(id);
  }, []);

  // Calculate products by category for pie chart
  const productsByCategory = products.reduce((acc: Record<string, number>, product) => {
    if (product.restaurantId === restaurantId) {
      acc[product.category] = (acc[product.category] || 0) + 1;
    }
    return acc;
  }, {});

  const pieChartData = Object.entries(productsByCategory).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Sample monthly data for bar chart
  const monthlyData = [
    { month: 'يناير', مدخلات: 20, مخرجات: 10 },
    { month: 'فبراير', مدخلات: 15, مخرجات: 12 },
    { month: 'مارس', مدخلات: 25, مخرجات: 15 },
    { month: 'أبريل', مدخلات: 22, مخرجات: 20 },
    { month: 'مايو', مدخلات: 30, مخرجات: 22 },
    { month: 'يونيو', مدخلات: 28, مخرجات: 25 },
  ];

  return (
    <RestaurantLayout>
      <div className="rtl space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم</h1>
          <Link to="/restaurant/mobile">
            <Button className="bg-fvm-primary hover:bg-fvm-primary-light flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span>تطبيق فريق المخزن</span>
            </Button>
          </Link>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            title="إجمالي المنتجات" 
            value={products.filter(p => p.restaurantId === restaurantId).length.toString()} 
            description="مجموع المنتجات في المخزون" 
            trend="up"
            trendValue="12%"
          />
          
          <StatsCard 
            title="منتجات منتهية" 
            value="3" 
            description="منتجات تجاوزت صلاحيتها" 
            trend="down"
            trendValue="5%"
          />
          
          <StatsCard 
            title="إدخالات هذا الشهر" 
            value="28" 
            description="إجمالي المنتجات المضافة" 
            trend="up"
            trendValue="18%"
          />
          
          <StatsCard 
            title="إخراجات هذا الشهر" 
            value="21" 
            description="إجمالي المنتجات المستهلكة" 
            trend="up"
            trendValue="7%"
          />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>المنتجات حسب التصنيف</CardTitle>
              <CardDescription>توزيع المنتجات الموجودة في المخزون حسب التصنيف</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>حركة المخزون الشهرية</CardTitle>
              <CardDescription>مقارنة المنتجات المضافة والمستهلكة خلال الأشهر الماضية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="مدخلات" fill="#0088FE" />
                    <Bar dataKey="مخرجات" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RestaurantLayout>
  );
};

export default Dashboard;
