
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import RestaurantLayout from '@/components/layout/RestaurantLayout';

// Mock data for the charts
const inventoryData = [
  { name: 'يناير', inventory: 400 },
  { name: 'فبراير', inventory: 300 },
  { name: 'مارس', inventory: 600 },
  { name: 'أبريل', inventory: 800 },
  { name: 'مايو', inventory: 500 },
  { name: 'يونيو', inventory: 700 },
];

const usageData = [
  { name: 'اللحوم', value: 30 },
  { name: 'الخضروات', value: 25 },
  { name: 'الحبوب', value: 15 },
  { name: 'الألبان', value: 20 },
  { name: 'التوابل', value: 10 },
];

const trendData = [
  { name: 'يناير', استهلاك: 400, مخزون: 240 },
  { name: 'فبراير', استهلاك: 300, مخزون: 139 },
  { name: 'مارس', استهلاك: 200, مخزون: 980 },
  { name: 'أبريل', استهلاك: 278, مخزون: 390 },
  { name: 'مايو', استهلاك: 189, مخزون: 480 },
  { name: 'يونيو', استهلاك: 239, مخزون: 380 },
  { name: 'يوليو', استهلاك: 349, مخزون: 430 },
];

const expiryData = [
  { name: 'هذا الشهر', value: 12 },
  { name: 'الشهر القادم', value: 19 },
  { name: 'بعد شهرين', value: 33 },
  { name: 'بعد ثلاثة أشهر', value: 45 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Reports = () => {
  const [activeTab, setActiveTab] = useState('inventory');

  return (
    <RestaurantLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">التقارير والإحصائيات</h1>
            <p className="text-muted-foreground">تتبع حالة المخزون والاستهلاك</p>
          </div>
          <DatePickerWithRange className="w-full md:w-auto" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="inventory">المخزون</TabsTrigger>
            <TabsTrigger value="usage">الاستهلاك</TabsTrigger>
            <TabsTrigger value="trends">الاتجاهات</TabsTrigger>
            <TabsTrigger value="expiry">الصلاحية</TabsTrigger>
          </TabsList>
          
          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>تقرير المخزون الشهري</CardTitle>
                <CardDescription>عرض تغيرات المخزون خلال الأشهر الستة الماضية</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={inventoryData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        formatter={(value) => [`${value} وحدة`, 'المخزون']}
                      />
                      <Legend />
                      <Bar dataKey="inventory" name="المخزون" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="usage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>توزيع الاستهلاك حسب الفئة</CardTitle>
                <CardDescription>نسب استهلاك المواد الغذائية حسب فئاتها</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={usageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={140}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({
                          cx,
                          cy,
                          midAngle,
                          innerRadius,
                          outerRadius,
                          percent,
                          name,
                        }) => {
                          const RADIAN = Math.PI / 180;
                          const radius = innerRadius + (outerRadius - innerRadius) * 1.1;
                          const x = cx + radius * Math.cos(-midAngle * RADIAN);
                          const y = cy + radius * Math.sin(-midAngle * RADIAN);

                          return (
                            <text
                              x={x}
                              y={y}
                              fill="#333"
                              textAnchor={x > cx ? 'start' : 'end'}
                              dominantBaseline="central"
                            >
                              {`${name}: ${(percent * 100).toFixed(0)}%`}
                            </text>
                          );
                        }}
                      >
                        {usageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} %`, 'النسبة']}
                      />
                      <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>اتجاهات المخزون والاستهلاك</CardTitle>
                <CardDescription>مقارنة بين معدلات الاستهلاك والمخزون</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={trendData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <Line
                        type="monotone"
                        dataKey="استهلاك"
                        stroke="#8884d8"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="مخزون"
                        stroke="#82ca9d"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="expiry" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>تقرير انتهاء الصلاحية</CardTitle>
                <CardDescription>المنتجات التي ستنتهي صلاحيتها قريباً</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={expiryData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                      barSize={50}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        formatter={(value) => [`${value} منتج`, 'العدد']}
                      />
                      <Legend />
                      <Bar dataKey="value" name="عدد المنتجات" fill="#f97316" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RestaurantLayout>
  );
};

export default Reports;
