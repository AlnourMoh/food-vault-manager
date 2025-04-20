
import React, { useEffect } from 'react';
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  
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
    }
  }, [navigate]);

  // بيانات إحصائية نموذجية - في التطبيق الحقيقي، ستأتي من قاعدة البيانات
  const stats = [
    {
      title: "المطاعم",
      value: "12",
      icon: <BuildingIcon className="h-6 w-6 text-blue-500" />,
      color: "bg-blue-50"
    },
    {
      title: "المستخدمين",
      value: "48",
      icon: <Users className="h-6 w-6 text-green-500" />,
      color: "bg-green-50"
    },
    {
      title: "المنتجات",
      value: "156",
      icon: <ShoppingCart className="h-6 w-6 text-purple-500" />,
      color: "bg-purple-50"
    },
    {
      title: "التقارير",
      value: "24",
      icon: <BarChartIcon className="h-6 w-6 text-amber-500" />,
      color: "bg-amber-50"
    }
  ];

  // بيانات المبيعات الشهرية
  const monthlyData = [
    { name: 'يناير', مبيعات: 4000 },
    { name: 'فبراير', مبيعات: 3000 },
    { name: 'مارس', مبيعات: 2000 },
    { name: 'أبريل', مبيعات: 2780 },
    { name: 'مايو', مبيعات: 1890 },
    { name: 'يونيو', مبيعات: 2390 },
  ];

  // بيانات توزيع المنتجات حسب الفئة
  const categoryData = [
    { name: 'حبوب', value: 400 },
    { name: 'خضروات', value: 300 },
    { name: 'لحوم', value: 300 },
    { name: 'فواكه', value: 200 },
  ];

  // ألوان للمخطط الدائري
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">لوحة تحكم المسؤول</h1>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className={`flex flex-row items-center justify-between pb-2 ${stat.color} rounded-t-lg`}>
                <CardTitle className="text-md font-medium">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>المبيعات الشهرية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthlyData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="مبيعات" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
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
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
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
                <ResponsiveContainer width="100%" height="100%">
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
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="الكمية" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
