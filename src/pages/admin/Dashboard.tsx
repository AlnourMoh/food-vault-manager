
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BuildingIcon, Users, ShoppingCart, BarChartIcon } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useTheme } from '@/hooks/use-theme';
import { getMockData } from '@/services/mockData';
import StatsCard from '@/components/dashboard/StatsCard';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [dashboardData, setDashboardData] = useState<any>(null);
  
  // التحقق من تسجيل دخول المسؤول
  useEffect(() => {
    console.log('التحقق من تسجيل دخول المسؤول...');
    const isAdminLoggedIn = localStorage.getItem('isAdminLogin') === 'true';
    console.log('حالة تسجيل دخول المسؤول:', isAdminLoggedIn);
    
    if (!isAdminLoggedIn) {
      console.log('المستخدم غير مسجل دخول، توجيه إلى صفحة تسجيل الدخول');
      navigate('/admin/login');
    } else {
      console.log('المستخدم مسجل دخول بنجاح');
      // جلب البيانات لعرضها في لوحة التحكم
      const data = getMockData();
      setDashboardData(data);
    }
  }, [navigate]);

  // إعداد بيانات الإحصائيات
  const stats = [
    {
      title: "المطاعم",
      value: dashboardData ? dashboardData.restaurants.length : "0",
      icon: <BuildingIcon className="h-6 w-6 text-blue-500" />,
      color: "bg-blue-50",
      description: "إجمالي عدد المطاعم المسجلة",
      trend: { value: 12, isPositive: true }
    },
    {
      title: "المستخدمين",
      value: dashboardData ? dashboardData.storageTeamMembers.length : "0",
      icon: <Users className="h-6 w-6 text-green-500" />,
      color: "bg-green-50",
      description: "إجمالي عدد المستخدمين",
      trend: { value: 5, isPositive: true }
    },
    {
      title: "المنتجات",
      value: dashboardData ? dashboardData.products.length : "0",
      icon: <ShoppingCart className="h-6 w-6 text-purple-500" />,
      color: "bg-purple-50",
      description: "إجمالي عدد المنتجات",
      trend: { value: 8, isPositive: true }
    },
    {
      title: "المعاملات",
      value: dashboardData ? dashboardData.inventoryTransactions.length : "0",
      icon: <BarChartIcon className="h-6 w-6 text-amber-500" />,
      color: "bg-amber-50",
      description: "إجمالي عدد المعاملات",
      trend: { value: 3, isPositive: true }
    }
  ];

  // إعداد بيانات المبيعات الشهرية
  const monthlyData = [
    { name: 'يناير', مبيعات: 4000, منتجات: 2400 },
    { name: 'فبراير', مبيعات: 3000, منتجات: 1398 },
    { name: 'مارس', مبيعات: 2000, منتجات: 9800 },
    { name: 'أبريل', مبيعات: 2780, منتجات: 3908 },
    { name: 'مايو', مبيعات: 1890, منتجات: 4800 },
    { name: 'يونيو', مبيعات: 2390, منتجات: 3800 },
    { name: 'يوليو', مبيعات: 3490, منتجات: 4300 },
  ];

  // إعداد بيانات توزيع المنتجات حسب الفئة
  const getCategoryData = () => {
    if (!dashboardData || !dashboardData.products) return [];
    
    const categories: Record<string, number> = {};
    
    dashboardData.products.forEach((product: any) => {
      if (categories[product.category]) {
        categories[product.category] += 1;
      } else {
        categories[product.category] = 1;
      }
    });
    
    return Object.keys(categories).map(name => ({
      name,
      value: categories[name]
    }));
  };

  const categoryData = dashboardData ? getCategoryData() : [];

  // ألوان للمخطط الدائري - تعديل لتناسب الوضع الفاتح والداكن
  const COLORS = theme === 'dark' 
    ? ['#60A5FA', '#34D399', '#FBBF24', '#F87171'] 
    : ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  // تكوين الرسوم البيانية مع دعم وضع السمة
  const chartConfig = {
    sales: {
      label: 'المبيعات',
      theme: {
        light: '#3B82F6',
        dark: '#60A5FA',
      },
    },
    products: {
      label: 'المنتجات',
      theme: {
        light: '#10B981',
        dark: '#34D399',
      },
    },
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">لوحة تحكم المسؤول</h1>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              description={stat.description}
              trend={stat.trend}
              className={theme === 'dark' ? 'bg-secondary' : stat.color}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>المبيعات الشهرية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ChartContainer config={chartConfig}>
                  <AreaChart
                    data={monthlyData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="مبيعات" 
                      name="sales"
                      stroke={theme === 'dark' ? '#60A5FA' : '#3B82F6'} 
                      fill={theme === 'dark' ? 'rgba(96, 165, 250, 0.2)' : 'rgba(59, 130, 246, 0.2)'} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="منتجات" 
                      name="products"
                      stroke={theme === 'dark' ? '#34D399' : '#10B981'} 
                      fill={theme === 'dark' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(16, 185, 129, 0.2)'} 
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>توزيع المنتجات حسب الفئة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}`, 'الكمية']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>إحصائيات المبيعات حسب الفئة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ChartContainer config={chartConfig}>
                  <BarChart
                    data={categoryData}
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
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar 
                      dataKey="value" 
                      name="الكمية" 
                      fill={theme === 'dark' ? '#60A5FA' : '#3B82F6'} 
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
